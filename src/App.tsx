import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Scroll to top component with smoother behavior
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);
  return null;
};

// Layout wrapper to ensure consistent structure and prevent footer 'jumping'
const PageLayout = ({ children, hideFooter = false }: { children: React.ReactNode, hideFooter?: boolean }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

// Lazy load public components
const Hero = lazy(() => import('./components/Hero'));
const BookingPage = lazy(() => import('./components/BookingPage'));
const PricingPage = lazy(() => import('./components/PricingPage'));
const PricingSection = lazy(() => import('./components/PricingSection'));
const Login = lazy(() => import('./components/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));

const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminOverview = lazy(() => import('./components/admin/AdminOverview'));
const AdminBookings = lazy(() => import('./components/admin/AdminBookings'));
const AdminSchedule = lazy(() => import('./components/admin/AdminSchedule'));

// Loading spinner
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#f5f5f7]">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-[#0071e3] opacity-20 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p className="mt-4 font-geist text-[14px] text-[#1d1d1f] opacity-60 animate-pulse">Loading...</p>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Router>
            <ScrollToTop />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={
                  <PageLayout>
                    <Hero />
                    <PricingSection />
                  </PageLayout>
                } />
                <Route path="/book" element={
                  <PageLayout>
                    <BookingPage />
                  </PageLayout>
                } />
                <Route path="/pricing" element={
                  <PageLayout>
                    <PricingPage />
                  </PageLayout>
                } />
                <Route path="/login" element={
                  <PageLayout>
                    <Login />
                  </PageLayout>
                } />
                
                {/* Protected Dashboard */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <PageLayout>
                      <Dashboard />
                    </PageLayout>
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminOverview />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="schedule" element={<AdminSchedule />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </ErrorBoundary>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

