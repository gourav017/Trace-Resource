import React, { Fragment } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { 
  UserCircleIcon, 
  Bars3Icon,
  ShoppingBagIcon,
  BuildingOfficeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

import logo from "../assets/logoTS.png"

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Products', href: '/products', current: location.pathname === '/products' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                <img src={logo} alt="" />
              </div>
              <span className="text-xl font-bold text-gray-900">Trace Resource</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.current
                    ? 'text-green-600 bg-green-50'
                    : 'text-green-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <UserCircleIcon className="w-8 h-8 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {user?.email}
                  </span>
                </Menu.Button>
                
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 focus:outline-none z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-200">
                        {user?.role === 'seller' ? 'Seller Account' : 'Buyer Account'}
                      </div>
                      
                      {user?.role === 'seller' && (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/seller"
                                className={`${
                                  active ? 'bg-gray-50' : ''
                                } flex items-center px-4 py-2 text-sm text-gray-700`}
                              >
                                <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                                Dashboard
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/seller/profile"
                                className={`${
                                  active ? 'bg-gray-50' : ''
                                } flex items-center px-4 py-2 text-sm text-gray-700`}
                              >
                                <UserCircleIcon className="w-4 h-4 mr-2" />
                                Profile
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/seller/products"
                                className={`${
                                  active ? 'bg-gray-50' : ''
                                } flex items-center px-4 py-2 text-sm text-gray-700`}
                              >
                                <ShoppingBagIcon className="w-4 h-4 mr-2" />
                                My Products
                              </Link>
                            )}
                          </Menu.Item>
                        </>
                      )}
                      
                      <div className="border-t border-gray-200">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? 'bg-gray-50' : ''
                              } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                            >
                              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                              Sign Out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-50">
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;