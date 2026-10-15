'use client';

import React, { useState } from 'react';
import { Server, Database, Cloud, RefreshCw, CheckCircle, AlertTriangle, Copy, Terminal, Shield } from 'lucide-react';

interface DokployTabProps {
  dbStatus: {
    status: 'connected' | 'disconnected' | 'checking';
    latencyMs?: number;
    stats?: {
      matchesInDb: number;
      playersInDb: number;
    };
    error?: string;
    message?: string;
  };
  onRefreshStatus: () => void;
}

export function DokployTab({ dbStatus, onRefreshStatus }: DokployTabProps) {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSeedDokploy = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      setSeedResult(data);
      onRefreshStatus();
    } catch (err: any) {
      setSeedResult({ success: false, error: err.message });
    } finally {
      setIsSeeding(false);
    }
  };

  const sampleDbUrl = 'postgresql://postgres:tu_contraseña@IP_DE_TU_VPS:5432/ligapadel?sslmode=prefer';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-purple-400" />
          <span>Configuración de Dokploy (VPS) & Despliegue en Netlify</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          La aplicación web se aloja en <strong>Netlify</strong> y consulta directamente la base de datos <strong>PostgreSQL</strong> alojada en tu <strong>VPS Dokploy</strong>.
        </p>
      </div>

      {/* Dokploy Connection Status Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${
                dbStatus.status === 'connected'
                  ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-400'
                  : 'bg-amber-950/60 border border-amber-500 text-amber-400'
              }`}
            >
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Estado de la Base de Datos PostgreSQL</h3>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    dbStatus.status === 'connected'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {dbStatus.status === 'connected' ? 'En línea en Dokploy' : 'Modo Local / Esperando VPS'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {dbStatus.message || (dbStatus.status === 'connected' ? 'Conexión activa y sincronizada.' : 'Funcionando con memoria local')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshStatus}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dbStatus.status === 'checking' ? 'animate-spin' : ''}`} />
              <span>Verificar</span>
            </button>

            <button
              onClick={handleSeedDokploy}
              disabled={isSeeding}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSeeding ? 'Inicializando...' : 'Poblar BD en Dokploy'}</span>
            </button>
          </div>
        </div>

        {/* Detalle de error si no conecta */}
        {dbStatus.status !== 'connected' && dbStatus.error && (
          <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-300">
            <span className="font-bold">Aviso de conexión:</span> {dbStatus.error}
          </div>
        )}

        {/* Resultado del seed */}
        {seedResult && (
          <div
            className={`p-3 rounded-xl border text-xs ${
              seedResult.success
                ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300'
                : 'bg-rose-950/40 border-rose-600 text-rose-300'
            }`}
          >
            {seedResult.success ? (
              <p>
                ✓ {seedResult.message} ({seedResult.playersCount} jugadores, {seedResult.matchesCount} partidos).
              </p>
            ) : (
              <p>✗ Error al poblar Dokploy: {seedResult.error}</p>
            )}
          </div>
        )}
      </div>

      {/* Guía Rápida para Dokploy y Netlify */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Paso 1: Dokploy VPS */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="font-bold text-white text-sm">Crear PostgreSQL en tu Dokploy</h3>
          </div>

          <ol className="text-xs text-slate-300 space-y-2.5 list-decimal list-inside">
            <li>Entra a tu panel de <strong>Dokploy</strong> en tu VPS.</li>
            <li>Haz clic en <strong>Databases</strong> &rarr; <strong>Create Database</strong> &rarr; Selecciona <strong>PostgreSQL</strong>.</li>
            <li>En la configuración, asigna el nombre de la BD: <code className="text-emerald-400 font-mono">ligapadel</code>.</li>
            <li>
              Asegúrate de marcar <strong>Expose Port</strong> (puerto 5432 o el que elijas) para que Netlify pueda conectarse desde fuera.
            </li>
            <li>Copia la URL de conexión que te da Dokploy o constrúyela así:</li>
          </ol>

          <div className="relative bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 break-all">
            {sampleDbUrl}
            <button
              onClick={() => handleCopy(sampleDbUrl, 'dburl')}
              className="absolute top-2 right-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              {copiedText === 'dburl' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Paso 2: Despliegue en Netlify */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="font-bold text-white text-sm">Publicar en Netlify con 1 Clic</h3>
          </div>

          <ol className="text-xs text-slate-300 space-y-2.5 list-decimal list-inside">
            <li>El repositorio ya contiene el archivo <code className="text-emerald-400 font-mono">netlify.toml</code> listo para compilar.</li>
            <li>En tu panel de <strong>Netlify</strong>, añade el proyecto desde tu GitHub / GitLab.</li>
            <li>
              En <strong>Site configuration &rarr; Environment variables</strong> añade:
              <div className="mt-1.5 p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-200">
                <strong>DATABASE_URL</strong> = <em>tu url de Dokploy PostgreSQL</em>
              </div>
            </li>
            <li>Haz clic en <strong>Deploy site</strong>. Netlify desplegará la app Next.js de forma ultra-rápida.</li>
          </ol>

          <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>Los cambios de resultados que metas en Netlify se guardarán en tu Dokploy al instante.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
