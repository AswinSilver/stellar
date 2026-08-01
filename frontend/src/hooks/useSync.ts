import { useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useStore, type UploadedFile } from '../store/useStore';

// Simple debounce utility for saving
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function useSync(secretCode: string) {
  const { setNote, setIsSaving, note, setFiles, setImages, files, images } = useStore();

  useEffect(() => {
    if (!secretCode) return;

    const isFirebaseConfigured = db.app.options.projectId !== "dummy-project-id" && !!db.app.options.projectId;

    if (!isFirebaseConfigured) {
      console.warn("Firebase is not configured! Falling back to local-only mode for demonstration.");
      return;
    }

    const docRef = doc(db, 'workspaces', secretCode);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.note) {
          setNote({ content: data.note, lastEdited: data.lastEdited || Date.now() });
        }
        if (data.files) setFiles(data.files);
        if (data.images) setImages(data.images);
      } else {
        setDoc(docRef, {
          note: '',
          lastEdited: Date.now(),
          files: [],
          images: [],
          createdAt: Date.now()
        });
      }
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => unsubscribe();
  }, [secretCode, setNote, setFiles, setImages]);

  // Create a debounced save function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveToFirebase = useCallback(
    debounce(async (content: string, code: string) => {
      const isFirebaseConfigured = db.app.options.projectId !== "dummy-project-id" && !!db.app.options.projectId;
      if (!isFirebaseConfigured) {
        setIsSaving(false);
        return;
      }

      const docRef = doc(db, 'workspaces', code);
      try {
        await updateDoc(docRef, {
          note: content,
          lastEdited: Date.now()
        });
        setIsSaving(false);
      } catch (error) {
        console.error("Error saving document: ", error);
        setIsSaving(false);
      }
    }, 1000),
    []
  );

  const handleNoteChange = (newContent: string) => {
    setNote({ content: newContent, lastEdited: Date.now() });
    setIsSaving(true);
    saveToFirebase(newContent, secretCode);
  };

  const uploadFile = async (file: File) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary is not configured! Please add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env.local file.");
      return;
    }

    setIsSaving(true);
    const fileId = Math.random().toString(36).substring(2, 15);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      // Use 'auto' to handle both images and raw files (PDFs, docs, etc)
      const resourceType = file.type.startsWith('image/') || file.type.startsWith('video/') ? 'auto' : 'raw';
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.secure_url) {
        const newFile: UploadedFile = {
          id: fileId,
          name: file.name,
          url: data.secure_url,
          type: file.type,
          size: file.size,
          publicId: data.public_id
        };

        const docRef = doc(db, 'workspaces', secretCode);
        
        if (file.type.startsWith('image/')) {
          await updateDoc(docRef, { images: [...images, newFile] });
        } else {
          await updateDoc(docRef, { files: [...files, newFile] });
        }
        return newFile;
      } else {
        console.error("Cloudinary upload failed:", data);
        alert("Failed to upload file to Cloudinary.");
        return null;
      }
    } catch (error) {
      console.error("Upload error", error);
      alert("Error uploading file.");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteFile = async (file: UploadedFile, type: 'image' | 'file') => {
    try {
      setIsSaving(true);
      const docRef = doc(db, 'workspaces', secretCode);
      
      // 1. Delete from Firestore
      if (type === 'image') {
        const newImages = images.filter(img => img.id !== file.id);
        await updateDoc(docRef, { images: newImages });
      } else {
        const newFiles = files.filter(f => f.id !== file.id);
        await updateDoc(docRef, { files: newFiles });
      }

      // 2. Delete from Cloudinary (if API Key/Secret is provided in .env)
      const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
      const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

      if (apiKey && apiSecret && cloudName) {
        let publicId = file.publicId;
        if (!publicId) {
          const parts = file.url.split('/');
          const filename = parts[parts.length - 1];
          publicId = filename.split('.')[0];
        }

        const timestamp = Math.round(new Date().getTime() / 1000);
        const str = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
        
        // Generate SHA-1
        const msgUint8 = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('signature', signature);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp.toString());

        const resourceType = type === 'image' ? 'image' : 'raw';
        await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
          method: 'POST',
          body: formData
        });
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    note,
    handleNoteChange,
    uploadFile,
    deleteFile
  };
}
