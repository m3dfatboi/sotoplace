"use client";

import { useRef, useState, useCallback, type DragEvent, type ChangeEvent } from "react";
import { UploadSimple, FileText, X, CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { Progress } from "./progress";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "done" | "error";
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMb?: number;
  label?: string;
  hint?: string;
  onFilesChange?: (files: File[]) => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

export function FileUpload({ accept, multiple = false, maxSizeMb = 50, label, hint, onFilesChange }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const validFiles = Array.from(fileList).filter((f) => f.size <= maxSizeMb * 1024 * 1024);
    onFilesChange?.(validFiles);
    const newEntries: UploadedFile[] = validFiles.map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: f.size,
      progress: 0,
      status: "uploading",
    }));
    setFiles((prev) => multiple ? [...prev, ...newEntries] : newEntries);

    // Simulate upload progress
    newEntries.forEach((entry) => {
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 30;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setFiles((prev) => prev.map((f) => f.id === entry.id ? { ...f, progress: 100, status: "done" } : f));
        } else {
          setFiles((prev) => prev.map((f) => f.id === entry.id ? { ...f, progress: p } : f));
        }
      }, 200);
    });
  }, [maxSizeMb, multiple, onFilesChange]);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-[13px] font-medium text-text-primary">{label}</p>}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border-2 border-dashed px-6 py-8 cursor-pointer transition-colors",
          dragging ? "border-primary bg-primary-light" : "border-border hover:border-border-strong hover:bg-subtle"
        )}
      >
        <UploadSimple size={28} className={dragging ? "text-primary" : "text-text-tertiary"} />
        <div className="text-center">
          <p className="text-sm font-medium text-text-primary">
            Перетащите файлы или{" "}
            <span className="text-primary">нажмите для выбора</span>
          </p>
          <p className="mt-1 text-xs text-text-tertiary">
            {hint || `${accept?.toUpperCase() || "Любые файлы"}, до ${maxSizeMb} МБ`}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2 mt-2">
          {files.map((f) => (
            <div key={f.id} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2.5">
              <FileText size={20} className="text-text-tertiary shrink-0" />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium truncate">{f.name}</span>
                  <span className="text-xs text-text-tertiary shrink-0">{formatBytes(f.size)}</span>
                </div>
                {f.status === "uploading" && <Progress value={f.progress} size="sm" />}
              </div>
              {f.status === "done" && <CheckCircle size={16} weight="fill" className="text-success shrink-0" />}
              <button
                onClick={(e) => { e.stopPropagation(); setFiles((prev) => prev.filter((x) => x.id !== f.id)); }}
                className="shrink-0 text-text-tertiary hover:text-danger transition-colors"
                aria-label="Удалить файл"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
