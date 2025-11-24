import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onUpload?: (file: File) => void;
  isProcessing?: boolean;
}

export default function UploadZone({ onUpload, isProcessing = false }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  }, []);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    onUpload?.(file);
    console.log('File uploaded:', file.name);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <Card
      className={`relative transition-colors ${
        isDragging ? 'border-primary bg-accent' : ''
      } ${isProcessing ? 'opacity-50' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid="upload-zone"
    >
      <div className="flex flex-col items-center justify-center gap-4 p-8 md:p-12 min-h-64">
        {isProcessing ? (
          <>
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-lg font-medium">Processing image...</p>
            <p className="text-sm text-muted-foreground">Extracting demolition information</p>
          </>
        ) : preview ? (
          <>
            <img src={preview} alt="Preview" className="max-h-48 rounded-md" data-testid="img-preview" />
            <p className="text-sm text-muted-foreground">Image uploaded successfully</p>
            <Button
              variant="outline"
              onClick={() => {
                setPreview(null);
                console.log('Upload cleared');
              }}
              data-testid="button-clear-upload"
            >
              Upload Different Image
            </Button>
          </>
        ) : (
          <>
            <div className="rounded-full bg-accent p-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Drop your demolition notice here</p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse files
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              data-testid="input-file"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" asChild data-testid="button-browse">
                <span>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Browse Files
                </span>
              </Button>
            </label>
            <p className="text-xs text-muted-foreground">
              Supports: JPG, PNG, PDF
            </p>
          </>
        )}
      </div>
    </Card>
  );
}
