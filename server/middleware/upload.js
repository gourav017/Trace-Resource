const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let subfolder = 'general';
    
    if (file.fieldname === 'documents') subfolder = 'documents';
    if (file.fieldname === 'certifications') subfolder = 'certifications';
    if (file.fieldname === 'images') subfolder = 'images';
    
    const destPath = path.join(uploadDir, subfolder);
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    
    cb(null, destPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);
  }
});

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = {
//     images: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
//     documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
//     certifications: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
//   };

//   const fieldAllowedTypes = allowedTypes[file.fieldname] || [...allowedTypes.images, ...allowedTypes.documents];
  
//   if (fieldAllowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: ${fieldAllowedTypes.join(', ')}`), false);
//   }
// };

const fileFilter = (req, file, cb) => {
  console.log(file);
  
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'image/jpg', 
    'image/webp',
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  ];

  if (allowedTypes.includes(file.mimetype)) {
 
    
    
    cb(null, true);
  } else {
    cb(new Error('Invalid file type for documents. Allowed types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document'));
  }
};


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files per request
  },
  fileFilter: fileFilter
});

module.exports = upload;