import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPinIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  TruckIcon,
  ShieldCheckIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading product..." />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-700">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{product.productName}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div>
              {product.images && product.images.length > 0 ? (
                <div>
                  <div className="aspect-w-16 aspect-h-12 mb-4">
                    <img
                      src={`http://localhost:5000${product.images[activeImageIndex]?.url}`}
                      alt={product.productName}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="flex space-x-2">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            activeImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={`http://localhost:5000${image.url}`}
                            alt={`${product.productName} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No images available</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.productName}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </span>
                    <div className="flex items-center text-gray-500">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      <span className="text-sm">{product.views || 0} views</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{new Intl.NumberFormat('en-IN').format(product.pricing.basePrice)}
                </span>
                <span className="text-lg text-gray-600 ml-2">per {product.pricing.unit}</span>
                {product.pricing.minimumOrderQuantity && (
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum Order: {product.pricing.minimumOrderQuantity} {product.pricing.unit}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>

              {/* Key Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">Quality Assured</span>
                  </div>
                  <div className="flex items-center">
                    <TruckIcon className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-700">Fast Delivery</span>
                  </div>
                  <div className="flex items-center">
                    <ShieldCheckIcon className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-700">Verified Supplier</span>
                  </div>
                  <div className="flex items-center">
                    <CubeIcon className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="text-sm text-gray-700">Bulk Orders</span>
                  </div>
                </div>
              </div>

              {/* Contact Seller */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Seller</h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{product.seller?.companyName}</p>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {product.location?.city}, {product.location?.state}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-4">
                    <a
                      href={`tel:${product.seller?.contactDetails?.phone}`}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      Call Now
                    </a>
                    <a
                      href={`mailto:${product.seller?.contactDetails?.email}`}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <EnvelopeIcon className="w-4 h-4 mr-2" />
                      Send Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="border-b border-gray-200 pb-2">
                  <dt className="text-sm font-medium text-gray-500">{key}</dt>
                  <dd className="text-sm text-gray-900 mt-1">{value}</dd>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;