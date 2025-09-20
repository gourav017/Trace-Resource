const express = require('express');
const Seller = require('../models/Seller');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');
const upload = require('../middleware/upload');
const redisClient = require('../src/config/redis');

const router = express.Router();

router.post('/profile', 
  auth, 
  authorize('seller'), 
  upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'certifications', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
     
      const { error } = schemas.sellerProfile.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const profileData = { ...req.body };
      
      
      if (req.files) {
        if (req.files.documents && req.files.documents.length > 0) {
          profileData.documents = req.files.documents.map(file => ({
            type: 'company_registration',  
            fileName: file.originalname,
            fileUrl: `/uploads/documents/${file.filename}`,
            uploadedAt: new Date()
          }));
        }
        
        if (req.files.certifications && req.files.certifications.length > 0) {
          profileData.certifications = req.files.certifications.map(file => ({
            name: file.originalname.replace(/\.[^/.]+$/, ""), 
            certificateUrl: `/uploads/certifications/${file.filename}`,
            uploadedAt: new Date()
          }));
        }
      }

      const existingSeller = await Seller.findOne({ userId: req.user._id });

      if (existingSeller) {
       
        Object.assign(existingSeller, profileData);
        
      
        if (profileData.documents) {
          existingSeller.documents = [...(existingSeller.documents || []), ...profileData.documents];
        }
        if (profileData.certifications) {
          existingSeller.certifications = [...(existingSeller.certifications || []), ...profileData.certifications];
        }
        
        await existingSeller.save();
        
        // Update user profile completion status
        await User.findByIdAndUpdate(req.user._id, { profileCompleted: true });
        
        // Clear cache
        await redisClient.del(`user:${req.user._id}`);
        await redisClient.del(`seller:${existingSeller._id}`);
        
        return res.json({
          success: true,
          message: 'Profile updated successfully',
          data: existingSeller
        });
      }

      
      const seller = new Seller({
        userId: req.user._id,
        ...profileData
      });

      await seller.save();
      
     
      await User.findByIdAndUpdate(req.user._id, { profileCompleted: true });
      
     
      await redisClient.del(`user:${req.user._id}`);

      res.status(201).json({
        success: true,
        message: 'Profile created successfully',
        data: seller
      });
    } catch (error) {
      console.error('Seller profile error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);


router.get('/profile', auth, authorize('seller'), async (req, res) => {
  try {

    const cached = await redisClient.get(`seller_profile:${req.user._id}`);
    if (cached) {
      return res.json({
        success: true,
        data: JSON.parse(cached)
      });
    }

    const seller = await Seller.findOne({ userId: req.user._id }).populate('userId', 'email isVerified');
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found'
      });
    }


    await redisClient.setEx(`seller_profile:${req.user._id}`, 1800, JSON.stringify(seller));

    res.json({
      success: true,
      data: seller
    });
  } catch (error) {
    console.error('Get seller profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


router.get('/dashboard', auth, authorize('seller'), async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found'
      });
    }

    
    const [totalProducts, activeProducts, draftProducts] = await Promise.all([
      Product.countDocuments({ sellerId: seller._id }),
      Product.countDocuments({ sellerId: seller._id, status: 'active' }),
      Product.countDocuments({ sellerId: seller._id, status: 'draft' })
    ]);

    const recentProducts = await Product.find({ sellerId: seller._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('productName status createdAt views inquiries');

    const dashboardData = {
      profile: {
        companyName: seller.companyName,
        brandName: seller.brandName,
        verificationStatus: seller.verificationStatus,
        badges: seller.badges
      },
      stats: {
        totalProducts,
        activeProducts,
        draftProducts,
        totalViews: recentProducts.reduce((sum, product) => sum + (product.views || 0), 0),
        totalInquiries: recentProducts.reduce((sum, product) => sum + (product.inquiries || 0), 0)
      },
      recentProducts,
      quickActions: [
        { name: 'Add New Product', action: 'add_product' },
        { name: 'Update Profile', action: 'update_profile' },
        { name: 'View Analytics', action: 'view_analytics' }
      ]
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Seller dashboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;