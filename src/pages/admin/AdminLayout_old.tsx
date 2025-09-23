import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Users, BarChart2, Settings, LogOut, Calendar, FileText, Video, Database, BookOpen, MessageSquare } from 'lucide-react';
import { isAdmin, signOut } from '../../lib/auth';
import toast from 'react-hot-toast';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      console.log('🔍 Vérification des droits admin dans AdminLayout...');
      const admin = await isAdmin();
      if (!admin) {
        console.log('❌ Accès refusé, redirection vers /login');
        navigate('/login');
      } else {
        console.log('✅ Accès autorisé à l\'interface admin');
      }
    };
    checkAdmin();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      console.log('🚪 Déconnexion en cours...');
      await signOut();
      toast.success('Déconnexion réussie');
      navigate('/login');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart2 },
    { name: 'Configuration', href: '/admin/setup', icon: Database },
    { name: 'Gestion', href: '/admin/management', icon: Calendar },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Commentaires', href: '/admin/comments', icon: MessageSquare },
    { name: 'Vidéos', href: '/admin/videos', icon: Video },
    { name: 'Produits', href: '/admin/products', icon: Package },
    { name: 'Commandes', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Réservations', href: '/admin/bookings', icon: BookOpen },
    { name: 'Utilisateurs', href: '/admin/users', icon: Users },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900">
        <div className="flex h-16 items-center justify-center border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">BBP Admin</h1>
        </div>
        
        <nav className="mt-6">
          <div className="space-y-1 px-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-4 py-3 text-sm font-medium rounded-md
                    ${location.pathname === item.href
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6 px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout