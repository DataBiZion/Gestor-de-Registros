// src/pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { username, password } = req.body;

    // Verificar usuario
    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Verificar contraseña
    const isValid = await compare(password, process.env.ADMIN_PASSWORD_HASH || '');
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Generar JWT
    const token = sign(
      { username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '8h' }
    );

    // Establecer cookie
    res.setHeader(
      'Set-Cookie',
      `auth=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${8 * 60 * 60}`
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}