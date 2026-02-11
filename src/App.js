import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import Test from "./pages/test/test2.tsx";
import ParkingLayout from "./components/layout/Layout.tsx";
import ParkingManage from "./pages/parking-manage/ParkingManage.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";

import RoleProtectedRoute from "./components/RoleProtectedRoute.tsx";
import CustomerLayout from "./components/layout/CustomerLayout.tsx";
import Home from "./pages/customer/Home.tsx";
import About from "./pages/customer/About.tsx";
import Services from "./pages/customer/Services.tsx";
import Contact from "./pages/customer/Contact.tsx";
import Profile from "./pages/customer/Profile.tsx";
import ParkingLotDetail from "./pages/customer/ParkingLotDetail.tsx";
import ParkingLots from "./pages/customer/ParkingLots.tsx";
import { AuthProvider } from "./contexts/AuthContext";

import UserInfo from "./pages/UserInfo/UserInfo.tsx";
import ParkVehicle from "./pages/park-vehicle/ParkVehicle.tsx";
import EmployeeManage from "./pages/employee-manage/EmployeeManage.tsx";
import Timekeeping from "./pages/timekeeping/Timekeeping";
import ForgotPassword from "./pages/auth/ForgotPassword";
import PaymentReturn from "./pages/payment/PaymentReturn.tsx";

import MemberManage from "./pages/member-manage/MemberManage.tsx";
import InvoiceManage from "./pages/invoice-manage/InvoiceManage.tsx";

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/payment-return" element={<PaymentReturn />} />

            {/* Public Customer Routes */}
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="contact" element={<Contact />} />
              <Route path="profile" element={<Profile />} />
              <Route path="parking-lots" element={<ParkingLots />} />
              <Route path="parking-lots/:id" element={<ParkingLotDetail />} />
            </Route>

            {/* Protected Management Routes */}
            <Route
              element={
                <RoleProtectedRoute allowedRoles={['OWNER', 'EMPLOYEE']}>
                  <ParkingLayout />
                </RoleProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/test" element={<Test />} />
              <Route path="/user" element={<UserInfo />} />
              <Route path="/parking-management" element={<ParkingManage />} />
              <Route path='/timekeeping' element={<Timekeeping />} />
              <Route path="/employee-management" element={<EmployeeManage />} />
              <Route path="/member-management" element={<MemberManage />} />
              <Route path="/invoice-management" element={<InvoiceManage />} />
              <Route path="/park-vehicle" element={<ParkVehicle />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}
