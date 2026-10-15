import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_MATCHES } from '@/lib/initialData';
import { Match } from '@/types/padel';

// Cache en memoria en caso de que Dokploy aún no tenga la BD conectada
let memoryMatches: Match[] = [...INITIAL_MATCHES];

export async function GET() {
  try {
    const dbMatches = await prisma.match.findMany({
      orderBy: [{ round: 'asc' }, { matchNumber: 'asc' }],
    });

    if (dbMatches.length > 0) {
      const formatted: Match[] = dbMatches.map((m) => ({
        id: m.id,
        round: m.round,
        matchNumber: m.matchNumber,
        player1Name: m.player1Name,
        player2Name: m.player2Name,
        player3Name: m.player3Name,
        player4Name: m.player4Name,
        set1Pair1: m.set1Pair1,
        set1Pair2: m.set1Pair2,
        set2Pair1: m.set2Pair1,
        set2Pair2: m.set2Pair2,
        set3Pair1: m.set3Pair1,
        set3Pair2: m.set3Pair2,
        gamesPair1: m.gamesPair1,
        gamesPair2: m.gamesPair2,
        winner: (m.winner as Match['winner']) || null,
        isPlayed: m.isPlayed,
        playedAt: m.playedAt ? m.playedAt.toISOString() : null,
        notes: m.notes,
      }));
      return NextResponse.json({ source: 'dokploy_db', matches: formatted });
    }
  } catch (error) {
    console.warn('PostgreSQL Dokploy no disponible o no inicializado, usando memoria:', error);
  }

  return NextResponse.json({ source: 'memory_cache', matches: memoryMatches });
}

export async function POST(req: Request) {
  try {
    const body: Match = await req.json();

    // Actualizar en memoria
    const index = memoryMatches.findIndex(
      (m) => m.id === body.id || (m.round === body.round && m.matchNumber === body.matchNumber)
    );
    if (index !== -1) {
      memoryMatches[index] = { ...memoryMatches[index], ...body };
    } else {
      memoryMatches.push(body);
    }

    // Intentar persistir en PostgreSQL de Dokploy
    try {
      const updated = await prisma.match.upsert({
        where: {
          round_matchNumber: {
            round: body.round,
            matchNumber: body.matchNumber,
          },
        },
        update: {
          set1Pair1: body.set1Pair1,
          set1Pair2: body.set1Pair2,
          set2Pair1: body.set2Pair1,
          set2Pair2: body.set2Pair2,
          set3Pair1: body.set3Pair1,
          set3Pair2: body.set3Pair2,
          gamesPair1: body.gamesPair1,
          gamesPair2: body.gamesPair2,
          winner: body.winner,
          isPlayed: body.isPlayed,
          playedAt: body.isPlayed ? new Date() : null,
          notes: body.notes,
        },
        create: {
          id: body.id,
          round: body.round,
          matchNumber: body.matchNumber,
          player1Name: body.player1Name,
          player2Name: body.player2Name,
          player3Name: body.player3Name,
          player4Name: body.player4Name,
          set1Pair1: body.set1Pair1,
          set1Pair2: body.set1Pair2,
          set2Pair1: body.set2Pair1,
          set2Pair2: body.set2Pair2,
          set3Pair1: body.set3Pair1,
          set3Pair2: body.set3Pair2,
          gamesPair1: body.gamesPair1,
          gamesPair2: body.gamesPair2,
          winner: body.winner,
          isPlayed: body.isPlayed,
          playedAt: body.isPlayed ? new Date() : null,
          notes: body.notes,
        },
      });

      return NextResponse.json({
        success: true,
        source: 'dokploy_db',
        match: updated,
      });
    } catch (dbErr) {
      console.warn('No se pudo guardar en Dokploy DB, guardado en memoria:', dbErr);
      return NextResponse.json({
        success: true,
        source: 'memory_cache',
        match: body,
      });
    }
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
