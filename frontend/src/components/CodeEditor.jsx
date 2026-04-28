import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, onChange, language }) {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Sync external code changes (like File Uploads) to the uncontrolled editor instance
  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== code) {
      editorRef.current.setValue(code);
    }
  }, [code]);

  return (
    <div className="h-full w-full relative group">
      <Editor
        height="100%"
        language={language}
        defaultValue={code} // Uncontrolled initial load
        theme="vs-dark"
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 15,
          fontFamily: "'Fira Code', 'Source Code Pro', Consolas, monospace",
          wordWrap: 'on',
          padding: { top: 24, bottom: 24 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: "on",
          formatOnPaste: true,
          roundedSelection: true,
          automaticLayout: true, // Forces editor to resize if parent changes size
        }}
        className="rounded-xl overflow-hidden shadow-inner absolute inset-0"
      />
      <div className="absolute top-2 right-4 text-xs font-semibold text-gray-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {language}
      </div>
    </div>
  );
}
