'use client';

import React from 'react';
import { Trophy, Calendar, Users, Activity } from 'lucide-react';

interface HeaderProps {
  activeTab: 'standings' | 'matches' | 'players' | 'dokploy';
  setActiveTab: (tab: 'standings' | 'matches' | 'players' | 'dokploy') => void;
  dbStatus: {
    status: 'connected' | 'disconnected' | 'checking';
    latencyMs?: number;
  };
  totalMatches: number;
  playedMatches: number;
}

export function Header({
  activeTab,
  setActiveTab,
  dbStatus,
  totalMatches,
  playedMatches,
}: HeaderProps) {
  const progressPercent = totalMatches > 0 ? Math.round((playedMatches / totalMatches) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-emerald-900/40 text-white shadow-xl shadow-emerald-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/30">
              <span className="text-2xl font-black text-slate-950">🎾</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  LIGA PÁDEL 2026
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold tracking-wide">
                  AMERICANA
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Victoria: <strong>3 pts</strong> · Empate: <strong>1 pt</strong> · Derrota: <strong>0 pts</strong></span>
              </p>
            </div>
          </div>

          {/* Quick Metrics & DB status */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Progress pill */}
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Progreso:</span>
              <span className="font-bold text-emerald-300">
                {playedMatches} / {totalMatches} ({progressPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 sm:space-x-2 border-t border-slate-800/80 pt-2 pb-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('standings')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'standings'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Clasificación</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'matches'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-300" />
            <span>Jornadas y Resultados</span>
          </button>

          <button
            onClick={() => setActiveTab('players')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'players'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-blue-300" />
            <span>Jugadores ({19})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
