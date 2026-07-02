import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import CustomerLayout from '../layouts/CustomerLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';

// Components
import ProtectedRoute from '../components/ProtectedRoute.jsx';

// Pages - Auth
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';

// Pages - Customer
import CustomerDashboard from '../pages/customer/DashboardPage.jsx';
import MerchandisePage from '../pages/customer/MerchandisePage.jsx';
import MerchandiseDetailPage from '../pages/customer/MerchandiseDetailPage.jsx';
import CartPage from '../pages/customer/CartPage.jsx';
import CheckoutPage from '../pages/customer/CheckoutPage.jsx';
import CustomerProfile from '../pages/customer/ProfilePage.jsx';
import CustomerSettings from '../pages/customer/SettingsPage.jsx';
import OrderHistoryPage from '../pages/customer/OrderHistoryPage.jsx';
import OrderTrackingPage from '../pages/customer/OrderTrackingPage.jsx';
import PaymentUploadPage from '../pages/customer/PaymentUploadPage.jsx';

// Pages - Admin
import AdminDashboard from '../pages/admin/DashboardPage.jsx';
import CategoryManagementPage from '../pages/admin/CategoryManagementPage.jsx';
import MerchandiseManagementPage from '../pages/admin/MerchandiseManagementPage.jsx';
import CustomerManagementPage from '../pages/admin/CustomerManagementPage.jsx';
import OrderManagementPage from '../pages/admin/OrderManagementPage.jsx';
import PaymentVerificationPage from '../pages/admin/PaymentVerificationPage.jsx';
import SalesReportPage from '../pages/admin/SalesReportPage.jsx';
import AdminProfile from '../pages/admin/ProfilePage.jsx';
import AdminSettings from '../pages/admin/SettingsPage.jsx';

// Pages - General
import NotFound from '../pages/NotFound.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Customer Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<MerchandisePage />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/products/:id" element={<MerchandiseDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<CustomerProfile />} />
        <Route path="/settings" element={<CustomerSettings />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path="/order-tracking" element={<OrderTrackingPage />} />
        <Route path="/payment-upload/:orderId" element={<PaymentUploadPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="categories" element={<CategoryManagementPage />} />
        <Route path="merchandise" element={<MerchandiseManagementPage />} />
        <Route path="customers" element={<CustomerManagementPage />} />
        <Route path="orders" element={<OrderManagementPage />} />
        <Route path="payment-verification" element={<PaymentVerificationPage />} />
        <Route path="sales-report" element={<SalesReportPage />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
