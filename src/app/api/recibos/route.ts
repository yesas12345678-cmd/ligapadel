import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    if (action === 'alumnos') {
      const { rows } = await pool.query(
        'SELECT * FROM alumnos WHERE activo = true ORDER BY nombre ASC'
      );
      return NextResponse.json({ success: true, data: rows }, { headers: corsHeaders });
    }

    if (action === 'pagos') {
      const mes = searchParams.get('mes');
      const anio = parseInt(searchParams.get('anio') || '0', 10);
      const { rows } = await pool.query(
        'SELECT * FROM pagos WHERE mes = $1 AND anio = $2',
        [mes, anio]
      );
      return NextResponse.json({ success: true, data: rows }, { headers: corsHeaders });
    }

    if (action === 'pagos-ajustes') {
      const mes = searchParams.get('mes');
      const anio = parseInt(searchParams.get('anio') || '0', 10);
      const { rows } = await pool.query(
        `SELECT p.id, p.importe, a.nombre 
         FROM pagos p 
         JOIN alumnos a ON p.alumno_id = a.id 
         WHERE p.mes = $1 AND p.anio = $2`,
        [mes, anio]
      );
      const formatted = rows.map((r: any) => ({
        id: r.id,
        importe: r.importe,
        nombre: r.nombre,
        alumnos: { nombre: r.nombre },
      }));
      return NextResponse.json({ success: true, data: formatted }, { headers: corsHeaders });
    }

    if (action === 'ajustes') {
      const { rows } = await pool.query('SELECT password FROM ajustes WHERE id = 1');
      return NextResponse.json(
        { success: true, password: rows[0]?.password || 'GraciasManuel10' },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: 'Acción no válida' },
      { status: 400, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error en API recibos GET:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'login') {
      const { password } = body;
      const { rows } = await pool.query('SELECT password FROM ajustes WHERE id = 1');
      const correct = rows[0]?.password || 'GraciasManuel10';
      if (password === correct) {
        return NextResponse.json({ success: true }, { headers: corsHeaders });
      }
      return NextResponse.json(
        { success: false, error: 'Contraseña incorrecta' },
        { status: 401, headers: corsHeaders }
      );
    }

    if (action === 'guardar-alumno') {
      const { id, nombre, telefono, cuota } = body;
      if (id) {
        const { rows } = await pool.query(
          'UPDATE alumnos SET nombre = $1, telefono = $2, cuota = $3 WHERE id = $4 RETURNING *',
          [nombre.trim(), telefono.trim(), parseInt(cuota, 10), parseInt(id, 10)]
        );
        return NextResponse.json({ success: true, data: rows[0] }, { headers: corsHeaders });
      } else {
        const { rows } = await pool.query(
          'INSERT INTO alumnos (nombre, telefono, cuota, activo) VALUES ($1, $2, $3, true) RETURNING *',
          [nombre.trim(), telefono.trim(), parseInt(cuota, 10)]
        );
        return NextResponse.json({ success: true, data: rows[0] }, { headers: corsHeaders });
      }
    }

    if (action === 'borrar-alumno') {
      const { id } = body;
      await pool.query('DELETE FROM pagos WHERE alumno_id = $1', [parseInt(id, 10)]);
      await pool.query('DELETE FROM alumnos WHERE id = $1', [parseInt(id, 10)]);
      return NextResponse.json({ success: true }, { headers: corsHeaders });
    }

    if (action === 'marcar-pagado') {
      const { alumno_id, mes, anio, importe } = body;
      const { rows } = await pool.query(
        'INSERT INTO pagos (alumno_id, mes, anio, importe, fecha_pago) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
        [parseInt(alumno_id, 10), mes, parseInt(anio, 10), parseInt(importe, 10)]
      );
      return NextResponse.json({ success: true, data: rows[0] }, { headers: corsHeaders });
    }

    if (action === 'deshacer-pago') {
      const { id } = body;
      await pool.query('DELETE FROM pagos WHERE id = $1', [parseInt(id, 10)]);
      return NextResponse.json({ success: true }, { headers: corsHeaders });
    }

    if (action === 'guardar-password') {
      const { password } = body;
      await pool.query(
        'INSERT INTO ajustes (id, password) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET password = $1',
        [password.trim()]
      );
      return NextResponse.json({ success: true }, { headers: corsHeaders });
    }

    return NextResponse.json(
      { error: 'Acción no válida' },
      { status: 400, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error en API recibos POST:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
