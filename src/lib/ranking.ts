import { Match, Player, PlayerStats } from '@/types/padel';

export function calculateStandings(players: Player[], matches: Match[]): PlayerStats[] {
  // Inicializamos mapa de estadísticas para todos los jugadores
  const statsMap = new Map<string, PlayerStats>();

  for (const player of players) {
    statsMap.set(player.name.trim().toUpperCase(), {
      id: player.id,
      name: player.name,
      position: player.preferredPosition,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      points: 0,
      setsWon: 0,
      setsLost: 0,
      setsDiff: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesDiff: 0,
      form: [],
    });
  }

  // Helper para obtener o crear jugador si aparece en un partido pero no estaba en la lista inicial
  const getOrCreateStat = (rawName: string): PlayerStats => {
    const key = rawName.trim().toUpperCase();
    if (!statsMap.has(key)) {
      statsMap.set(key, {
        id: rawName.toLowerCase().replace(/\s+/g, '-'),
        name: rawName.trim(),
        position: 'AMBOS',
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        points: 0,
        setsWon: 0,
        setsLost: 0,
        setsDiff: 0,
        gamesWon: 0,
        gamesLost: 0,
        gamesDiff: 0,
        form: [],
      });
    }
    return statsMap.get(key)!;
  };

  // Ordenar partidos cronológicamente por jornada y partido para que la racha de forma sea correcta
  const sortedMatches = [...matches].sort((a, b) => {
    if (a.round !== b.round) return a.round - b.round;
    return a.matchNumber - b.matchNumber;
  });

  for (const match of sortedMatches) {
    if (!match.isPlayed || !match.winner) continue;

    const p1 = getOrCreateStat(match.player1Name);
    const p2 = getOrCreateStat(match.player2Name);
    const p3 = getOrCreateStat(match.player3Name);
    const p4 = getOrCreateStat(match.player4Name);

    // Calcular sets y juegos ganados por cada pareja
    let setsP1 = 0;
    let setsP2 = 0;
    let gamesP1 = 0;
    let gamesP2 = 0;

    const sets = [
      { s1: match.set1Pair1, s2: match.set1Pair2 },
      { s2: match.set2Pair2, s1: match.set2Pair1 },
      { s1: match.set3Pair1, s2: match.set3Pair2 },
    ];

    let hasSetScores = false;
    for (const s of sets) {
      if (typeof s.s1 === 'number' && typeof s.s2 === 'number') {
        hasSetScores = true;
        gamesP1 += s.s1;
        gamesP2 += s.s2;
        if (s.s1 > s.s2) setsP1++;
        else if (s.s2 > s.s1) setsP2++;
      }
    }

    // Si no se metieron sets pero sí juegos directos
    if (!hasSetScores && typeof match.gamesPair1 === 'number' && typeof match.gamesPair2 === 'number') {
      gamesP1 = match.gamesPair1;
      gamesP2 = match.gamesPair2;
    }

    // Actualizar partidos jugados
    p1.played++;
    p2.played++;
    p3.played++;
    p4.played++;

    // Actualizar sets y juegos para cada jugador
    const addScores = (player: PlayerStats, wonSets: number, lostSets: number, wonGames: number, lostGames: number) => {
      player.setsWon += wonSets;
      player.setsLost += lostSets;
      player.gamesWon += wonGames;
      player.gamesLost += lostGames;
    };

    addScores(p1, setsP1, setsP2, gamesP1, gamesP2);
    addScores(p2, setsP1, setsP2, gamesP1, gamesP2);
    addScores(p3, setsP2, setsP1, gamesP2, gamesP1);
    addScores(p4, setsP2, setsP1, gamesP2, gamesP1);

    // Regla de puntuación:
    // Ganador: 3 puntos
    // Empate: 1 punto para cada uno
    // Perdedor: 0 puntos
    if (match.winner === 'PAIR1') {
      // Pareja 1 gana
      p1.won++;
      p1.points += 3;
      p1.form.push('W');

      p2.won++;
      p2.points += 3;
      p2.form.push('W');

      // Pareja 2 pierde
      p3.lost++;
      p3.form.push('L');

      p4.lost++;
      p4.form.push('L');
    } else if (match.winner === 'PAIR2') {
      // Pareja 2 gana
      p3.won++;
      p3.points += 3;
      p3.form.push('W');

      p4.won++;
      p4.points += 3;
      p4.form.push('W');

      // Pareja 1 pierde
      p1.lost++;
      p1.form.push('L');

      p2.lost++;
      p2.form.push('L');
    } else if (match.winner === 'DRAW') {
      // Empate: 1 punto para cada uno
      p1.drawn++;
      p1.points += 1;
      p1.form.push('D');

      p2.drawn++;
      p2.points += 1;
      p2.form.push('D');

      p3.drawn++;
      p3.points += 1;
      p3.form.push('D');

      p4.drawn++;
      p4.points += 1;
      p4.form.push('D');
    }
  }

  // Calcular diferencias finales y recortar la racha a los últimos 5 partidos
  const standings = Array.from(statsMap.values()).map((stat) => {
    return {
      ...stat,
      setsDiff: stat.setsWon - stat.setsLost,
      gamesDiff: stat.gamesWon - stat.gamesLost,
      form: stat.form.slice(-5), // últimos 5
    };
  });

  // Criterios de desempate en la clasificación:
  // 1. Puntos totales (descendente)
  // 2. Diferencia de juegos (+/-) descendente
  // 3. Juegos a favor (JF) descendente
  // 4. Partidos ganados (PG) descendente
  // 5. Diferencia de sets descendente
  // 6. Nombre alfabético
  return standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gamesDiff !== a.gamesDiff) return b.gamesDiff - a.gamesDiff;
    if (b.gamesWon !== a.gamesWon) return b.gamesWon - a.gamesWon;
    if (b.won !== a.won) return b.won - a.won;
    if (b.setsDiff !== a.setsDiff) return b.setsDiff - a.setsDiff;
    return a.name.localeCompare(b.name);
  });
}
