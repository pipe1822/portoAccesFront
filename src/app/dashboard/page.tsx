"use client";
import { useState } from "react";
import { useAuthGuard } from "../../context/useAuthGuard";
import { useAuth } from "../../context/AuthContext";
import QRCode from "react-qr-code";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  useAuthGuard(["residente", "admin"]);
  const { user, token } = useAuth();
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGenerateQR = async () => {
    setLoading(true);
    setError("");
    setQrValue(null);
    try {
      const res = await fetch(`${API_URL}/api/qr`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error al generar QR");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setQrValue(data.qr_token || "");
      setLoading(false);
    } catch (err) {
      setError("Error de conexión con el servidor");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-2">Bienvenido, {user?.nombre} ({user?.tipo_usuario})</p>
      <button
        onClick={handleGenerateQR}
        className="mb-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Generando..." : "Generar QR"}
      </button>
      <button
        onClick={() => router.push("/visitante")}
        className="mb-6 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
      >
        Generar visitante
      </button>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {qrValue && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <QRCode value={qrValue} size={180} />
        </div>
      )}
    </div>
  );
} 