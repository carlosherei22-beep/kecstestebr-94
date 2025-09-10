import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminDashboard from '@/components/Admin/AdminDashboard';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    // Verifica se o usuário está logado e é admin
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (profile && !profile.is_admin) {
      navigate('/');
      return;
    }
  }, [user, profile, navigate]);

  // Só renderiza se o usuário é admin
  if (!user || (profile && !profile.is_admin)) {
    return null;
  }

  return <AdminDashboard onBack={() => navigate('/')} />;
};

export default AdminPage;