// src/app/api/remision/route.ts
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req: Request) {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Obtener una conexión del pool
  const connection = await pool.getConnection();

  try {
    const bodyText = await req.text();
    console.log('Received raw body:', bodyText);

    let data;
    try {
      data = JSON.parse(bodyText);
      console.log('Parsed data:', data);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Iniciamos la transacción
    await connection.beginTransaction();

    try {
      // Primero insertamos en la tabla maestra
      await connection.execute(
        `INSERT INTO remisiones_maestro (remision_key) VALUES (?)`,
        [data.remision_key]
      );

      // Luego insertamos en registros_remision
      const [result] = await connection.execute(
        `INSERT INTO registros_remision (
          remision_key, fecha, proveedor_key, 
          desperdicio_reportado, uds, material, 
          clasificacion_scrap, precio_unitario,
          autoriza, responsable_proveedor, categoria
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.remision_key,
          data.fecha,
          data.proveedor_key,
          data.desperdicio_reportado,
          data.uds,
          data.material,
          data.clasificacion_scrap || '',
          data.precio_unitario,
          data.autoriza,
          data.responsable_proveedor,
          data.categoria
        ]
      );

      await connection.commit();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Datos guardados correctamente',
        data: result 
      });

    } catch (dbError: any) {
      await connection.rollback();
      throw dbError;
    }

  } catch (error: any) {
    console.error('Error detallado:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error al guardar los datos',
        details: error.sqlMessage || error.toString()
      },
      { status: 500 }
    );
  } finally {
    connection.release(); // Liberamos la conexión al pool
    pool.end(); // Cerramos el pool
  }
}