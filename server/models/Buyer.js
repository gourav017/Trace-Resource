
const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    },
    address: {
      street: String,
      city: {
        type: String,
        required: [true, 'City is required']
      },
      state: {
        type: String,
        required: [true, 'State is required']
      },
      pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
      },
      country: {
        type: String,
        default: 'India'
      }
    }
  },
  gstin: {
    type: String,
    required: [true, 'GSTIN is required'],
    match: [/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/, 'Please enter a valid GSTIN']
  },
  projects: [{
    name: {
      type: String,
      required: [true, 'Project name is required']
    },
    type: {
      type: String,
      enum: ['Construction', 'Manufacturing', 'Infrastructure', 'Renewable Energy', 'Other'],
      default: 'Other'
    },
    location: String,
    sustainabilityGoals: [String],
    startDate: Date,
    endDate: Date,
    description: String
  }]
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
buyerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Buyer', buyerSchema);
