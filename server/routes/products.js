
const express = require('express');
const Product = require('../models/Product');
const Seller = require('../models/Seller');
const { auth, authorize } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');
const upload = require('../middleware/upload');
const redisClient = require('../src/config/redis');

const router = express.Router();


router.post('/', 
  auth, 
  authorize('seller'),
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'documents', maxCount: 3 }
  ]),
  async (req, res) => {
    try {
    
      const { error } = schemas.product.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const seller = await Seller.findOne({ userId: req.user._id });
      
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: 'Seller profile not found. Please complete your profile first.'
        });
      }

      const productData = {
        sellerId: seller._id,
        ...req.body
      };

      // Parse JSON strings if they exist
      if (typeof req.body.specifications === 'string') {
        try {
          productData.specifications = JSON.parse(req.body.specifications);
        } catch (e) {
          productData.specifications = {};
        }
      }

      if (typeof req.body.features === 'string') {
        try {
          productData.features = JSON.parse(req.body.features);
        } catch (e) {
          productData.features = [];
        }
      }

      if (typeof req.body.benefits === 'string') {
        try {
          productData.benefits = JSON.parse(req.body.benefits);
        } catch (e) {
          productData.benefits = [];
        }
      }

      // Handle file uploads
      if (req.files) {
        if (req.files.images && req.files.images.length > 0) {
          productData.images = req.files.images.map((file, index) => ({
            url: `/uploads/images/${file.filename}`,
            alt: `${req.body.productName} image ${index + 1}`,
            isPrimary: index === 0
          }));
        }

        if (req.files.documents && req.files.documents.length > 0) {
          productData.documents = req.files.documents.map(file => ({
            type: 'specification_sheet',
            name: file.originalname,
            url: `/uploads/documents/${file.filename}`
          }));
        }
      }

      const product = new Product(productData);
      await product.save();

      // Clear relevant caches
      await redisClient.del('products:*');

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Get all products (with search and filters) - Public endpoint
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      state,
      city,
      sustainabilityTag,
      minMoq,
      maxMoq,
      seller,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Create cache key based on query parameters
    const cacheKey = `products:${JSON.stringify(req.query)}`;
    
    // Try to get from cache
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
      return res.json({
        success: true,
        data: JSON.parse(cachedResult),
        cached: true
      });
    }

    // Build query
    const query = { status: 'active' };

    // Search functionality
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { productType: { $regex: search, $options: 'i' } },
        { features: { $regex: search, $options: 'i' } },
        { benefits: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    
    if (minPrice || maxPrice) {
      query['pricing.basePrice'] = {};
      if (minPrice) query['pricing.basePrice'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.basePrice'].$lte = parseFloat(maxPrice);
    }

   
    if (state) {
      query.$or = [
        { 'serviceableGeography.states': state },
        { 'serviceableGeography.nationwide': true }
      ];
    }
    if (city) {
      query['serviceableGeography.cities'] = city;
    }

 
    if (sustainabilityTag) {
      query.sustainabilityTags = sustainabilityTag;
    }

    // MOQ filters
    if (minMoq || maxMoq) {
      query['moq.quantity'] = {};
      if (minMoq) query['moq.quantity'].$gte = parseFloat(minMoq);
      if (maxMoq) query['moq.quantity'].$lte = parseFloat(maxMoq);
    }

    // Seller filter
    if (seller) {
      const sellerDoc = await Seller.findById(seller);
      if (sellerDoc) {
        query.sellerId = sellerDoc._id;
      }
    }

    // Pagination
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('sellerId', 'companyName brandName verificationStatus badges')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Product.countDocuments(query)
    ]);

    const result = {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: page > 1
      }
    };

    // Cache for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(result));

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single product - Public endpoint
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Try cache first
    const cachedProduct = await redisClient.get(`product:${productId}`);
    if (cachedProduct) {
      // Still increment view count
      await Product.findByIdAndUpdate(productId, { $inc: { views: 1 } });
      return res.json({
        success: true,
        data: JSON.parse(cachedProduct),
        cached: true
      });
    }

    const product = await Product.findById(productId)
      .populate('sellerId', 'companyName brandName contactDetails verificationStatus badges')
      .select('-__v');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

   
    await Product.findByIdAndUpdate(productId, { $inc: { views: 1 } });

  
    await redisClient.setEx(`product:${productId}`, 1800, JSON.stringify(product));

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/seller/my-products', auth, authorize('seller'), async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found'
      });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const query = { sellerId: seller._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          total,
          hasNext: skip + products.length < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update product
router.put('/:id', auth, authorize('seller'), async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });
    const product = await Product.findOne({ _id: req.params.id, sellerId: seller._id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or access denied'
      });
    }

    
    const { error } = schemas.product.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: error.details.map(detail => detail.message)
      });
    }

    Object.assign(product, req.body);
    await product.save();


    await redisClient.del(`product:${req.params.id}`);
    await redisClient.del('products:*');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


router.delete('/:id', auth, authorize('seller'), async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });
    const product = await Product.findOne({ _id: req.params.id, sellerId: seller._id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or access denied'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    // Clear caches
    await redisClient.del(`product:${req.params.id}`);
    await redisClient.del('products:*');

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


router.get('/filters/options', async (req, res) => {
  try {
  
    const cachedOptions = await redisClient.get('filter_options');
    if (cachedOptions) {
      return res.json({
        success: true,
        data: JSON.parse(cachedOptions),
        cached: true
      });
    }

    const [categories, sustainabilityTags, states, priceRange] = await Promise.all([
      Product.distinct('category', { status: 'active' }),
      Product.distinct('sustainabilityTags', { status: 'active' }),
      Product.distinct('serviceableGeography.states', { status: 'active' }),
      Product.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$pricing.basePrice' },
            maxPrice: { $max: '$pricing.basePrice' }
          }
        }
      ])
    ]);

    const options = {
      categories: categories.sort(),
      sustainabilityTags: sustainabilityTags.filter(tag => tag).sort(),
      states: states.filter(state => state).sort(),
      priceRange: priceRange[0] || { minPrice: 0, maxPrice: 100000 }
    };

    
    await redisClient.setEx('filter_options', 3600, JSON.stringify(options));

    res.json({
      success: true,
      data: options
    });
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;