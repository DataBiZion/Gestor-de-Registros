// src/pages/login.tsx
import LoginForm from '@/components/auth/LoginForm';
import { GetServerSideProps } from 'next';
import { verify } from 'jsonwebtoken';

// Esta función verifica si el usuario ya está autenticado
export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies['auth'];

  if (token) {
    try {
      verify(token, process.env.JWT_SECRET || 'your-secret-key');
      // Si el token es válido, redirige al dashboard
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    } catch {
      // Si el token no es válido, continúa con el login
    }
  }

  return {
    props: {}, // Necesario para GetServerSideProps
  };
};

export default function LoginPage() {
  return <LoginForm />;
}