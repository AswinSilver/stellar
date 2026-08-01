import { create } from 'zustand';

export interface Note {
  content: string;
  lastEdited: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  publicId?: string;
}

interface WorkspaceState {
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  note: Note;
  setNote: (note: Note) => void;
  files: UploadedFile[];
  setFiles: (files: UploadedFile[]) => void;
  images: UploadedFile[];
  setImages: (images: UploadedFile[]) => void;
  connectedDevices: number;
  setConnectedDevices: (count: number) => void;
}

export const useStore = create<WorkspaceState>((set) => ({
  isSaving: false,
  setIsSaving: (isSaving) => set({ isSaving }),
  note: { content: '', lastEdited: Date.now() },
  setNote: (note) => set({ note }),
  files: [],
  setFiles: (files) => set({ files }),
  images: [],
  setImages: (images) => set({ images }),
  connectedDevices: 1,
  setConnectedDevices: (connectedDevices) => set({ connectedDevices }),
}));
