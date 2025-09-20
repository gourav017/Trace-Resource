import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';


import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProductCatalogue from './pages/ProductCatalogue';
import ProductDetail from './pages/ProductDetail';


import SellerDashboard from './pages/seller/Dashboard';
import SellerProfile from './pages/seller/Profile';
import SellerProducts from './pages/seller/Products';
import AddProduct from './pages/seller/AddProduct';

function App() {
  const { isAuthenticated, user, loading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
     
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/products" element={<ProductCatalogue />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        
      
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to={user?.role === 'seller' ? '/seller' : '/'} />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to={user?.role === 'seller' ? '/seller' : '/'} />} 
        />
        
        <Route path="/seller" element={<ProtectedRoute allowedRoles={['seller']} />}>
          <Route index element={<SellerDashboard />} />
          <Route path="profile" element={<SellerProfile />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="products/add" element={<AddProduct />} />
        </Route>
        
      
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;