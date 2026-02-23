import { Routes, Route, Navigate } from "react-router-dom";

import { LandingPage } from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { AdminLayout } from "../components/layout/admin/AdminLayout"; // Layout yang kita buat di Fase 1
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage"; // Halaman Dashboard (Index)
import { AdminContentPage } from "../pages/admin/AdminContentPage"; // Halaman Placeholder Konten

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import ProfilePage from "../pages/ProfilePage";
import SearchResultsPage from "../pages/SearchResultsPage";
import BookingPage from "../pages/BookingPage";
import BookingSuccessPage from "../pages/BookingSuccessPage";
import { BookingHistoryPage } from "../pages/BookingHistoryPage";
import { PaymentMethodPage } from "../pages/payment/PaymentMethodPage";
import { PaymentWaitingPage } from "../pages/payment/PaymentWaitingPage";
import OTPVerificationPage from "../pages/OTPVerificationPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OTPVerificationPage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/booking/success" element={<BookingSuccessPage />} />
      <Route path="/history" element={<BookingHistoryPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/payment/:orderId/select" element={<PaymentMethodPage />} />
        <Route path="/payment/:orderId/waiting" element={<PaymentWaitingPage />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} /> 
          <Route path="flights" element={<AdminContentPage />} />
          <Route path="bookings" element={<AdminContentPage />} />
          <Route path="users" element={<AdminContentPage />} /> 
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
