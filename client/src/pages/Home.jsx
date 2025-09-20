import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  CubeIcon,
  UserGroupIcon,
  ChartBarIcon,
  GlobeAltIcon,
  CogIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  
  const heroImages = [
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzA1N0I0RjtzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwNjk2ODg7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzA1OUY0RjtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9InVybCgjZ3JhZGllbnQxKSIvPgo8Y2lyY2xlIGN4PSIzMDAiIGN5PSIyMDAiIHI9IjEwMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+CjxjaXJjbGUgY3g9IjkwMCIgY3k9IjQwMCIgcj0iMTUwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIi8+CjxyZWN0IHg9IjUwMCIgeT0iMTUwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgcng9IjIwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpIi8+Cjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzEwN0Y0RTtzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwREI3NjU7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzA2OUY0OTtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9InVybCgjZ3JhZGllbnQyKSIvPgo8cGF0aCBkPSJNMCw0MDAgQzMwMCwzMDAgNjAwLDUwMCAxMjAwLDQwMCBMMTIwMCw2MDAgTDAsNjAwIFoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPgo8Y2lyY2xlIGN4PSI2MDAiIGN5PSIzMDAiIHI9IjIwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSI2MDAiIGN5PSIzMDAiIHI9IjEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMykiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4='
  ];

  const features = [
    {
      icon: MagnifyingGlassIcon,
      title: 'Smart Product Discovery',
      description: 'Find the right sustainable materials with advanced search and filtering capabilities.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Verified Suppliers',
      description: 'Work with trusted, verified suppliers who meet our quality and sustainability standards.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: CubeIcon,
      title: 'Quality Assurance',
      description: 'All products come with certifications and quality guarantees for your peace of mind.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: UserGroupIcon,
      title: 'Seamless Connection',
      description: 'Direct communication with suppliers for custom requirements and bulk orders.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const categories = [
    { 
      name: 'Recycled Plastics', 
      count: '150+ Products', 
      icon: '♻️',
      description: 'Smart waste tracking & optimization',
      link: '/products?category=plastics' 
    },
    { 
      name: 'Metals & Alloys', 
      count: '200+ Products', 
      icon: '🔩',
      description: 'Sustainable metal solutions',
      link: '/products?category=metals' 
    },
    { 
      name: 'Paper & Cardboard', 
      count: '100+ Products', 
      icon: '📄',
      description: 'Eco-friendly paper products',
      link: '/products?category=paper' 
    },
    { 
      name: 'Electronics', 
      count: '75+ Products', 
      icon: '⚡',
      description: 'Refurbished & sustainable tech',
      link: '/products?category=electronics' 
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Businesses Trust Us', subtext: 'Across 50+ countries' },
    { number: '99.9%', label: 'Compliance Rate', subtext: 'Automated accuracy' },
    { number: '40%', label: 'Cost Reduction', subtext: 'Average savings' },
    { number: '24/7', label: 'AI Monitoring', subtext: 'Continuous optimization' }
  ];

  const testimonials = [
    {
      quote: "Transformed our ESG reporting from weeks to hours. The AI insights are game-changing.",
      author: "Sarah Chen, Chief Sustainability Officer",
      company: "Global Manufacturing Corp",
      rating: 5
    },
    {
      quote: "Finally, a platform that makes EPR compliance straightforward and automated.",
      author: "Michael Torres, Environmental Manager", 
      company: "Tech Innovations Ltd",
      rating: 5
    }
  ];

  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section with Dynamic Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 transition-opacity duration-1000">
          <img 
            src={heroImages[currentImageIndex]} 
            alt="Sustainability Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        </div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="mb-6">
            <SparklesIcon className="w-16 h-16 mx-auto text-yellow-400 mb-4 animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-green-200 to-blue-200 bg-clip-text text-transparent">
              Intelligent Sustainability
            </span>
            <br />
            <span className="text-4xl md:text-5xl font-light">
              Compliance Platform
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-100 max-w-4xl mx-auto leading-relaxed">
            We simplify sustainability and compliance for businesses across sectors. Whether you are managing 
            <span className="text-green-300 font-semibold"> waste, circular economy initiatives, EPR compliance, ESG reporting </span> 
            or green certifications, our integrated intelligent platform ensures 
            <span className="text-blue-300 font-semibold"> effortless compliance, resource optimization, and environmental responsibility.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link
              to="/products"
              className="group bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-lg px-10 py-4 rounded-full shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
            >
              Browse Products
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/register"
              className="bg-white/10 backdrop-blur-md text-white font-semibold text-lg px-10 py-4 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Join as Seller
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
            <div className="text-sm text-gray-300">Trusted by leading companies:</div>
            {['Microsoft', 'Unilever', 'Siemens', 'IKEA'].map((company, i) => (
              <div key={i} className="text-white/60 font-medium">{company}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text mb-2">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-white mb-1">{stat.label}</div>
                <div className="text-gray-400">{stat.subtext}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Revolutionary Features for
              <span className="text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text"> Modern Business</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-powered sustainability management that transforms compliance from burden to competitive advantage.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Comprehensive Solutions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for sustainable business operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group block"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1">
                  <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{category.description}</p>
                  <p className="text-green-600 font-semibold">
                    {category.count}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-white text-lg mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="text-white font-semibold">{testimonial.author}</div>
                  <div className="text-gray-300">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Animated background elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Get Started?
            <br />
            <span className="text-yellow-300">Build Your Sustainable Future</span>
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Join thousands of forward-thinking businesses using our platform to source 
            sustainable materials and build responsible supply chains.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register?role=buyer"
              className="bg-white text-gray-900 font-bold text-lg px-12 py-4 rounded-full shadow-2xl hover:shadow-white/25 transform hover:-translate-y-1 transition-all duration-300"
            >
              Sign Up as Buyer
            </Link>
            <Link
              to="/register?role=seller"
              className="bg-transparent border-2 border-white text-white font-semibold text-lg px-12 py-4 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              Sign Up as Seller
            </Link>
          </div>
          
          <div className="mt-12 text-white/80">
            <p className="mb-2">🎉 Start your sustainable journey today</p>
            <p>✅ Verified suppliers | ✅ Quality assured | ✅ Sustainable materials</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;