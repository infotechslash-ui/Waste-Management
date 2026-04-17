import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    const constraints: MediaStreamConstraints[] = [
      { video: { facingMode: 'environment' }, audio: false },
      { video: true, audio: false }
    ];

    let lastError: any;

    for (const constraint of constraints) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraint);
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setError(null);
        return; // Success
      } catch (err) {
        lastError = err;
        console.warn(`Camera attempt failed with constraint:`, constraint, err);
      }
    }

    console.error("All camera access attempts failed:", lastError);
    if (lastError?.name === 'NotAllowedError') {
      setError("Camera access denied. Please enable camera permissions in your browser settings.");
    } else if (lastError?.name === 'NotFoundError' || lastError?.name === 'DevicesNotFoundError') {
      setError("No camera found on this device. Please ensure a camera is connected.");
    } else {
      setError("Could not access camera. Please check permissions or try a different browser.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        onCapture(imageData);
        stopCamera();
        onClose();
      }
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-primary shadow-2xl">
        <div className="absolute top-4 right-4 z-10">
          <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-white/20">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="relative aspect-video w-full bg-black">
          {error ? (
            <div className="flex h-full items-center justify-center p-6 text-center text-white">
              <p className="font-heading text-lg">{error}</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex items-center justify-center gap-4 p-6 bg-primary">
          <Button
            onClick={captureImage}
            disabled={!stream}
            className="h-16 w-16 rounded-full bg-white text-primary hover:bg-secondary"
          >
            <Camera className="h-8 w-8" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              stopCamera();
              startCamera();
            }}
            className="h-12 w-12 rounded-full border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
