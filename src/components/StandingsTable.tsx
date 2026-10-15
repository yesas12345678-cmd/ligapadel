'use client';

import React, { useState } from 'react';
import { PlayerStats, Match } from '@/types/padel';
import { Trophy, Medal, Search, Flame, Award, ChevronRight, X } from 'lucide-react';

interface StandingsTableProps {
  standings: PlayerStats[];
  matches: Match[];
  onOpenMatchModal?: (match: Match) => void;
}

export function StandingsTable({ standings, matches }: StandingsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const filtered = standings.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Historial de partidos del jugador seleccionado
  const playerMatches = selectedPlayer
    ? matches.filter(
        (m) =>
          m.player1Name.toUpperCase() === selectedPlayer.toUpperCase() ||
          m.player2Name.toUpperCase() === selectedPlayer.toUpperCase() ||
          m.player3Name.toUpperCase() === selectedPlayer.toUpperCase() ||
          m.player4Name.toUpperCase() === selectedPlayer.toUpperCase()
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Clasificación General Individual</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Los jugadores rotan de compañero en cada jornada. Puntuación: <strong>+3 Victoria</strong>, <strong>+1 Empate</strong>, <strong>0 Derrota</strong>.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar jugador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
      </div>

      {/* Podium Cards for Top 3 (if matches played or overall) */}
      {standings.length >= 3 && !searchTerm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Segundo Lugar (Silver) */}
          <div className="order-2 md:order-1 bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/60 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-2 right-2 text-4xl opacity-15">🥈</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center font-bold text-slate-200 text-lg border border-slate-500">
                2
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subcampeón</span>
                <h3 className="text-lg font-black text-white">{standings[1]?.name}</h3>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                <span>{standings[1]?.won}V - {standings[1]?.drawn}E - {standings[1]?.lost}D</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-200">{standings[1]?.points}</span>
                <span className="text-xs text-slate-400 ml-1 font-semibold">PTS</span>
              </div>
            </div>
          </div>

          {/* Primer Lugar (Gold) */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-slate-900 border-2 border-amber-500/50 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-lg shadow-amber-500/10">
            <div className="absolute top-2 right-2 text-5xl opacity-20">🥇</div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-md shadow-amber-500/30">
                1
              </div>
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" /> Líder Actual
                </span>
                <h3 className="text-xl font-black text-white tracking-tight">{standings[0]?.name}</h3>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-900/40 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                <span>{standings[0]?.won}V - {standings[0]?.drawn}E - {standings[0]?.lost}D</span>
                <span className="block text-emerald-400 font-semibold mt-0.5">
                  Dif: {standings[0]?.gamesDiff > 0 ? `+${standings[0]?.gamesDiff}` : standings[0]?.gamesDiff} juegos
                </span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-amber-300">{standings[0]?.points}</span>
                <span className="text-xs text-amber-400 ml-1 font-bold">PTS</span>
              </div>
            </div>
          </div>

          {/* Tercer Lugar (Bronze) */}
          <div className="order-3 bg-gradient-to-b from-amber-950/20 to-slate-900/90 border border-amber-800/40 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-2 right-2 text-4xl opacity-15">🥉</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-900/60 flex items-center justify-center font-bold text-amber-200 text-lg border border-amber-700/60">
                3
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Tercer Puesto</span>
                <h3 className="text-lg font-black text-white">{standings[2]?.name}</h3>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                <span>{standings[2]?.won}V - {standings[2]?.drawn}E - {standings[2]?.lost}D</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">{standings[2]?.points}</span>
                <span className="text-xs text-slate-400 ml-1 font-semibold">PTS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold">
              <th className="py-3.5 px-3 sm:px-4 text-center w-12">#</th>
              <th className="py-3.5 px-3 sm:px-4">Jugador</th>
              <th className="py-3.5 px-3 sm:px-4 text-center font-black text-emerald-400 bg-emerald-950/20">PTS</th>
              <th className="py-3.5 px-2 sm:px-3 text-center" title="Partidos Jugados">PJ</th>
              <th className="py-3.5 px-2 sm:px-3 text-center text-emerald-400" title="Partidos Ganados">PG</th>
              <th className="py-3.5 px-2 sm:px-3 text-center text-amber-400" title="Partidos Empatados">PE</th>
              <th className="py-3.5 px-2 sm:px-3 text-center text-rose-400" title="Partidos Perdidos">PP</th>
              <th className="py-3.5 px-2 sm:px-3 text-center hidden md:table-cell" title="Sets Favor">SF</th>
              <th className="py-3.5 px-2 sm:px-3 text-center hidden md:table-cell" title="Sets Contra">SC</th>
              <th className="py-3.5 px-2 sm:px-3 text-center hidden sm:table-cell" title="Juegos Favor">JF</th>
              <th className="py-3.5 px-2 sm:px-3 text-center hidden sm:table-cell" title="Juegos Contra">JC</th>
              <th className="py-3.5 px-2 sm:px-3 text-center font-bold" title="Diferencia de Juegos">DIF</th>
              <th className="py-3.5 px-3 sm:px-4 text-center hidden lg:table-cell">Racha</th>
              <th className="py-3.5 px-2 text-center w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
            {filtered.map((player, idx) => {
              const rank = standings.findIndex((s) => s.name === player.name) + 1;
              const isFirst = rank === 1;
              const isSecond = rank === 2;
              const isThird = rank === 3;

              return (
                <tr
                  key={player.name}
                  onClick={() => setSelectedPlayer(player.name)}
                  className={`hover:bg-slate-800/50 transition-colors cursor-pointer group ${
                    isFirst ? 'bg-amber-950/10' : ''
                  }`}
                >
                  {/* Posición / Medallas */}
                  <td className="py-3 px-3 sm:px-4 text-center font-black">
                    {isFirst ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs">
                        🥇 1
                      </span>
                    ) : isSecond ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-400/20 text-slate-300 border border-slate-400/40 text-xs">
                        🥈 2
                      </span>
                    ) : isThird ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-800/20 text-amber-500 border border-amber-800/40 text-xs">
                        🥉 3
                      </span>
                    ) : (
                      <span className="text-slate-400">{rank}</span>
                    )}
                  </td>

                  {/* Nombre del jugador */}
                  <td className="py-3 px-3 sm:px-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] font-bold text-slate-300">
                        {player.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                          {player.name}
                        </span>
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                          {player.position}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* PUNTOS */}
                  <td className="py-3 px-3 sm:px-4 text-center font-black text-sm sm:text-base text-emerald-300 bg-emerald-950/25">
                    {player.points}
                  </td>

                  {/* PJ */}
                  <td className="py-3 px-2 sm:px-3 text-center text-slate-300 font-medium">
                    {player.played}
                  </td>

                  {/* PG */}
                  <td className="py-3 px-2 sm:px-3 text-center text-emerald-400 font-bold">
                    {player.won}
                  </td>

                  {/* PE */}
                  <td className="py-3 px-2 sm:px-3 text-center text-amber-400 font-bold">
                    {player.drawn}
                  </td>

                  {/* PP */}
                  <td className="py-3 px-2 sm:px-3 text-center text-rose-400 font-medium">
                    {player.lost}
                  </td>

                  {/* Sets Favor / Contra */}
                  <td className="py-3 px-2 sm:px-3 text-center text-slate-400 hidden md:table-cell">
                    {player.setsWon}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-center text-slate-400 hidden md:table-cell">
                    {player.setsLost}
                  </td>

                  {/* Juegos Favor / Contra */}
                  <td className="py-3 px-2 sm:px-3 text-center text-slate-300 hidden sm:table-cell">
                    {player.gamesWon}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-center text-slate-400 hidden sm:table-cell">
                    {player.gamesLost}
                  </td>

                  {/* DIFERENCIA DE JUEGOS */}
                  <td className="py-3 px-2 sm:px-3 text-center font-bold">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-xs ${
                        player.gamesDiff > 0
                          ? 'bg-emerald-500/20 text-emerald-400 font-black'
                          : player.gamesDiff < 0
                          ? 'bg-rose-500/20 text-rose-400 font-medium'
                          : 'text-slate-400'
                      }`}
                    >
                      {player.gamesDiff > 0 ? `+${player.gamesDiff}` : player.gamesDiff}
                    </span>
                  </td>

                  {/* RACHA RECIENTE */}
                  <td className="py-3 px-3 sm:px-4 text-center hidden lg:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      {player.form.length === 0 ? (
                        <span className="text-[11px] text-slate-500">-</span>
                      ) : (
                        player.form.map((res, i) => (
                          <span
                            key={i}
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                              res === 'W'
                                ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                                : res === 'D'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            title={res === 'W' ? 'Victoria' : res === 'D' ? 'Empate' : 'Derrota'}
                          >
                            {res === 'W' ? 'V' : res === 'D' ? 'E' : 'D'}
                          </span>
                        ))
                      )}
                    </div>
                  </td>

                  {/* Chevron to view history */}
                  <td className="py-3 px-2 text-right">
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Drawer / Modal con los partidos del jugador seleccionado */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg">
                  {selectedPlayer.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedPlayer}</h3>
                  <p className="text-xs text-slate-400">Historial de partidos y compañeros</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {playerMatches.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No hay partidos registrados para este jugador.</p>
              ) : (
                playerMatches.map((m) => {
                  const isPair1 =
                    m.player1Name.toUpperCase() === selectedPlayer.toUpperCase() ||
                    m.player2Name.toUpperCase() === selectedPlayer.toUpperCase();

                  const teammate = isPair1
                    ? m.player1Name.toUpperCase() === selectedPlayer.toUpperCase()
                      ? m.player2Name
                      : m.player1Name
                    : m.player3Name.toUpperCase() === selectedPlayer.toUpperCase()
                    ? m.player4Name
                    : m.player3Name;

                  const rivals = isPair1
                    ? `${m.player3Name} & ${m.player4Name}`
                    : `${m.player1Name} & ${m.player2Name}`;

                  let outcomeText = 'Pendiente';
                  let outcomeClass = 'bg-slate-800 text-slate-400';

                  if (m.isPlayed) {
                    if (m.winner === 'DRAW') {
                      outcomeText = 'Empate (+1 pt)';
                      outcomeClass = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
                    } else if (
                      (m.winner === 'PAIR1' && isPair1) ||
                      (m.winner === 'PAIR2' && !isPair1)
                    ) {
                      outcomeText = 'Victoria (+3 pts)';
                      outcomeClass = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
                    } else {
                      outcomeText = 'Derrota (0 pts)';
                      outcomeClass = 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
                    }
                  }

                  return (
                    <div
                      key={m.id}
                      className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                          <span>Jornada {m.round}</span>
                          <span>·</span>
                          <span>Partido {m.matchNumber}</span>
                        </div>
                        <div className="mt-1 text-sm font-semibold text-white">
                          Con <span className="text-emerald-400">{teammate}</span> vs <span className="text-slate-300">{rivals}</span>
                        </div>
                        {m.isPlayed && (
                          <div className="text-xs text-slate-400 mt-1">
                            Sets: {m.set1Pair1 ?? '-'}-{m.set1Pair2 ?? '-'}
                            {m.set2Pair1 !== null && ` | ${m.set2Pair1}-${m.set2Pair2}`}
                            {m.set3Pair1 !== null && ` | ${m.set3Pair1}-${m.set3Pair2}`}
                          </div>
                        )}
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold self-start sm:self-center ${outcomeClass}`}>
                        {outcomeText}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
