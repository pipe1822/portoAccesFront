"use client";
import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QrScannerProps {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export default function QrScanner({ onScan, onError, disabled }: QrScannerProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (disabled) return;
    if (!qrRef.current) return;
    const qrCode = new Html5Qrcode(qrRef.current.id);
    html5QrCodeRef.current = qrCode;
    qrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          onScan(decodedText);
          qrCode.stop(); // Detener después de un escaneo exitoso
        },
        (error) => {
          if (onError) onError(error);
        }
      )
      .catch((err) => {
        if (onError) onError(err);
      });
    return () => {
      try { qrCode.stop(); } catch {}
      try { qrCode.clear(); } catch {}
    };
    // eslint-disable-next-line
  }, [disabled]);

  return (
    <div className="flex justify-center w-full">
      <div
        id="qr-reader"
        ref={qrRef}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square rounded-xl overflow-hidden shadow-lg"
      />
    </div>
  );
} 