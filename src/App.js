import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.tsx";
import Test from "./pages/test/test2.tsx";
import ParkingLayout from "./components/layout/Layout.tsx";
import ParkingManage from "./pages/parking-manage/ParkingManage.tsx";
import UserManage from "./pages/user-manage/UserManage.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import UserInfo from "./pages/UserInfo/UserInfo.tsx";


export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ParkingLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="/parking-management" element={<ParkingManage />} />
              <Route path='/user-management' element={<UserManage />} />
              <Route path="/user" element={<UserInfo />} />

            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);