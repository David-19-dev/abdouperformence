import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Dumbbell, ShoppingCart } from 'lucide-react';
import { navItems } from '../data';
import { useCartStore } from '../store/cart'; 
import CartDrawer from './CartDrawer';
import { onAuthStateChange, isAdmin } from '../lib/auth';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAdminLink, setShowAdminLink] = useState(false);
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        const adminStatus = await isAdmin();
        setShowAdminLink(adminStatus);
      } else {
        setShowAdminLink(false);
      }
    });

    return () => unsubscribe();
  }, []);
  const isHomePage = location.pathname === '/';
  
  // Fermer le menu mobile lors du changement de route
  React.useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHomePage ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src="images/logo.png"
                  alt="BBP Performance Logo"
                  className={`h-28 w-28 ${scrolled || !isHomePage ? '' : 'brightness-0 invert'} transition-all duration-200`}
                />
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                {navItems.map((item) => (
                  item.name !== 'Galerie' && (
                    <Link
                      key={item.name}
                      to={item.href.replace('#', '')}
                      className={`${
                        scrolled || !isHomePage ? 'text-gray-700 hover:text-red-600' : 'text-gray-100 hover:text-white'
                      } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative"
                >
                  <ShoppingCart className={`h-6 w-6 ${
                    scrolled || !isHomePage ? 'text-gray-700' : 'text-white'
                  }`} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
                <Link
                  to="/booking"
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  Réserver une Séance
                </Link>
                {showAdminLink && (
                <Link
                  to="/login"
                  className={`${
                    scrolled || !isHomePage ? 'text-gray-700 hover:text-red-600' : 'text-gray-100 hover:text-white'
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                >
                  Admin
                </Link>
                )}
              </div>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => {
                  setIsOpen(!isOpen);
                  // Si le menu est ouvert et qu'on le ferme, on ne fait rien
                  // Si le menu est fermé et qu'on l'ouvre, on empêche le scroll
                  if (!isOpen) {
                    document.body.style.overflow = 'hidden';
                  } else {
                    document.body.style.overflow = '';
                  }
                }}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  scrolled || !isHomePage ? 'text-gray-700 hover:text-red-600' : 'text-white hover:text-white'
                } hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500`}
              >
                <span className="sr-only">Ouvrir le menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile - position fixed pour couvrir tout l'écran */}
        <div className={`md:hidden fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ top: '64px' }}>
          <div className="px-4 pt-4 pb-6 space-y-3 h-full overflow-y-auto">
            {navItems.map((item) => (
              item.name !== 'Galerie' && (
                <Link
                  key={item.name}
                  to={item.href.replace('#', '')}
                  className="text-gray-700 hover:text-red-600 block px-3 py-4 rounded-md text-lg font-medium border-b border-gray-100"
                  onClick={() => {
                    setIsOpen(false);
                    document.body.style.overflow = '';
                  }}
                >
                  {item.name}
                </Link>
              )
            ))}
            <button
              onClick={() => {
                setIsCartOpen(true);
                setIsOpen(false);
              }}
              className="text-gray-700 hover:text-red-600 block px-3 py-4 rounded-md text-lg font-medium w-full text-left border-b border-gray-100"
            >
              Panier ({cartItemsCount})
            </button>
            <Link
              to="/booking"
              className="bg-red-600 text-white block px-3 py-4 rounded-md text-lg font-medium hover:bg-red-700 mt-4 text-center"
              onClick={() => {
                setIsOpen(false);
                document.body.style.overflow = '';
              }}
            >
              Réserver une Séance
            </Link>
            {showAdminLink && (
              <Link
                to="/login"
                className="text-gray-700 hover:text-red-600 block px-3 py-4 rounded-md text-lg font-medium border-b border-gray-100"
                onClick={() => {
                  setIsOpen(false);
                  document.body.style.overflow = '';
                }}
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;