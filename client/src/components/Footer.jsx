import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">B2B Marketplace</h3>
            <p className="text-gray-600 text-sm">
              Connecting sustainable businesses for a greener future.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Products</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/products?category=plastics" className="hover:text-primary-600">Recycled Plastics</Link></li>
              <li><Link to="/products?category=metals" className="hover:text-primary-600">Metals</Link></li>
              <li><Link to="/products?category=paper" className="hover:text-primary-600">Paper</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">For Sellers</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/register" className="hover:text-primary-600">Become a Seller</Link></li>
              <li><Link to="/seller" className="hover:text-primary-600">Seller Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary-600">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-600">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © 2024 B2B Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;