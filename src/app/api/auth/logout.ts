// src/pages/api/auth/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  // Eliminar la cookie de autenticación
  res.setHeader(
    'Set-Cookie',
    'auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  );

  return res.status(200).json({ success: true });
}