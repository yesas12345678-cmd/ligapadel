'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { StandingsTable } from '@/components/StandingsTable';
import { MatchesView } from '@/components/MatchesView';
import { PlayersView } from '@/components/PlayersView';
import { DokployTab } from '@/components/DokployTab';
import { ResultModal } from '@/components/ResultModal';
import { INITIAL_MATCHES, INITIAL_PLAYERS } from '@/lib/initialData';
import { calculateStandings } from '@/lib/ranking';
import { Match, Player } from '@/types/padel';

const LOCAL_STORAGE_KEY = 'ligapadel_matches_v1';
const LOCAL_STORAGE_PLAYERS_KEY = 'ligapadel_players_v1';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'standings' | 'matches' | 'players' | 'dokploy'>('standings');
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [dbStatus, setDbStatus] = useState<{
    status: 'connected' | 'disconnected' | 'checking';
    latencyMs?: number;
    stats?: { matchesInDb: number; playersInDb: number };
    error?: string;
    message?: string;
  }>({
    status: 'checking',
  });

  // Cargar estado inicial y comprobar Dokploy
  useEffect(() => {
    // 1. Cargar desde localStorage primero para rapidez
    try {
      const savedMatches = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedMatches) {
        const parsed = JSON.parse(savedMatches);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMatches(parsed);
        }
      }

      const savedPlayers = localStorage.getItem(LOCAL_STORAGE_PLAYERS_KEY);
      if (savedPlayers) {
        const parsedP = JSON.parse(savedPlayers);
        if (Array.isArray(parsedP) && parsedP.length > 0) {
          setPlayers(parsedP);
        }
      }
    } catch (e) {
      console.warn('Error leyendo localStorage:', e);
    }

    // 2. Comprobar API de Dokploy y sincronizar si está disponible
    checkDbAndFetchMatches();
  }, []);

  const checkDbAndFetchMatches = async () => {
    try {
      setDbStatus((prev) => ({ ...prev, status: 'checking' }));
      const statusRes = await fetch('/api/status');
      const statusData = await statusRes.json();
      setDbStatus(statusData);

      // Si la base de datos o el endpoint devuelve partidos, cargarlos
      const matchesRes = await fetch('/api/matches');
      const matchesData = await matchesRes.json();
      if (matchesData.matches && Array.isArray(matchesData.matches) && matchesData.matches.length > 0) {
        setMatches(matchesData.matches);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(matchesData.matches));
      }
    } catch (err: any) {
      setDbStatus({
        status: 'disconnected',
        error: err.message,
        message: 'No se pudo contactar con la API. Usando almacenamiento local.',
      });
    }
  };

  // Guardar resultado de partido
  const handleSaveMatch = async (updatedMatch: Match) => {
    // Actualización optimista local
    const newMatches = matches.map((m) => (m.id === updatedMatch.id ? updatedMatch : m));
    setMatches(newMatches);

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newMatches));
    } catch (e) {
      console.warn('Error guardando en localStorage:', e);
    }

    // Persistir vía API en Dokploy PostgreSQL
    try {
      await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMatch),
      });
    } catch (err) {
      console.warn('No se pudo sincronizar inmediatamente con Dokploy API:', err);
    }
  };

  const handleOpenResultModal = (match: Match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handleAddPlayer = (newPlayer: Player) => {
    const updated = [...players, newPlayer];
    setPlayers(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_PLAYERS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error guardando jugadores:', e);
    }
  };

  // Cálculo reactivo de la clasificación
  const standings = useMemo(() => {
    return calculateStandings(players, matches);
  }, [players, matches]);

  const totalMatches = matches.length;
  const playedMatches = matches.filter((m) => m.isPlayed).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Barra Superior y Navegación */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dbStatus={dbStatus}
        totalMatches={totalMatches}
        playedMatches={playedMatches}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'standings' && (
          <StandingsTable
            standings={standings}
            matches={matches}
            onOpenMatchModal={handleOpenResultModal}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesView
            matches={matches}
            onOpenResultModal={handleOpenResultModal}
          />
        )}

        {activeTab === 'players' && (
          <PlayersView
            players={players}
            standings={standings}
            onAddPlayer={handleAddPlayer}
          />
        )}

        {activeTab === 'dokploy' && (
          <DokployTab
            dbStatus={dbStatus}
            onRefreshStatus={checkDbAndFetchMatches}
          />
        )}
      </main>

      {/* Modal para introducir resultado */}
      <ResultModal
        match={selectedMatch}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMatch}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Liga de Pádel 2026
          </p>
          <div className="flex items-center gap-4">
            <span>Regla de puntos: 3V · 1E · 0D</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
