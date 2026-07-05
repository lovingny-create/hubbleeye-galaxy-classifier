"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onClear: () => void;
  isLoading: boolean;
}

export function ImageUploader({
  onImageSelect,
  onClear,
  isLoading,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onImageSelect(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onClear();
  };

  return (
    <Card className="relative w-full bg-[#131929] border-[#1E2A45] rounded-lg overflow-hidden">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
      {preview ? (
        <>
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain bg-black/20"
            />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition-colors"
              title="이미지 제거"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`p-6 sm:p-8 md:p-12 text-center cursor-pointer transition-all border-2 border-dashed rounded-lg ${
            isDragActive
              ? "border-[#00E5FF] bg-[#00E5FF]/10"
              : "border-[#1E2A45] bg-[#0B0F19]/50 hover:border-[#00E5FF]/50"
          }`}
        >
          <div
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer"
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🌌</div>
            <p className="text-[#F3F4F6] text-base sm:text-lg font-semibold mb-1">
              은하 이미지 업로드
            </p>
            <p className="text-[#8B9CB8] text-xs sm:text-sm mb-3 sm:mb-4">
              드래그 앤 드롭 또는 클릭하여 이미지를 선택하세요
            </p>
            <p className="text-[#8B9CB8] text-xs">JPG, PNG 등 이미지 파일</p>
          </div>
        </div>
      )}

      {preview && (
        <div className="p-3 sm:p-4 border-t border-[#1E2A45] flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => inputRef.current?.click()}
            variant="outline"
            className="flex-1 border-[#1E2A45] text-[#F3F4F6] hover:bg-[#1E2A45]"
          >
            다른 이미지 선택
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="border-[#1E2A45] text-[#F3F4F6] hover:bg-red-500/20"
          >
            초기화
          </Button>
        </div>
      )}
    </Card>
  );
}
