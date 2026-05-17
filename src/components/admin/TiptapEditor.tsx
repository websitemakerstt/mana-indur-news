"use client";

import { useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { toast } from 'sonner';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true }),
      Youtube.configure({ width: 640, height: 480 }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[400px] max-w-none',
      },
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be uploaded again if needed
    event.target.value = '';

    const toastId = toast.loading('Uploading image...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const data = await response.json();
      editor.chain().focus().setImage({ src: data.url }).run();
      toast.success('Image uploaded successfully', { id: toastId });
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image', { id: toastId });
    }
  };

  const addYoutube = () => {
    const url = window.prompt('YouTube URL');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

  const setLink = () => {
    const url = window.prompt('Link URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border rounded-md bg-white">
      <div className="border-b p-2 flex flex-wrap gap-1 bg-gray-50 sticky top-0 z-10 rounded-t-md">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={18} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={18} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 size={18} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={18} />
        </Toggle>
        <div className="w-[1px] bg-gray-300 mx-1" />
        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={18} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={18} />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('blockquote')}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={18} />
        </Toggle>
        <div className="w-[1px] bg-gray-300 mx-1" />
        <Button variant="ghost" size="sm" onClick={setLink}>
          <LinkIcon size={18} />
        </Button>
        <Button variant="ghost" size="sm" onClick={addImage}>
          <ImageIcon size={18} />
        </Button>
        <Button variant="ghost" size="sm" onClick={addYoutube}>
          {/* YouTube placeholder icon */}
          <LinkIcon size={18} />
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={18} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={18} />
        </Button>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />
      <EditorContent editor={editor} className="p-4" />
    </div>
  );
}

