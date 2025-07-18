"use client";
import { useState } from "react";
import { useAuthGuard } from "../../context/useAuthGuard";
import { useAuth } from "../../context/AuthContext";
import QRCode from "react-qr-code";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function VisitantePage() {
  useAuthGuard(["residente"]);
  const { token } = useAuth();
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [duracion, setDuracion] = useState(30);
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [expira, setExpira] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setQrValue(null);
    setExpira(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/qr-visitante`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre_visitante: nombre,
          documento_visitante: documento,
          duracion_minutos: duracion,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error al generar QR");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setQrValue(data.tokenQR || "");
      setExpira(data.expira || null);
      setLoading(false);
    } catch (err) {
      setError("Error de conexión con el servidor");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">QR para Visitante</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm bg-white p-6 rounded-xl shadow-md mb-6">
        <label className="flex flex-col">
          <span className="mb-1 font-medium">Nombre del visitante</span>
          <input
            type="text"
            className="border rounded px-3 py-2"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-1 font-medium">Documento del visitante</span>
          <input
            type="text"
            className="border rounded px-3 py-2"
            value={documento}
            onChange={e => setDocumento(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-1 font-medium">Duración (minutos)</span>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={duracion}
            onChange={e => setDuracion(Number(e.target.value))}
            min={1}
            required
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Generando..." : "Generar QR para visitante"}
        </button>
        {error && <div className="text-red-600 text-sm text-center font-semibold">{error}</div>}
      </form>
      {qrValue && (
        <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-lg shadow-md">
          <QRCode value={qrValue} size={180} />
          <div className="text-center mt-2">
            <div className="font-medium">QR válido para:</div>
            <div>{nombre} ({documento})</div>
            {expira && <div className="text-sm text-gray-500">Expira: {expira}</div>}
          </div>
          <button
            className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => {
              navigator.clipboard.writeText(qrValue);
            }}
          >
            Copiar QR
          </button>
        </div>
      )}
    </div>
  );
} 