import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth, roles } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext';
import { OrdersProvider } from './context/OrdersContext';
import { CustomerProvider } from './context/CustomerContext';
import { HospitalityProvider } from './context/HospitalityContext';
import { CommunicationProvider } from './context/CommunicationContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';
import MainLayout from './layouts/MainLayout';
import ScrollToTop from './components/common/ScrollToTop';


// Website
import LandingPage from './pages/website/LandingPage';
import DigitalMenu from './pages/website/DigitalMenu';
import Excursions from './pages/website/Excursions';
import Transport from './pages/website/Transport';
import BookTable from './pages/website/BookTable';
import OrderingEntry from './pages/website/OrderingEntry';
import GuestCheckIn from './pages/website/GuestCheckIn';
import GuestDashboard from './pages/website/GuestDashboard';
import GuestMenu from './pages/website/GuestMenu';
import MyBill from './pages/website/MyBill';
import RequestChat from './pages/website/RequestChat';
import ChatReception from './pages/website/ChatReception';

// Auth
import Login from './pages/auth/Login';

// Dashboard - Admin
import Dashboard from './pages/dashboard/admin/Dashboard';
import Tables from './pages/dashboard/admin/Tables';
import Menu from './pages/dashboard/admin/Menu';
import Staff from './pages/dashboard/admin/Staff';
import Reports from './pages/dashboard/admin/Reports';
import Settings from './pages/dashboard/admin/Settings';
import QRManager from './pages/dashboard/admin/QRManager';
import ServiceManager from './pages/dashboard/admin/ServiceManager';
import Tasks from './pages/dashboard/admin/Tasks';
import Inventory from './pages/dashboard/admin/Inventory';

// Dashboard - Waiter
import POS from './pages/dashboard/waiter/POS';
import Orders from './pages/dashboard/waiter/Orders';

// Dashboard - Kitchen
import Kitchen from './pages/dashboard/kitchen/Kitchen';


// Dashboard - Reception
import Rooms from './pages/dashboard/reception/Rooms';
import Reservations from './pages/dashboard/reception/Reservations';
import GuestFolio from './pages/dashboard/reception/GuestFolio';
import GuestBills from './pages/dashboard/reception/GuestBills';
import Guests from './pages/dashboard/reception/Guests';
import AdminCalendar from './pages/dashboard/reception/AdminCalendar';
import Concierge from './pages/dashboard/reception/Concierge';


// Dashboard - Common
import Settlements from './pages/dashboard/common/Settlements';
import Transactions from './pages/dashboard/common/Transactions';
import NotificationsPage from './pages/dashboard/common/Notifications';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const { role: routeRole } = useParams();
  
  if (!user) return <Navigate to="/login" />;
  
  // If route has a role prefix, it MUST match the user's role
  if (routeRole && routeRole.toUpperCase() !== user.role) {
    const correctPrefix = user.role.toLowerCase();
    return <Navigate to={`/${correctPrefix}/dashboard`} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const correctPrefix = user.role.toLowerCase();
    return <Navigate to={`/${correctPrefix}/dashboard`} />;
  }
  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  const rolePrefix = user.role.toLowerCase();
  if (user.role === roles.CUSTOMER) return <Navigate to="/customer/home" />;
  return <Navigate to={`/${rolePrefix}/dashboard`} />;
};

const ModuleRedirect = ({ module }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  const rolePrefix = user.role.toLowerCase();
  return <Navigate to={`/${rolePrefix}/${module}`} replace />;
};

const ThemeHandler = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('pos-theme') || 'indigo';
    const themes = {
      indigo: { primary: '#6366F1', dark: '#4F46E5', light: '#EEF2FF' },
      rose: { primary: '#F43F5E', dark: '#E11D48', light: '#FFF1F2' },
      emerald: { primary: '#10B981', dark: '#059669', light: '#ECFDF5' },
      orange: { primary: '#F59E0B', dark: '#D97706', light: '#FFFBEB' },
      purple: { primary: '#9333EA', dark: '#7E22CE', light: '#FAF5FF' }
    };
    
    const theme = themes[savedTheme] || themes.indigo;
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-primary-dark', theme.dark);
    document.documentElement.style.setProperty('--color-primary-light', theme.light);
  }, []);
  return null;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ToastProvider>
          <MenuProvider>
          <OrdersProvider>
            <CustomerProvider>
              <HospitalityProvider>
                <CommunicationProvider>
                  <ThemeHandler />
                  <Router>
                    <ScrollToTop />
                    <Routes>
                      {/* Landing Page */}
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/menu" element={<DigitalMenu />} />
                      <Route path="/excursions" element={<Excursions />} />
                      <Route path="/transport" element={<Transport />} />
                      <Route path="/book" element={<BookTable />} />
                      <Route path="/order" element={<OrderingEntry />} />
                      <Route path="/checkin" element={<GuestCheckIn />} />
                      <Route path="/guest-app" element={<GuestDashboard />} />
                      <Route path="/guest-menu" element={<GuestMenu />} />
                      <Route path="/my-bill" element={<MyBill />} />
                      <Route path="/request-chat" element={<RequestChat />} />
                      <Route path="/chat" element={<ChatReception />} />
                      
                      {/* Auth */}
                      <Route path="/login" element={<Login />} />
                      
                      {/* Admin/Manager/Staff Routes */}
                      {/* Redirect generic routes to role-specific routes */}
                      <Route path="/dashboard" element={<DashboardRedirect />} />
                      <Route path="/tables" element={<ModuleRedirect module="tables" />} />
                      <Route path="/pos" element={<ModuleRedirect module="pos" />} />
                      <Route path="/orders" element={<ModuleRedirect module="orders" />} />
                      <Route path="/kitchen" element={<ModuleRedirect module="kitchen" />} />
                      <Route path="/tasks" element={<ModuleRedirect module="tasks" />} />
                      <Route path="/inventory" element={<ModuleRedirect module="inventory" />} />
                      <Route path="/staff" element={<ModuleRedirect module="staff" />} />
                      <Route path="/reports" element={<ModuleRedirect module="reports" />} />
                      <Route path="/rooms" element={<ModuleRedirect module="rooms" />} />
                      <Route path="/reservations" element={<ModuleRedirect module="reservations" />} />
                      <Route path="/calendar" element={<ModuleRedirect module="calendar" />} />
                      <Route path="/guests" element={<ModuleRedirect module="guests" />} />
                      <Route path="/folio" element={<ModuleRedirect module="folio" />} />
                      <Route path="/guest-bills" element={<ModuleRedirect module="guest-bills" />} />
                      <Route path="/settlements" element={<ModuleRedirect module="settlements" />} />
                      <Route path="/transactions" element={<ModuleRedirect module="transactions" />} />
                      <Route path="/concierge" element={<ModuleRedirect module="concierge" />} />

                      <Route path="/services" element={<ModuleRedirect module="services" />} />
                      <Route path="/qr-manager" element={<ModuleRedirect module="qr-manager" />} />
                      <Route path="/notifications" element={<ModuleRedirect module="notifications" />} />
                      <Route path="/settings" element={<ModuleRedirect module="settings" />} />

                      {/* Role-Specific Module Routes */}
                      <Route path="/:role/dashboard" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER, roles.WAITER, roles.CHEF, roles.CASHIER]}>
                          <MainLayout><Dashboard /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/tables" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER, roles.WAITER]}>
                          <MainLayout><Tables /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/pos" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER, roles.WAITER, roles.CASHIER]}>
                          <MainLayout><POS /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/orders" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER, roles.WAITER, roles.CHEF, roles.CASHIER]}>
                          <MainLayout><Orders /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/kitchen" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER, roles.CHEF]}>
                          <MainLayout><Kitchen /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/tasks" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER, roles.WAITER, roles.CHEF]}>
                          <MainLayout><Tasks /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/inventory" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER, roles.CHEF]}>
                          <MainLayout><Inventory /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/menu" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER]}>
                          <MainLayout><Menu /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/staff" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN]}>
                          <MainLayout><Staff /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/reports" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER]}>
                          <MainLayout><Reports /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/rooms" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER]}>
                          <MainLayout><Rooms /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/reservations" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER, roles.WAITER]}>
                          <MainLayout><Reservations /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/calendar" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER]}>
                          <MainLayout><AdminCalendar /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/guests" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER]}>
                          <MainLayout><Guests /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/folio" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER, roles.CASHIER]}>
                          <MainLayout><GuestFolio /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/guest-bills" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER, roles.CASHIER]}>
                          <MainLayout><GuestBills /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/settlements" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER, roles.CASHIER]}>
                          <MainLayout><Settlements /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/transactions" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER, roles.CASHIER]}>
                          <MainLayout><Transactions /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/concierge" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER, roles.WAITER]}>
                          <MainLayout><Concierge /></MainLayout>
                        </ProtectedRoute>
                      } />



                      <Route path="/:role/services" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER, roles.WAITER]}>
                          <MainLayout><ServiceManager /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/qr-manager" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER]}>
                          <MainLayout><QRManager /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/notifications" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN, roles.MANAGER, roles.WAITER, roles.CHEF, roles.CASHIER]}>
                          <MainLayout><NotificationsPage /></MainLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/:role/settings" element={
                        <ProtectedRoute allowedRoles={[roles.ADMIN]}>
                          <MainLayout><Settings /></MainLayout>
                        </ProtectedRoute>
                      } />


                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </Router>
                </CommunicationProvider>
              </HospitalityProvider>
            </CustomerProvider>
          </OrdersProvider>
        </MenuProvider>
      </ToastProvider>
    </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
