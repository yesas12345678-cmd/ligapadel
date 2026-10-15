'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface AuthGateProps {
  onSuccess: () => void;
}

export const LEAGUE_PASSWORD = 'LigaPadel2026';
export const AUTH_STORAGE_KEY = 'ligapadel_auth_token_v1';

export function AuthGate({ onSuccess }: AuthGateProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    setTimeout(() => {
      if (password.trim() === LEAGUE_PASSWORD) {
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, LEAGUE_PASSWORD);
        } catch (err) {
          console.warn('Error saving auth to localStorage:', err);
        }
        onSuccess();
      } else {
        setError(true);
        setIsLoading(false);
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-lime-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Login Card */}
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-7">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20">
            <span className="text-3xl">🎾</span>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acceso Privado</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              LIGA PÁDEL 2026
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Introduce la contraseña de la liga. Solo tendrás que ingresarla una vez en este dispositivo.
            </p>
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Escribe la contraseña..."
                autoFocus
                required
                className={`w-full bg-slate-950/90 border rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                  error
                    ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-500/30'
                    : 'border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-rose-400">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Contraseña incorrecta. Vuelve a intentarlo.</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{isLoading ? 'Verificando...' : 'Entrar a la Liga'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500">
          Se guardará en este navegador para que no tengas que volver a escribirla.
        </div>

      </div>
    </div>
  );
}
