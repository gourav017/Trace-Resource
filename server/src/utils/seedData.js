const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Seller = require('../../models/Seller');
const Product = require('../../models/Product');
require('dotenv').config();

const seedData = async () => {
  try {
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    await User.deleteMany({});
    await Seller.deleteMany({});
    await Product.deleteMany({});
    console.log('🧹 Cleared existing data');

    const sampleSellers = [
      {
        email: 'ecorecycle@company.com',
        password: await bcrypt.hash('password123', 12),
        role: 'seller',
        profileCompleted: true
      },
      {
        email: 'greentech@company.com',
        password: await bcrypt.hash('password123', 12),
        role: 'seller',
        profileCompleted: true
      },
      {
        email: 'sustainmaterials@company.com',
        password: await bcrypt.hash('password123', 12),
        role: 'seller',
        profileCompleted: true
      }
    ];

    const users = await User.insertMany(sampleSellers);
    console.log('👥 Created sample users');

    const sellerProfiles = [
      {
        userId: users[0]._id,
        companyName: 'EcoRecycle Solutions Pvt Ltd',
        brandName: 'EcoRecycle',
        address: {
          street: 'Plot 45, Industrial Estate',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411019'
        },
        contactDetails: {
          email: 'contact@ecorecycle.com',
          phone: '+91-9876543210'
        },
        officialContactPerson: {
          name: 'Rajesh Kumar',
          designation: 'Sales Manager',
          email: 'rajesh@ecorecycle.com',
          phone: '+91-9876543212'
        },
        businessDetails: {
          gstin: '22ABCDE1234F1Z5',
          pan: 'ABCDE1234F'
        },
        verificationStatus: 'verified',
        badges: ['verified_supplier', 'eco_friendly']
      },
      {
        userId: users[1]._id,
        companyName: 'Green Tech Industries',
        brandName: 'GreenTech',
        address: {
          street: '23, Tech Park',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001'
        },
        contactDetails: {
          email: 'info@greentech.com',
          phone: '+91-8765432109'
        },
        officialContactPerson: {
          name: 'Priya Sharma',
          designation: 'Business Development',
          email: 'priya@greentech.com',
          phone: '+91-8765432108'
        },
        businessDetails: {
          gstin: '22ABCDE1234F1Z5',
          pan: 'FGHIJ5678K'
        },
        verificationStatus: 'verified',
        badges: ['verified_supplier', 'premium']
      },
      {
        userId: users[2]._id,
        companyName: 'Sustainable Materials Co',
        brandName: 'SustainMat',
        address: {
          street: '78, Green Avenue',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600001'
        },
        contactDetails: {
          email: 'hello@sustainmat.com',
          phone: '+91-7654321098'
        },
        officialContactPerson: {
          name: 'Arjun Reddy',
          designation: 'Operations Head',
          email: 'arjun@sustainmat.com',
          phone: '+91-7654321097'
        },
        businessDetails: {
          gstin: '22ABCDE1234F1Z5',
          pan: 'KLMNO9012P'
        },
        verificationStatus: 'verified',
        badges: ['verified_supplier']
      }
    ];

    const sellers = await Seller.insertMany(sellerProfiles);
    console.log('🏢 Created seller profiles');

   
    const sampleProducts = [

      {
        sellerId: sellers[0]._id,
        productName: 'Recycled PET Plastic Pellets',
        productType: 'Recycled Plastic Raw Material',
        category: 'plastics',
        specifications: new Map([
          ['material', 'PET (Polyethylene Terephthalate)'],
          ['purity', '95%'],
          ['density', '1.38 g/cm³'],
          ['melt_flow_rate', '25 g/10min']
        ]),
        features: ['Food-grade quality', 'High transparency', 'Chemical resistant'],
        benefits: ['Reduces plastic waste', 'Cost-effective alternative', 'Consistent quality'],
        pricing: {
          basePrice: 45000,
          unit: 'ton'
        },
        moq: {
          quantity: 5,
          unit: 'ton'
        },
        serviceableGeography: {
          states: ['Maharashtra', 'Karnataka', 'Gujarat'],
          nationwide: false
        },
        sustainabilityTags: ['recycled', 'eco_friendly'],
        status: 'active'
      },
      {
        sellerId: sellers[0]._id,
        productName: 'Shredded Paper Waste',
        productType: 'Paper Recycling Material',
        category: 'paper',
        specifications: new Map([
          ['type', 'Mixed office paper'],
          ['moisture_content', '8%'],
          ['contamination_level', '<2%']
        ]),
        features: ['Pre-sorted', 'Contamination-free', 'Ready for pulping'],
        benefits: ['Sustainable paper production', 'Reduced deforestation', 'Cost savings'],
        pricing: {
          basePrice: 12000,
          unit: 'ton'
        },
        moq: {
          quantity: 10,
          unit: 'ton'
        },
        serviceableGeography: {
          states: ['Maharashtra', 'Madhya Pradesh'],
          nationwide: false
        },
        sustainabilityTags: ['recycled', 'renewable'],
        status: 'active'
      },
    
      {
        sellerId: sellers[1]._id,
        productName: 'Copper Wire Recovery Granules',
        productType: 'Recovered Metal',
        category: 'metals',
        specifications: new Map([
          ['purity', '99.5%'],
          ['size', '2-4mm granules'],
          ['copper_content', '≥99.9%']
        ]),
        features: ['High purity', 'Clean separation', 'Ready to melt'],
        benefits: ['Reduces mining impact', 'High-quality copper', 'Competitive pricing'],
        pricing: {
          basePrice: 650000,
          unit: 'ton'
        },
        moq: {
          quantity: 1,
          unit: 'ton'
        },
        serviceableGeography: {
          states: ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh'],
          nationwide: false
        },
        sustainabilityTags: ['recycled', 'energy_efficient'],
        status: 'active'
      },
      {
        sellerId: sellers[1]._id,
        productName: 'E-waste Plastic Components',
        productType: 'Electronic Plastic Waste',
        category: 'electronics',
        specifications: new Map([
          ['plastic_types', 'ABS, PC, PS mixed'],
          ['metal_contamination', '<1%'],
          ['processing', 'Shredded and cleaned']
        ]),
        features: ['Metal-free', 'Color-sorted', 'Flame-retardant removed'],
        benefits: ['Electronic waste reduction', 'High-quality plastic', 'Environmental compliance'],
        pricing: {
          basePrice: 35000,
          unit: 'ton'
        },
        moq: {
          quantity: 2,
          unit: 'ton'
        },
        serviceableGeography: {
          states: ['Karnataka', 'Tamil Nadu'],
          nationwide: false
        },
        sustainabilityTags: ['recycled', 'eco_friendly'],
        status: 'active'
      },
    
      {
        sellerId: sellers[2]._id,
        productName: 'Organic Cotton Fiber Waste',
        productType: 'Textile Fiber Waste',
        category: 'textiles',
        specifications: new Map([
          ['fiber_length', '10-25mm'],
          ['moisture', '7-9%'],
          ['organic_certified', 'GOTS certified']
        ]),
        features: ['Organic certified', 'Color-separated', 'Chemical-free processing'],
        benefits: ['Sustainable textile production', 'Organic compliance', 'Soft hand feel'],
        pricing: {
          basePrice: 28000,
          unit: 'ton'
        },
        moq: {
          quantity: 3,
          unit: 'ton'
        },
        serviceableGeography: {
          states: ['Tamil Nadu', 'Karnataka', 'Kerala'],
          nationwide: false
        },
        sustainabilityTags: ['recycled', 'biodegradable', 'renewable'],
        status: 'active'
      },
      {
        sellerId: sellers[2]._id,
        productName: 'Crushed Glass Cullet',
        productType: 'Glass Recycling Material',
        category: 'glass',
        specifications: new Map([
          ['size_range', '5-20mm'],
          ['color', 'Clear/Mixed'],
          ['purity', '98%'],
          ['ceramics_contamination', '<0.1%']
        ]),
        features: ['Clean sorted', 'Multiple size grades', 'Low contamination'],
        benefits: ['Energy savings in glass production', 'Reduced raw material costs', 'Lower CO2 emissions'],
        pricing: {
          basePrice: 8000,
          unit: 'ton'
        },
        moq: {
          quantity: 15,
          unit: 'ton'
        },
        serviceableGeography: {
          states: ['Tamil Nadu', 'Karnataka', 'Andhra Pradesh'],
          nationwide: false
        },
        sustainabilityTags: ['recycled', 'energy_efficient'],
        status: 'active'
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log('📦 Created sample products');

    console.log('🎉 Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Seller 1: ecorecycle@company.com / password123');
    console.log('Seller 2: greentech@company.com / password123');
    console.log('Seller 3: sustainmaterials@company.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};


if (require.main === module) {
  seedData();
}

module.exports = seedData;