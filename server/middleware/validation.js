const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};

// Validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
    role: Joi.string().valid('buyer', 'seller').required().messages({
      'any.only': 'Role must be either buyer or seller',
      'any.required': 'Role is required'
    })
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  buyerProfile: Joi.object({
    name: Joi.string().required(),
    location: Joi.object({
      address: Joi.object({
        street: Joi.string().allow(''),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().pattern(/^\d{6}$/).required()
      }),
      coordinates: Joi.array().items(Joi.number()).length(2).optional()
    }),
    gstin: Joi.string().pattern(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/).required(),
    projects: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        type: Joi.string().valid('Construction', 'Manufacturing', 'Infrastructure', 'Renewable Energy', 'Other'),
        location: Joi.string().allow(''),
        sustainabilityGoals: Joi.array().items(Joi.string()),
        description: Joi.string().allow('')
      })
    ).min(1)
  }),
  
  sellerProfile: Joi.object({
    companyName: Joi.string().required(),
    brandName: Joi.string().allow(''),
    address: Joi.object({
      street: Joi.string().allow(''),
      city: Joi.string().required(),
      state: Joi.string().required(),
      pincode: Joi.string().pattern(/^\d{6}$/).required()
    }),
    contactDetails: Joi.object({
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      alternatePhone: Joi.string().allow('')
    }),
    officialContactPerson: Joi.object({
      name: Joi.string().required(),
      designation: Joi.string().allow(''),
      email: Joi.string().email().allow(''),
      phone: Joi.string().allow('')
    }),
    businessDetails: Joi.object({
      gstin: Joi.string().pattern(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/).required(),
      pan: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).required(),
      cinNumber: Joi.string().allow('')
    })
  }),
  
  product: Joi.object({
    productName: Joi.string().required(),
    productType: Joi.string().required(),
    category: Joi.string().valid('plastics', 'metals', 'paper', 'electronics', 'textiles', 'glass', 'chemicals', 'construction', 'automotive', 'other').required(),
    specifications: Joi.object().pattern(Joi.string(), Joi.string()),
    features: Joi.array().items(Joi.string()).default([]),
    benefits: Joi.array().items(Joi.string()).default([]),
    carbonFootprint: Joi.object({
      value: Joi.number(),
      unit: Joi.string().valid('kg_co2_per_ton', 'kg_co2_per_unit', 'percentage_reduction'),
      description: Joi.string()
    }).optional(),
    sourceLocations: Joi.array().items(
      Joi.object({
        city: Joi.string(),
        state: Joi.string(),
        pincode: Joi.string()
      })
    ).default([]),
    pricing: Joi.object({
      basePrice: Joi.number().positive().required(),
      priceRange: Joi.object({
        min: Joi.number().positive(),
        max: Joi.number().positive()
      }).optional(),
      unit: Joi.string().valid('kg', 'ton', 'piece', 'meter', 'liter', 'cubic_meter', 'square_meter').required()
    }),
    moq: Joi.object({
      quantity: Joi.number().positive().required(),
      unit: Joi.string().required()
    }),
    serviceableGeography: Joi.object({
      states: Joi.array().items(Joi.string()).default([]),
      cities: Joi.array().items(Joi.string()).default([]),
      nationwide: Joi.boolean().default(false)
    }),
    sustainabilityTags: Joi.array().items(
      Joi.string().valid('recycled', 'biodegradable', 'carbon_neutral', 'energy_efficient', 'water_efficient', 'renewable', 'eco_friendly')
    ).default([]),
    additionalInfo: Joi.string().allow('')
  })
};

module.exports = { validateRequest, schemas };