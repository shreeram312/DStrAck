"use client";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useMemo, useState } from "react";
import { BlockNoteEditor } from "@blocknote/core";
import { useParams } from "next/navigation";

// Our <Editor> component we can reuse later
export default function Editor() {
  // Creates a new editor instance.
  const [initialContent, setInitialContent] = useState("loading");
  const { id } = useParams();

  async function saveToStorage(id: any, jsonBlocks: any) {
    localStorage.setItem(id, JSON.stringify(jsonBlocks));
  }

  async function loadFromStorage(id: any) {
    // Gets the previously stored editor contents.
    const storageString = localStorage.getItem(id);
    return storageString ? JSON.parse(storageString) : undefined;
  }

  useEffect(() => {
    loadFromStorage(id).then((content) => {
      setInitialContent(content);
    });
  }, []);

  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }
    //@ts-ignore
    return BlockNoteEditor.create({ initialContent });
  }, [initialContent]);

  if (editor === undefined) {
    return "Loading content...";
  }

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      onChange={() => {
        saveToStorage(id, editor.document);
      }}
    />
  );
}
