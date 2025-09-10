import { useNavigate } from 'react-router-dom';
import AuthPage from '@/components/Auth/AuthPage';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const AuthPageRoute = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Se o usuário já está logado, redireciona para home
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return <AuthPage onBack={() => navigate('/')} />;
};

export default AuthPageRoute;