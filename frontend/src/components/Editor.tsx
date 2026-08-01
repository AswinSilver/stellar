import { useStore } from '../store/useStore';
import { Bold, Italic, Strikethrough, List, ListOrdered, Code, Heading1, Heading2, Quote, RotateCcw, RotateCw, ImagePlus, Paperclip } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

interface EditorProps {
  onChange: (content: string) => void;
  onUploadFile?: (file: File) => Promise<any>;
}

export default function Editor({ onChange, onUploadFile }: EditorProps) {
  const { note } = useStore();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing...',
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: note.content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none w-full min-h-[50vh] pb-32 pt-4',
      },
    },
  });

  // Keep editor content in sync with external changes (e.g. from Firebase)
  useEffect(() => {
    if (editor && note.content !== editor.getHTML()) {
      const currentPos = editor.state.selection;
      editor.commands.setContent(note.content, { emitUpdate: false });
      editor.commands.setTextSelection(currentPos);
    }
  }, [note.content, editor]);

  if (!editor) {
    return null;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (!file || !onUploadFile) return;

    try {
      const uploadedInfo = await onUploadFile(file);
      if (uploadedInfo && uploadedInfo.url) {
        if (type === 'image') {
          editor.chain().focus().setImage({ src: uploadedInfo.url }).run();
        } else {
          // If there's selected text, make it a link. Otherwise insert the filename as a link.
          if (editor.state.selection.empty) {
            editor.chain().focus().insertContent(`<a href="${uploadedInfo.url}" target="_blank">${file.name}</a> `).run();
          } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: uploadedInfo.url }).run();
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
    
    // Reset input
    e.target.value = '';
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false,
    icon: Icon, 
    label 
  }: any) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={label}
      className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
        isActive 
          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' 
          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      {/* Floating Toolbar */}
      <div className="sticky top-6 z-10 flex items-center gap-1 p-2 rounded-xl glass shadow-lg mx-auto overflow-x-auto custom-scrollbar max-w-full">
        <ToolbarButton
          icon={Heading1}
          label="Heading 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
        />
        <ToolbarButton
          icon={Heading2}
          label="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
        />
        
        <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 mx-1 flex-shrink-0" />
        
        <ToolbarButton
          icon={Bold}
          label="Bold (Ctrl+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        />
        <ToolbarButton
          icon={Italic}
          label="Italic (Ctrl+I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        />
        <ToolbarButton
          icon={Strikethrough}
          label="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
        />
        
        <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 mx-1 flex-shrink-0" />
        
        <ToolbarButton
          icon={List}
          label="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        />
        <ToolbarButton
          icon={ListOrdered}
          label="Numbered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        />
        <ToolbarButton
          icon={Quote}
          label="Quote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
        />
        
        <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 mx-1 flex-shrink-0" />
        
        <ToolbarButton
          icon={Code}
          label="Code Block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
        />
        
        <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 mx-1 flex-shrink-0" />
        
        <ToolbarButton
          icon={RotateCcw}
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        />
        <ToolbarButton
          icon={RotateCw}
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        />
        
        <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 mx-1 flex-shrink-0" />
        
        <input 
          type="file" 
          ref={imageInputRef} 
          onChange={(e) => handleFileUpload(e, 'image')} 
          accept="image/*" 
          className="hidden" 
        />
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => handleFileUpload(e, 'file')} 
          className="hidden" 
        />
        
        <ToolbarButton
          icon={ImagePlus}
          label="Insert Image"
          onClick={() => imageInputRef.current?.click()}
          disabled={!onUploadFile}
        />
        <ToolbarButton
          icon={Paperclip}
          label="Attach File"
          onClick={() => fileInputRef.current?.click()}
          disabled={!onUploadFile}
        />
      </div>

      {/* Editor Area */}
      <div className="relative mt-2 px-2">
        <EditorContent editor={editor} />
      </div>
      
      {/* Required for placeholder styling in Tiptap */}
      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #a3a3a3;
          pointer-events: none;
          height: 0;
        }
        .dark .ProseMirror p.is-editor-empty:first-child::before {
          color: #525252;
        }
        
        /* Make images large and responsive */
        .ProseMirror img {
          width: 100%;
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin-top: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
      `}</style>
    </div>
  );
}
