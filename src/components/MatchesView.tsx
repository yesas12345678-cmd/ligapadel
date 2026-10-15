'use client';

import React, { useState } from 'react';
import { Match } from '@/types/padel';
import { Calendar, Trophy, Edit3, CheckCircle2, Clock, Filter, Sparkles } from 'lucide-react';

interface MatchesViewProps {
  matches: Match[];
  onOpenResultModal: (match: Match) => void;
}

export function MatchesView({ matches, onOpenResultModal }: MatchesViewProps) {
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'played'>('all');

  // Total de 12 jornadas
  const rounds = Array.from({ length: 12 }, (_, i) => i + 1);

  // Partidos de la jornada seleccionada
  const roundMatches = matches.filter((m) => m.round === selectedRound);

  // Filtrado
  const displayedMatches = roundMatches.filter((m) => {
    if (filterMode === 'pending') return !m.isPlayed;
    if (filterMode === 'played') return m.isPlayed;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar with Jornada Selector */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Jornadas y Calendario de Partidos</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Selecciona una jornada para ver las 4 parejas emparejadas e introducir el resultado.
            </p>
          </div>

          {/* Quick Filter: All / Pending / Played */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-center">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterMode === 'all'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterMode === 'pending'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilterMode('played')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterMode === 'played'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Jugados
            </button>
          </div>
        </div>

        {/* Jornadas Pills (1 a 12) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {rounds.map((r) => {
            const matchesInR = matches.filter((m) => m.round === r);
            const playedInR = matchesInR.filter((m) => m.isPlayed).length;
            const isCompleted = playedInR === matchesInR.length && matchesInR.length > 0;
            const isSelected = selectedRound === r;

            return (
              <button
                key={r}
                onClick={() => setSelectedRound(r)}
                className={`flex flex-col items-center min-w-[76px] px-3 py-2 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/40'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider">Jornada</span>
                <span className="text-base font-black">{r}</span>
                <span
                  className={`text-[10px] mt-0.5 px-1.5 py-0.2 rounded-full font-semibold ${
                    isCompleted
                      ? 'bg-emerald-400/20 text-emerald-300'
                      : playedInR > 0
                      ? 'bg-amber-400/20 text-amber-300'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {playedInR}/4
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Matches for this Round */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedMatches.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm">No hay partidos con el filtro actual en la Jornada {selectedRound}.</p>
          </div>
        ) : (
          displayedMatches.map((m) => {
            const isWinnerP1 = m.winner === 'PAIR1';
            const isWinnerP2 = m.winner === 'PAIR2';
            const isDraw = m.winner === 'DRAW';

            // Formatear sets
            const setsFormatted = [];
            if (m.set1Pair1 !== null && m.set1Pair2 !== null) {
              setsFormatted.push(`${m.set1Pair1}-${m.set1Pair2}`);
            }
            if (m.set2Pair1 !== null && m.set2Pair2 !== null) {
              setsFormatted.push(`${m.set2Pair1}-${m.set2Pair2}`);
            }
            if (m.set3Pair1 !== null && m.set3Pair2 !== null) {
              setsFormatted.push(`${m.set3Pair1}-${m.set3Pair2}`);
            }

            return (
              <div
                key={m.id}
                className={`bg-slate-900/80 rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-lg relative overflow-hidden ${
                  m.isPlayed
                    ? 'border-slate-700/80 shadow-slate-950/40'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Court Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-60"></div>

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        Partido {m.matchNumber}
                      </span>
                      <span className="text-xs text-slate-400">Jornada {m.round}</span>
                    </div>

                    <div>
                      {m.isPlayed ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Finalizado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          <Clock className="w-3 h-3 text-amber-400" /> Pendiente
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Parejas & Marcador */}
                  <div className="space-y-3">
                    {/* Pareja 1 */}
                    <div
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                        isWinnerP1
                          ? 'bg-emerald-950/40 border-emerald-500/80 text-white font-bold ring-1 ring-emerald-500/30'
                          : isDraw
                          ? 'bg-amber-950/20 border-amber-800/40 text-slate-200'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-mono">P1</span>
                          <span className="text-sm font-black tracking-tight">{m.player1Name}</span>
                          <span className="text-slate-500 text-xs">&</span>
                          <span className="text-sm font-black tracking-tight">{m.player2Name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          Revés: {m.player1Name} · Derecha: {m.player2Name}
                        </div>
                      </div>

                      {isWinnerP1 && (
                        <span className="flex items-center gap-1 text-xs font-black text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md">
                          <Trophy className="w-3 h-3" /> +3 PTS
                        </span>
                      )}
                      {isDraw && (
                        <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md">
                          +1 PT
                        </span>
                      )}
                    </div>

                    {/* VS Badge with Score */}
                    <div className="flex items-center justify-center relative my-1">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-800"></div>
                      </div>
                      <div className="relative px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs font-mono font-bold text-slate-400 flex items-center gap-2">
                        {setsFormatted.length > 0 ? (
                          <span className="text-emerald-400 font-black tracking-widest">
                            {setsFormatted.join(' | ')}
                          </span>
                        ) : typeof m.gamesPair1 === 'number' && typeof m.gamesPair2 === 'number' ? (
                          <span className="text-emerald-400 font-black">
                            {m.gamesPair1} - {m.gamesPair2}
                          </span>
                        ) : (
                          <span className="text-slate-500">VS</span>
                        )}
                      </div>
                    </div>

                    {/* Pareja 2 */}
                    <div
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                        isWinnerP2
                          ? 'bg-emerald-950/40 border-emerald-500/80 text-white font-bold ring-1 ring-emerald-500/30'
                          : isDraw
                          ? 'bg-amber-950/20 border-amber-800/40 text-slate-200'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-mono">P2</span>
                          <span className="text-sm font-black tracking-tight">{m.player3Name}</span>
                          <span className="text-slate-500 text-xs">&</span>
                          <span className="text-sm font-black tracking-tight">{m.player4Name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          Revés: {m.player3Name} · Derecha: {m.player4Name}
                        </div>
                      </div>

                      {isWinnerP2 && (
                        <span className="flex items-center gap-1 text-xs font-black text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md">
                          <Trophy className="w-3 h-3" /> +3 PTS
                        </span>
                      )}
                      {isDraw && (
                        <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md">
                          +1 PT
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-end">
                  <button
                    onClick={() => onOpenResultModal(m)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white transition-all shadow-md group"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white transition-colors" />
                    <span>{m.isPlayed ? 'Modificar Resultado' : 'Introducir Resultado'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
