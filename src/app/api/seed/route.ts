import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_MATCHES, INITIAL_PLAYERS } from '@/lib/initialData';

export async function POST() {
  try {
    // 1. Crear jugadores si no existen
    let playersCreated = 0;
    for (const p of INITIAL_PLAYERS) {
      await prisma.player.upsert({
        where: { name: p.name },
        update: { preferredPosition: p.preferredPosition },
        create: {
          id: p.id,
          name: p.name,
          preferredPosition: p.preferredPosition,
        },
      });
      playersCreated++;
    }

    // 2. Crear partidos si no existen
    let matchesCreated = 0;
    for (const m of INITIAL_MATCHES) {
      await prisma.match.upsert({
        where: {
          round_matchNumber: {
            round: m.round,
            matchNumber: m.matchNumber,
          },
        },
        update: {
          player1Name: m.player1Name,
          player2Name: m.player2Name,
          player3Name: m.player3Name,
          player4Name: m.player4Name,
        },
        create: {
          id: m.id,
          round: m.round,
          matchNumber: m.matchNumber,
          player1Name: m.player1Name,
          player2Name: m.player2Name,
          player3Name: m.player3Name,
          player4Name: m.player4Name,
          isPlayed: m.isPlayed,
          winner: m.winner,
        },
      });
      matchesCreated++;
    }

    return NextResponse.json({
      success: true,
      message: 'Base de datos en Dokploy inicializada con éxito.',
      playersCount: playersCreated,
      matchesCount: matchesCreated,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error seeding Dokploy DB:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message,
        message: 'No se pudo sembrar la base de datos en Dokploy.',
      },
      { status: 500 }
    );
  }
}
