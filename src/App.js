import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import Test from "./pages/test/test2.tsx";
import ParkingLayout from "./components/layout/Layout.tsx";
import ParkingManage from "./pages/parking-manage/ParkingManage.tsx";
import UserManage from "./pages/user-manage/UserManage.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

import UserInfo from "./pages/UserInfo/UserInfo.tsx";
import ParkVehicle from "./pages/park-vehicle/ParkVehicle.tsx";
import EmployeeManage from "./pages/employee-manage/EmployeeManage.tsx";
export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verify />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ParkingLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="/test" element={<Test />} />
              <Route path="/user" element={<UserInfo />} />
              <Route path="/parking-management" element={<ParkingManage />} />
              <Route path='/user-management' element={<UserManage />} />
              <Route path='/employee-management' element={<EmployeeManage />} />
              <Route path="/user" element={<UserInfo />} />
              <Route path="/park-vehicle" element={<ParkVehicle />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}
