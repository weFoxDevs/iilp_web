import React, { useEffect, useRef, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

/**
 * WYSIWYG editor built on Quill v2 directly (no react-quill wrapper).
 * React 19 compatible — uses useRef + useEffect, no findDOMNode.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write article body here…",
  minHeight = 280,
}: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Track whether we're in raw HTML mode
  const [showRaw, setShowRaw] = useState(false);
  // Keep a stable copy of the raw HTML for the textarea
  const [rawHtml, setRawHtml] = useState(value);

  // Sync rawHtml when value changes externally (e.g. modal opens with existing data)
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    if (typeof window === "undefined") return;

    let quillInstance: InstanceType<typeof import("quill")["default"]> | null = null;

    // Dynamically import Quill (client-only)
    import("quill").then(({ default: Quill }) => {
      if (!containerRef.current || quillRef.current) return;

      quillInstance = new Quill(containerRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["blockquote", "code-block"],
            ["link"],
            ["clean"],
          ],
        },
      });

      quillRef.current = quillInstance;

      // Set initial content
      if (valueRef.current) {
        quillInstance.clipboard.dangerouslyPasteHTML(valueRef.current);
      }

      // Listen for changes and emit HTML
      quillInstance.on("text-change", () => {
        const html = quillInstance!.getSemanticHTML();
        setRawHtml(html);
        onChangeRef.current(html);
      });
    });

    return () => {
      quillRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the editor is mounted and value changes externally (modal switches articles),
  // push the new value into Quill without triggering the onChange loop.
  useEffect(() => {
    if (quillRef.current && !showRaw) {
      const current = quillRef.current.getSemanticHTML();
      if (current !== value) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value || "");
        setRawHtml(value || "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleRawChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const html = e.target.value;
    setRawHtml(html);
    onChangeRef.current(html);
    // Sync back to quill when switching back to editor view
    if (quillRef.current) {
      quillRef.current.clipboard.dangerouslyPasteHTML(html);
    }
  };

  return (
    <div className="rich-editor-root rounded-xl border border-gray-300 overflow-hidden focus-within:border-[#000080] focus-within:ring-1 focus-within:ring-[#000080] transition-all">
      {/* Scoped Quill overrides */}
      <style>{`
        .rich-editor-root .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          padding: 6px 8px;
          font-family: inherit;
          flex-wrap: wrap;
        }
        .rich-editor-root .ql-container.ql-snow {
          border: none;
          font-size: 13px;
          font-family: inherit;
        }
        .rich-editor-root .ql-editor {
          min-height: ${minHeight}px;
          padding: 12px 14px;
          line-height: 1.75;
          color: #0a0d12;
        }
        .rich-editor-root .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
          font-size: 12px;
        }
        .rich-editor-root .ql-editor h1 { font-size: 1.5rem; font-weight: 700; margin: .75rem 0 .4rem; }
        .rich-editor-root .ql-editor h2 { font-size: 1.2rem; font-weight: 700; margin: .65rem 0 .35rem; }
        .rich-editor-root .ql-editor h3 { font-size: 1.05rem; font-weight: 600; margin: .55rem 0 .3rem; }
        .rich-editor-root .ql-editor p  { margin: 0 0 .55rem; }
        .rich-editor-root .ql-editor ul,
        .rich-editor-root .ql-editor ol  { padding-left: 1.5rem; margin-bottom: .55rem; }
        .rich-editor-root .ql-editor blockquote {
          border-left: 3px solid #000080;
          padding-left: 12px;
          margin: .6rem 0;
          color: #475467;
          font-style: italic;
        }
        .rich-editor-root .ql-editor pre {
          background: #f1f5f9;
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 12px;
          margin: .6rem 0;
        }
        .rich-editor-root .ql-snow .ql-picker-label { color: #374151; }
        .rich-editor-root .ql-snow .ql-stroke { stroke: #374151; }
        .rich-editor-root .ql-snow .ql-fill  { fill:  #374151; }
        .rich-editor-root .ql-snow.ql-toolbar button:hover .ql-stroke,
        .rich-editor-root .ql-snow.ql-toolbar button.ql-active .ql-stroke { stroke: #000080; }
        .rich-editor-root .ql-snow.ql-toolbar button:hover .ql-fill,
        .rich-editor-root .ql-snow.ql-toolbar button.ql-active .ql-fill  { fill:  #000080; }
        .rich-editor-root .ql-snow.ql-toolbar .ql-picker-label:hover,
        .rich-editor-root .ql-snow.ql-toolbar .ql-picker-label.ql-active { color: #000080; }
      `}</style>

      {/* Header strip: Raw HTML toggle */}
      <div className="flex items-center justify-end bg-[#f9fafb] border-b border-gray-200 px-3 py-1.5 gap-3">
        <span className="text-[10px] text-gray-400">WYSIWYG · outputs HTML</span>
        <button
          type="button"
          onClick={() => setShowRaw((s) => !s)}
          className="text-[10px] font-semibold text-[#475467] hover:text-[#000080] border border-gray-200 rounded px-2 py-0.5 transition-colors cursor-pointer"
        >
          {showRaw ? "◀ Editor" : "‹/› Raw HTML"}
        </button>
      </div>

      {/* Quill editor container — always mounted so the instance persists */}
      <div
        ref={containerRef}
        style={{ display: showRaw ? "none" : "block" }}
      />

      {/* Raw HTML textarea fallback */}
      {showRaw && (
        <textarea
          value={rawHtml}
          onChange={handleRawChange}
          placeholder={placeholder}
          style={{ minHeight }}
          className="w-full px-3 py-3 text-xs font-mono text-gray-700 outline-none resize-y bg-white"
        />
      )}
    </div>
  );
}
