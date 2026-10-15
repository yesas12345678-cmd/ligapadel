import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Intentamos una consulta simple para verificar la conexión a Dokploy PostgreSQL
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1 as connected`;
    const latency = Date.now() - startTime;

    const matchCount = await prisma.match.count();
    const playerCount = await prisma.player.count();

    return NextResponse.json({
      status: 'connected',
      database: 'PostgreSQL (Dokploy)',
      latencyMs: latency,
      stats: {
        matchesInDb: matchCount,
        playersInDb: playerCount,
      },
      message: 'Base de datos en Dokploy conectada correctamente.',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({
      status: 'disconnected',
      database: 'PostgreSQL (Dokploy)',
      error: err.message,
      message: 'No se pudo conectar a PostgreSQL en Dokploy. La app está funcionando en modo local/memoria.',
    });
  }
}
