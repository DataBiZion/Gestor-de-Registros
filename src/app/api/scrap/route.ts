import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validar que todos los campos requeridos existan
    const requiredFields = [
      'fecha', 'maquina', 'operador', 'turno', 'job',
      'nivel_2_mermas', 'kilogramos_reportados',
      'nivel_1_lean_manufacturing', 'nivel_3_defectos'
    ];

    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        return NextResponse.json(
          { success: false, error: `El campo ${field} es requerido` },
          { status: 400 }
        );
      }
    }

    const [result] = await db.execute(
      `INSERT INTO registros_scrap (
        fecha, maquina, operador, turno, job, 
        nivel_2_mermas, kilogramos_reportados,
        nivel_1_lean_manufacturing, nivel_3_defectos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.fecha,
        data.maquina.toLowerCase(),
        data.operador.toLowerCase(),
        Number(data.turno),
        Number(data.job),
        data.nivel_2_mermas.toLowerCase(),
        Number(data.kilogramos_reportados),
        data.nivel_1_lean_manufacturing.toLowerCase(),
        data.nivel_3_defectos.toLowerCase()
      ]
    );

    return NextResponse.json({ 
      success: true, 
      data: result,
      message: 'Registro guardado correctamente'
    });
  } catch (error) {
    console.error('Error en la API:', error);
return NextResponse.json(
  { 
    success: false, 
    error: 'Error al guardar los datos en la base de datos',
    details: (error as Error).message || 'Error desconocido'
  }, 
  { status: 500 }
);
  }
}