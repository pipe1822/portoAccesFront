"use client";
import { useState } from "react";
import { useAuthGuard } from "../../context/useAuthGuard";
import { useAuth } from "../../context/AuthContext";
import QrScanner from "../../components/QrScanner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PorteriaPage() {
  useAuthGuard(["portero"]);
  const { user, token } = useAuth();
  const [scanResult, setScanResult] = useState<null | { valido: boolean; nombre?: string; tipo?: string; mensaje?: string }>(null);
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = async (qrToken: string) => {
    setScanning(false); // Bloquear doble escaneo
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/validar-qr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ qr_token: qrToken }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setScanResult({
          valido: true,
          nombre: data.usuario?.nombre,
          tipo: data.usuario?.tipo_usuario,
          mensaje: data.mensaje || "QR válido",
        });
      } else {
        setScanResult({
          valido: false,
          mensaje: data.mensaje || "QR inválido o expirado",
        });
      }
    } catch {
      setScanResult({ valido: false, mensaje: "Error de conexión con el servidor" });
    }
  };

  const handleRestart = () => {
    setScanResult(null);
    setScanning(true);
  };

  const handleStartScan = () => {
    setShowScanner(true);
    setScanResult(null);
    setScanning(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-white">Portería</h1>
      <p className="mb-2 text-gray-200">Bienvenido, {user?.nombre} ({user?.tipo_usuario})</p>
      {!showScanner && (
        <button
          onClick={handleStartScan}
          className="mb-6 px-6 py-2 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
        >
          Escanear QR
        </button>
      )}
      {showScanner && scanning ? (
        <>
          <QrScanner onScan={handleScan} disabled={!scanning} />
          <p className="mt-4 text-gray-300">Escanea un código QR</p>
        </>
      ) : null}
      {showScanner && !scanning && (
        <div className={`mt-6 p-6 rounded-xl shadow-lg flex flex-col items-center ${scanResult?.valido ? "bg-green-900 border border-green-700" : "bg-red-900 border border-red-700"}`}>
          <h2 className={`text-2xl font-bold mb-2 ${scanResult?.valido ? "text-green-300" : "text-red-300"}`}>
            {scanResult?.valido ? "✅ Acceso permitido" : "❌ Acceso denegado"}
          </h2>
          <div className="text-lg mb-2 text-white">{scanResult?.mensaje}</div>
          {scanResult?.valido && (
            <div className="text-center">
              <div className="font-medium text-gray-200">Nombre: {scanResult.nombre}</div>
              <div className="font-medium text-gray-200">Tipo: {scanResult.tipo}</div>
            </div>
          )}
          <button
            onClick={handleRestart}
            className="mt-4 px-6 py-2 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Escanear otro QR
          </button>
        </div>
      )}
      {error && <div className="text-red-400 mt-4">{error}</div>}
    </div>
  );
} 