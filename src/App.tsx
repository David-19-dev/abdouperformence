import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogArticle from './pages/BlogArticle';
import NutritionArticle from './pages/NutritionArticle';
import MuscleGuideArticle from './pages/MuscleGuideArticle';
import WeightLossMythsArticle from './pages/WeightLossMythsArticle';
import RamadanTrainingArticle from './pages/RamadanTrainingArticle';
import OutdoorTrainingArticle from './pages/OutdoorTrainingArticle';
import ShopPage from './pages/ShopPage';
import BookingPage from './pages/BookingPage';
import Gallery from './pages/Gallery_temp';
import AdminLayout from './pages/admin/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import Dashboard from './pages/admin/Dashboard';
import ManagementPage from './pages/admin/ManagementPage';
import BlogManager from './pages/admin/BlogManager';
import CommentManager from './pages/admin/CommentManager';
import MediaManager from './pages/admin/MediaManager';
import ProductsManager from './pages/admin/ProductsManager';
import OrdersManager from './pages/admin/OrdersManager';
import BookingsManager from './pages/admin/BookingsManager';
import UsersManager from './pages/admin/UsersManager';
import SettingsPage from './pages/admin/SettingsPage';
import SetupPage from './pages/admin/SetupPage';
import GalleryManager from './pages/admin/GalleryManager';
import { requireAdmin } from './lib/auth';

// Composant pour remonter en haut de la page lors des changements de route
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <ScrollToTop />
        <Routes>
          {/* Admin Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="setup" element={<SetupPage />} />
            <Route path="management" element={<ManagementPage />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="comments" element={<CommentManager />} />
            <Route path="videos" element={<MediaManager />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="products" element={<ProductsManager />} />
            <Route path="orders" element={<OrdersManager />} />
            <Route path="bookings" element={<BookingsManager />} />
            <Route path="users" element={<UsersManager />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Public Routes */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/booking" element={<BookingPage />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogArticle />} />
                  <Route path="/shop" element={<ShopPage />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
