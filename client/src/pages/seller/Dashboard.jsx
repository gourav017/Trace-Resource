import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  EyeIcon, 
  ShoppingBagIcon,
  DocumentTextIcon,
  // TrendingUpIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
// import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';

const SellerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/seller/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return 
    <h2>no</h2>
    // <LoadingSpinner text="Loading dashboard..." />;
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No data available</h2>
          <Link to="/seller/profile" className="btn btn-primary">
            Complete Your Profile
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Products',
      value: dashboardData.stats.totalProducts,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      href: '/seller/products'
    },
    {
      name: 'Active Products',
      value: dashboardData.stats.activeProducts,
      icon: ShoppingBagIcon,
      color: 'bg-green-500',
      href: '/seller/products?status=active'
    },
    {
      name: 'Draft Products',
      value: dashboardData.stats.draftProducts,
      icon: DocumentTextIcon,
      color: 'bg-yellow-500',
      href: '/seller/products?status=draft'
    },
    {
      name: 'Total Views',
      value: dashboardData.stats.totalViews,
      icon: EyeIcon,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-gray-600">
                Welcome back, {dashboardData.profile.companyName}
              </p>
            </div>
            <Link to="/seller/products/add" className="btn btn-primary">
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="card hover:shadow-lg transition-shadow">
              <div className="card-body">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-gray-600">{stat.name}</p>
                  </div>
                </div>
                {stat.href && (
                  <div className="mt-4">
                    <Link
                      to={stat.href}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View details →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
                <Link
                  to="/seller/products"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="card-body">
              {dashboardData.recentProducts.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentProducts.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{product.productName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className={`badge ${
                            product.status === 'active' ? 'badge-success' : 
                            product.status === 'draft' ? 'badge-warning' : 'badge-secondary'
                          }`}>
                            {product.status}
                          </span>
                          <span className="flex items-center">
                            <EyeIcon className="w-4 h-4 mr-1" />
                            {product.views || 0} views
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/products/${product._id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <ShoppingBagIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No products yet</p>
                  <Link to="/seller/products/add" className="btn btn-primary">
                    Add Your First Product
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 gap-3">
                {dashboardData.quickActions?.map((action, index) => (
                  <Link
                    key={index}
                    to={
                      action.action === 'add_product' ? '/seller/products/add' :
                      action.action === 'update_profile' ? '/seller/profile' :
                      '/seller'
                    }
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{action.name}</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Status */}
        <div className="mt-8">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Profile Status</h2>
            </div>
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Company Profile</h3>
                  <p className="text-gray-600">
                    Status: <span className={`font-medium ${
                      dashboardData.profile.verificationStatus === 'verified' ? 'text-green-600' :
                      dashboardData.profile.verificationStatus === 'pending' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {dashboardData.profile.verificationStatus?.charAt(0).toUpperCase() + 
                       dashboardData.profile.verificationStatus?.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {dashboardData.profile.badges?.map((badge) => (
                    <span key={badge} className="badge badge-success">
                      {badge.replace('_', ' ')}
                    </span>
                  ))}
                  <Link to="/seller/profile" className="btn btn-secondary">
                    Update Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;