import { useState } from 'react';
import UploadZone from '../UploadZone';

export default function UploadZoneExample() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (file: File) => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return <UploadZone onUpload={handleUpload} isProcessing={isProcessing} />;
}
