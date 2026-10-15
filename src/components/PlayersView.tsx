'use client';

import React, { useState } from 'react';
import { Player, PlayerStats } from '@/types/padel';
import { Users, UserCheck, Shield, Plus, Award } from 'lucide-react';

interface PlayersViewProps {
  players: Player[];
  standings: PlayerStats[];
  onAddPlayer?: (newPlayer: Player) => void;
}

export function PlayersView({ players, standings, onAddPlayer }: PlayersViewProps) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerPos, setNewPlayerPos] = useState<'REVES' | 'DERECHA' | 'AMBOS'>('AMBOS');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim() || !onAddPlayer) return;

    onAddPlayer({
      id: newPlayerName.toLowerCase().replace(/\s+/g, '-'),
      name: newPlayerName.trim().toUpperCase(),
      preferredPosition: newPlayerPos,
    });

    setNewPlayerName('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Plantilla de Jugadores ({players.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Jugadores registrados para la liga y asignación por lado preferido (Revés / Derecha).
          </p>
        </div>

        {onAddPlayer && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Jugador</span>
          </button>
        )}
      </div>

      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/40 space-y-4 max-w-lg"
        >
          <h3 className="text-sm font-bold text-white">Nuevo Jugador</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Nombre</label>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Ej. RAFA"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Posición Preferida</label>
              <select
                value={newPlayerPos}
                onChange={(e) => setNewPlayerPos(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="REVES">Revés</option>
                <option value="DERECHA">Derecha</option>
                <option value="AMBOS">Ambos</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              Guardar
            </button>
          </div>
        </form>
      )}

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((p) => {
          const stats = standings.find((s) => s.name.toUpperCase() === p.name.toUpperCase());
          const rank = stats ? standings.findIndex((s) => s.name === stats.name) + 1 : '-';

          return (
            <div
              key={p.name}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-slate-700 transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center font-black text-slate-200 text-sm">
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{p.name}</h4>
                  <span
                    className={`inline-block mt-0.5 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      p.preferredPosition === 'REVES'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : p.preferredPosition === 'DERECHA'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {p.preferredPosition === 'REVES'
                      ? 'Revés'
                      : p.preferredPosition === 'DERECHA'
                      ? 'Derecha'
                      : 'Revés / Derecha'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-mono">Rank #{rank}</span>
                <span className="text-base font-black text-emerald-400">
                  {stats?.points ?? 0} <span className="text-[10px] text-slate-400">PTS</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
