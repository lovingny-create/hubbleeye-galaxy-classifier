"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ImagePlus } from "lucide-react";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onClear: () => void;
  isLoading: boolean;
}

export function ImageUploaderV2({
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
    <Card className="relative w-full bg-white/80 backdrop-blur-sm border-purple-100 shadow-xl rounded-3xl overflow-hidden">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
      {preview ? (
        <>
          <div className="relative p-6 bg-purple-50/30">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain rounded-2xl shadow-sm"
            />
            <button
              onClick={handleClear}
              className="absolute top-8 right-8 p-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-full shadow-md transition-colors"
              title="이미지 제거"
            >
              <X size={20} />
            </button>
          </div>
        </>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`p-16 m-6 text-center cursor-pointer transition-all border-2 border-dashed rounded-3xl ${
            isDragActive
              ? "border-purple-400 bg-purple-50"
              : "border-purple-200 bg-slate-50/50 hover:border-purple-300 hover:bg-purple-50/30"
          }`}
        >
          <div
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 text-purple-500 shadow-sm">
              <ImagePlus size={32} />
            </div>
            <p className="text-slate-800 text-xl font-bold mb-2">
              은하 이미지를 올려주세요
            </p>
            <p className="text-slate-500 text-sm mb-4">
              끌어다 놓거나 클릭해서 선택할 수 있어요
            </p>
          </div>
        </div>
      )}

      {preview && (
        <div className="p-4 bg-white flex gap-3 border-t border-purple-50">
          <Button
            onClick={() => inputRef.current?.click()}
            variant="outline"
            className="flex-1 rounded-full border-purple-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700"
          >
            다른 사진 고르기
          </Button>
        </div>
      )}
    </Card>
  );
}
