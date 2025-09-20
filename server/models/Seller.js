const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  brandName: {
    type: String,
    trim: true
  },
  address: {
    street : String,
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
  },
  contactDetails: {
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    alternatePhone: String
  },
  officialContactPerson: {
    name: {
      type: String,
      required: [true, 'Contact person name is required']
    },
    designation: String,
    email: String,
    phone: String
  },
  businessDetails: {
    gstin: {
      type: String,
      required: [true, 'GSTIN is required'],
      match: [/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/, 'Please enter a valid GSTIN']
    },
    pan: {
      type: String,
      required: [true, 'PAN is required'],
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN']
    },
    cinNumber: String
  },
  documents: [{
    type: {
      type: String,
      enum: ['company_registration', 'gst_certificate', 'pan_card', 'other'],
      required: true
    },
    fileName: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  }],
  certifications: [{
    name: {
      type: String,
      required: true
    },
    issuingBody: String,
    issueDate: Date,
    expiryDate: Date,
    certificateUrl: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  }],
  verificationStatus: {
    type: String,
    enum: ['pending', 'in_review', 'verified', 'rejected'],
    default: 'pending'
  },
  badges: [{
    type: String,
    enum: ['verified_supplier', 'premium', 'eco_friendly', 'trusted_partner']
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Seller', sellerSchema);