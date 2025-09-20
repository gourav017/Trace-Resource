const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  productType: {
    type: String,
    required: [true, 'Product type is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['plastics', 'metals', 'paper', 'electronics', 'textiles', 'glass', 'chemicals', 'construction', 'automotive', 'other']
  },
  specifications: {
    type: Map,
    of: String,
    default: new Map()
  },
  features: [String],
  benefits: [String],
  carbonFootprint: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg_co2_per_ton', 'kg_co2_per_unit', 'percentage_reduction']
    },
    description: String
  },
  sourceLocations: [{
    city: String,
    state: String,
    pincode: String
  }],
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    priceRange: {
      min: Number,
      max: Number
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['kg', 'ton', 'piece', 'meter', 'liter', 'cubic_meter', 'square_meter']
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  moq: {
    quantity: {
      type: Number,
      required: [true, 'MOQ quantity is required'],
      min: [1, 'MOQ must be at least 1']
    },
    unit: {
      type: String,
      required: [true, 'MOQ unit is required']
    }
  },
  serviceableGeography: {
    states: [String],
    cities: [String],
    nationwide: {
      type: Boolean,
      default: false
    }
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  documents: [{
    type: {
      type: String,
      enum: ['quality_certificate', 'test_report', 'specification_sheet', 'other']
    },
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  certifications: [{
    name: String,
    issuingBody: String,
    certificateUrl: String,
    validUntil: Date
  }],
  sustainabilityTags: [{
    type: String,
    enum: ['recycled', 'biodegradable', 'carbon_neutral', 'energy_efficient', 'water_efficient', 'renewable', 'eco_friendly']
  }],
  additionalInfo: String,
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  inquiries: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

productSchema.index({ sellerId: 1, status: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ 'pricing.basePrice': 1 });
productSchema.index({ sustainabilityTags: 1 });
productSchema.index({ 'serviceableGeography.states': 1 });
productSchema.index({ status: 1, createdAt: -1 });


productSchema.index({
  productName: 'text',
  productType: 'text',
  features: 'text',
  benefits: 'text'
});

module.exports = mongoose.model('Product', productSchema);
