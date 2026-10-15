'use client';

import React, { useState, useEffect } from 'react';
import { Match, MatchWinner } from '@/types/padel';
import { X, Trophy, Save, RotateCcw, Check, Sparkles } from 'lucide-react';

interface ResultModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMatch: Match) => void;
}

export function ResultModal({ match, isOpen, onClose, onSave }: ResultModalProps) {
  if (!isOpen || !match) return null;

  const [set1P1, setSet1P1] = useState<string>(match.set1Pair1?.toString() ?? '');
  const [set1P2, setSet1P2] = useState<string>(match.set1Pair2?.toString() ?? '');
  const [set2P1, setSet2P1] = useState<string>(match.set2Pair1?.toString() ?? '');
  const [set2P2, setSet2P2] = useState<string>(match.set2Pair2?.toString() ?? '');
  const [set3P1, setSet3P1] = useState<string>(match.set3Pair1?.toString() ?? '');
  const [set3P2, setSet3P2] = useState<string>(match.set3Pair2?.toString() ?? '');

  const [gamesP1, setGamesP1] = useState<string>(match.gamesPair1?.toString() ?? '');
  const [gamesP2, setGamesP2] = useState<string>(match.gamesPair2?.toString() ?? '');

  const [winner, setWinner] = useState<MatchWinner>(match.winner);
  const [isPlayed, setIsPlayed] = useState<boolean>(match.isPlayed);
  const [notes, setNotes] = useState<string>(match.notes ?? '');

  // Autodetectar ganador basado en los sets o juegos ingresados
  useEffect(() => {
    const s1_1 = parseInt(set1P1, 10);
    const s1_2 = parseInt(set1P2, 10);
    const s2_1 = parseInt(set2P1, 10);
    const s2_2 = parseInt(set2P2, 10);
    const s3_1 = parseInt(set3P1, 10);
    const s3_2 = parseInt(set3P2, 10);

    let setsWonP1 = 0;
    let setsWonP2 = 0;

    if (!isNaN(s1_1) && !isNaN(s1_2)) {
      if (s1_1 > s1_2) setsWonP1++;
      else if (s1_2 > s1_1) setsWonP2++;
    }

    if (!isNaN(s2_1) && !isNaN(s2_2)) {
      if (s2_1 > s2_2) setsWonP1++;
      else if (s2_2 > s2_1) setsWonP2++;
    }

    if (!isNaN(s3_1) && !isNaN(s3_2)) {
      if (s3_1 > s3_2) setsWonP1++;
      else if (s3_2 > s3_1) setsWonP2++;
    }

    // Si hay sets ingresados
    if (setsWonP1 > 0 || setsWonP2 > 0) {
      setIsPlayed(true);
      if (setsWonP1 > setsWonP2) {
        setWinner('PAIR1');
      } else if (setsWonP2 > setsWonP1) {
        setWinner('PAIR2');
      } else if (setsWonP1 === setsWonP2 && (!isNaN(s1_1) || !isNaN(s2_1))) {
        setWinner('DRAW');
      }
    } else {
      // Si se usan juegos directos
      const g1 = parseInt(gamesP1, 10);
      const g2 = parseInt(gamesP2, 10);
      if (!isNaN(g1) && !isNaN(g2)) {
        setIsPlayed(true);
        if (g1 > g2) setWinner('PAIR1');
        else if (g2 > g1) setWinner('PAIR2');
        else setWinner('DRAW');
      }
    }
  }, [set1P1, set1P2, set2P1, set2P2, set3P1, set3P2, gamesP1, gamesP2]);

  const handleSave = () => {
    const updated: Match = {
      ...match,
      set1Pair1: set1P1 !== '' ? parseInt(set1P1, 10) : null,
      set1Pair2: set1P2 !== '' ? parseInt(set1P2, 10) : null,
      set2Pair1: set2P1 !== '' ? parseInt(set2P1, 10) : null,
      set2Pair2: set2P2 !== '' ? parseInt(set2P2, 10) : null,
      set3Pair1: set3P1 !== '' ? parseInt(set3P1, 10) : null,
      set3Pair2: set3P2 !== '' ? parseInt(set3P2, 10) : null,
      gamesPair1: gamesP1 !== '' ? parseInt(gamesP1, 10) : null,
      gamesPair2: gamesP2 !== '' ? parseInt(gamesP2, 10) : null,
      winner: isPlayed ? winner : null,
      isPlayed: isPlayed && winner !== null,
      notes: notes || null,
      playedAt: isPlayed ? new Date().toISOString() : null,
    };

    onSave(updated);
    onClose();
  };

  const handleReset = () => {
    setSet1P1('');
    setSet1P2('');
    setSet2P1('');
    setSet2P2('');
    setSet3P1('');
    setSet3P2('');
    setGamesP1('');
    setGamesP2('');
    setWinner(null);
    setIsPlayed(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-6 text-white max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                Jornada {match.round}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Partido {match.matchNumber}
              </span>
            </div>
            <h3 className="text-xl font-black mt-1 text-white">Introducir Resultado</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Parejas Visual Card */}
        <div className="grid grid-cols-2 gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
          {/* Pareja 1 */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              winner === 'PAIR1'
                ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Pareja 1</span>
              {winner === 'PAIR1' && <span className="text-emerald-400 font-bold flex items-center gap-0.5"><Trophy className="w-3 h-3" /> Ganador</span>}
            </div>
            <p className="font-bold text-sm text-emerald-300">{match.player1Name}</p>
            <p className="text-xs text-slate-400 font-mono">Revés</p>
            <div className="my-1 border-t border-slate-800/60"></div>
            <p className="font-bold text-sm text-emerald-300">{match.player2Name}</p>
            <p className="text-xs text-slate-400 font-mono">Derecha</p>
          </div>

          {/* Pareja 2 */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              winner === 'PAIR2'
                ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Pareja 2</span>
              {winner === 'PAIR2' && <span className="text-emerald-400 font-bold flex items-center gap-0.5"><Trophy className="w-3 h-3" /> Ganador</span>}
            </div>
            <p className="font-bold text-sm text-emerald-300">{match.player3Name}</p>
            <p className="text-xs text-slate-400 font-mono">Revés</p>
            <div className="my-1 border-t border-slate-800/60"></div>
            <p className="font-bold text-sm text-emerald-300">{match.player4Name}</p>
            <p className="text-xs text-slate-400 font-mono">Derecha</p>
          </div>
        </div>

        {/* Tanteador por Sets */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Marcador por Sets
          </label>
          <div className="grid grid-cols-3 gap-3">
            {/* Set 1 */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">Set 1</span>
              <div className="flex items-center justify-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={set1P1}
                  placeholder="P1"
                  onChange={(e) => setSet1P1(e.target.value)}
                  className="w-11 h-11 text-center font-black text-lg bg-slate-900 border border-slate-700 rounded-lg text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-slate-500 font-bold">-</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={set1P2}
                  placeholder="P2"
                  onChange={(e) => setSet1P2(e.target.value)}
                  className="w-11 h-11 text-center font-black text-lg bg-slate-900 border border-slate-700 rounded-lg text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Set 2 */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">Set 2</span>
              <div className="flex items-center justify-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={set2P1}
                  placeholder="P1"
                  onChange={(e) => setSet2P1(e.target.value)}
                  className="w-11 h-11 text-center font-black text-lg bg-slate-900 border border-slate-700 rounded-lg text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-slate-500 font-bold">-</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={set2P2}
                  placeholder="P2"
                  onChange={(e) => setSet2P2(e.target.value)}
                  className="w-11 h-11 text-center font-black text-lg bg-slate-900 border border-slate-700 rounded-lg text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Set 3 / Supertiebreak */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">Set 3 / TB</span>
              <div className="flex items-center justify-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={set3P1}
                  placeholder="P1"
                  onChange={(e) => setSet3P1(e.target.value)}
                  className="w-11 h-11 text-center font-black text-lg bg-slate-900 border border-slate-700 rounded-lg text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-slate-500 font-bold">-</span>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={set3P2}
                  placeholder="P2"
                  onChange={(e) => setSet3P2(e.target.value)}
                  className="w-11 h-11 text-center font-black text-lg bg-slate-900 border border-slate-700 rounded-lg text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Selección Rápida del Ganador / Empate */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Resultado Oficial (Asignación de Puntos)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setWinner('PAIR1');
                setIsPlayed(true);
              }}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                winner === 'PAIR1'
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Gana Pareja 1</span>
              <span className="text-[10px] text-emerald-200">+3 pts c/u</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setWinner('DRAW');
                setIsPlayed(true);
              }}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                winner === 'DRAW'
                  ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-600/30 ring-2 ring-amber-400/50'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Empate</span>
              <span className="text-[10px] text-amber-200">+1 pt c/u</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setWinner('PAIR2');
                setIsPlayed(true);
              }}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                winner === 'PAIR2'
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Gana Pareja 2</span>
              <span className="text-[10px] text-emerald-200">+3 pts c/u</span>
            </button>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar / Pendiente</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Resultado</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
