import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRedirect({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
}
