const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const authentication = require('../middleware/authentication');




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/users';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  }
});


router.put('/profile', authentication, upload.fields([
  { name: 'companyRegistrationDoc', maxCount: 1 },
  { name: 'certifications', maxCount: 5 }
]), async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = { ...req.body };


    if (req.files) {
      if (req.files.companyRegistrationDoc) {
        updateData.companyRegistrationDoc = req.files.companyRegistrationDoc[0].path;
      }
      if (req.files.certifications) {
        updateData.certifications = req.files.certifications.map(file => file.path);
      }
    }


    if (updateData.projects && typeof updateData.projects === 'string') {
      updateData.projects = JSON.parse(updateData.projects);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { profile: { ...req.user.profile, ...updateData } } },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});


router.get('/profile', authentication, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      profile: req.user.profile
    }
  });
});

module.exports = router;