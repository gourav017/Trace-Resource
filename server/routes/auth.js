const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Buyer = require('../models/Buyer');
const Seller = require('../models/Seller');
const { validateRequest, schemas } = require('../middleware/validation');
const { auth } = require('../middleware/auth');
const redisClient = require('../src/config/redis');

const router = express.Router();


const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};


router.post('/register', validateRequest(schemas.register), async (req, res) => {
  try {
    const { email, password, role } = req.body;

 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

 
    const user = new User({
      email,
      password,
      role
    });

    await user.save();

   
    const token = generateToken(user);

   
    await redisClient.setEx(`user:${user._id}`, 3600, JSON.stringify({
      id: user._id,
      email: user.email,
      role: user.role,
      profileCompleted: user.profileCompleted
    }));

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profileCompleted: user.profileCompleted,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


router.post('/login', validateRequest(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;

  
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

 
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

   
    user.lastLogin = new Date();
    await user.save();

    
    const token = generateToken(user);

    
    let profileData = null;
    if (user.role === 'buyer') {
      profileData = await Buyer.findOne({ userId: user._id });
    } else if (user.role === 'seller') {
      profileData = await Seller.findOne({ userId: user._id });
    }

    
    await redisClient.setEx(`user:${user._id}`, 3600, JSON.stringify({
      id: user._id,
      email: user.email,
      role: user.role,
      profileCompleted: !!profileData
    }));

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profileCompleted: !!profileData,
          lastLogin: user.lastLogin
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
  
    const cachedUser = await redisClient.get(`user:${req.user._id}`);
    
    if (cachedUser) {
      const userData = JSON.parse(cachedUser);
      return res.json({
        success: true,
        data: userData
      });
    }

  
    let profileData = null;
    if (req.user.role === 'buyer') {
      profileData = await Buyer.findOne({ userId: req.user._id });
    } else if (req.user.role === 'seller') {
      profileData = await Seller.findOne({ userId: req.user._id });
    }

    const userData = {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      profileCompleted: !!profileData,
      isVerified: req.user.isVerified
    };

    await redisClient.setEx(`user:${req.user._id}`, 3600, JSON.stringify(userData));

    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


router.post('/logout', auth, async (req, res) => {
  try {
    
    await redisClient.del(`user:${req.user._id}`);
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }
});


router.post('/buyer/profile', auth, validateRequest(schemas.buyerProfile), async (req, res) => {
  try {
    if (req.user.role !== 'buyer') {
      return res.status(403).json({
        success: false,
        message: 'Only buyers can create buyer profiles'
      });
    }

    const existingBuyer = await Buyer.findOne({ userId: req.user._id });

    if (existingBuyer) {
    
      Object.assign(existingBuyer, req.body);
      await existingBuyer.save();
      
   
      await User.findByIdAndUpdate(req.user._id, { profileCompleted: true });

      await redisClient.del(`user:${req.user._id}`);
      
      return res.json({
        success: true,
        message: 'Buyer profile updated successfully',
        data: existingBuyer
      });
    }

    // Create new profile
    const buyer = new Buyer({
      userId: req.user._id,
      ...req.body
    });

    await buyer.save();
    
    // Update user profile completion status
    await User.findByIdAndUpdate(req.user._id, { profileCompleted: true });
    
    // Clear cache
    await redisClient.del(`user:${req.user._id}`);

    res.status(201).json({
      success: true,
      message: 'Buyer profile created successfully',
      data: buyer
    });
  } catch (error) {
    console.error('Buyer profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;