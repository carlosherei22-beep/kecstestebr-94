import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminDashboard from '@/components/Admin/AdminDashboard';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    // Aguarda o carregamento dos dados
    if (loading) return;
    
    // Verifica se o usuário está logado
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Verifica se tem profile e se é admin
    if (profile && !profile.is_admin) {
      navigate('/');
      return;
    }
    
    // Se não tem profile ainda, também bloqueia (significa que não é admin)
    if (!profile) {
      navigate('/');
      return;
    }
  }, [user, profile, loading, navigate]);

  // Mostra loading enquanto carrega ou se não é admin
  if (loading || !user || !profile || !profile.is_admin) {
    return null;
  }

  return <AdminDashboard onBack={() => navigate('/')} />;
};

export default AdminPage;