
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/client/Home';
import Explore from './pages/client/Explore';
import Cart from './pages/client/Cart';
import StoreDashboard from './pages/client/StoreDashboard';
import Profile from './pages/client/Profile';
import EditProfile from './pages/client/EditProfile';
import ChangePassword from './pages/client/ChangePassword';
import OrderDetails from './pages/client/OrderDetails';
import Login from './pages/auth/Login';
import RegisterPartner from './pages/auth/RegisterPartner';
import RegisterReader from './pages/auth/RegisterReader';
import Editor from './pages/client/Editor';

import ProtectedRoute from './components/auth/ProtectedRoute';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooks from './pages/admin/AdminBooks';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReviews from './pages/admin/AdminReviews';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';

import StoreOrders from './pages/client/StoreOrders';
import StoreOrderDetails from './pages/client/StoreOrderDetails';
import Checkout from './pages/client/Checkout';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="books" element={<AdminBooks />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="categories" element={<AdminCategories />} />
              </Route>
            </Route>

            <Route path="/editor" element={<Editor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/partner" element={<RegisterPartner />} />
            <Route path="/register/reader" element={<RegisterReader />} />

            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="store" element={<StoreDashboard />} />
              <Route path="store/orders" element={<StoreOrders />} />
              <Route path="store/orders/:id" element={<StoreOrderDetails />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/edit" element={<EditProfile />} />
              <Route path="profile/password" element={<ChangePassword />} />
              <Route path="order/:id" element={<OrderDetails />} />
            </Route>

            <Route path="*" element={
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>404 - Không tìm thấy trang</h1>
                <a href="/">Quay về trang chủ</a>
              </div>
            } />

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
