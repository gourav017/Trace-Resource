
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DocumentArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SellerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [certifications, setCertifications] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/seller/profile');
      if (response.data.success) {
        const profileData = response.data.data;
        setProfile(profileData);
        
   
        Object.keys(profileData).forEach(key => {
          if (key === 'address' || key === 'contactDetails' || key === 'officialContactPerson' || key === 'businessDetails') {
            Object.keys(profileData[key] || {}).forEach(subKey => {
              setValue(`${key}.${subKey}`, profileData[key][subKey]);
            });
          } else {
            setValue(key, profileData[key]);
          }
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      if (error.response?.status === 404) {
        // Profile doesn't exist yet, that's okay
        setProfile({});
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
   
      console.log('Form data:', data);
      console.log('Documents:', documents);
      console.log('Certifications:', certifications);

      const formData = new FormData();
      
 
      const processData = (obj, prefix = '') => {
        Object.keys(obj).forEach(key => {
          if (key !== 'documents' && key !== 'certifications') {
            const value = obj[key];
            const fieldName = prefix ? `${prefix}.${key}` : key;
            
            if (value !== null && value !== undefined) {
              if (typeof value === 'object' && !Array.isArray(value)) {
               
                Object.keys(value).forEach(subKey => {
                  const subValue = value[subKey];
                  if (subValue !== null && subValue !== undefined && subValue !== '') {
                    formData.append(`${fieldName}.${subKey}`, subValue);
                  }
                });
              } else if (value !== '') {
                formData.append(fieldName, value);
              }
            }
          }
        });
      };

      processData(data);

      
      documents.forEach((doc, index) => {
        formData.append('documents', doc);
      });

    
      certifications.forEach((cert, index) => {
        formData.append('certifications', cert);
      });


      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await api.post('/seller/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Profile saved successfully!');
        await loadProfile(); 
       
        setDocuments([]);
        setCertifications([]);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      
    
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      }
      
      const message = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Failed to save profile';
      toast.error(message);
      
      
      if (error.response?.data?.errors) {
        console.error('Validation errors:', error.response.data.errors);
        error.response.data.errors.forEach(err => {
          toast.error(err.message || err);
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    
   
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; 
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type`);
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name}: File too large (max 10MB)`);
        return false;
      }
      
      return true;
    });
    
    setDocuments(prev => [...prev, ...validFiles]);
  };

  const handleCertificationChange = (e) => {
    const files = Array.from(e.target.files);
    
    
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type`);
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name}: File too large (max 10MB)`);
        return false;
      }
      
      return true;
    });
    
    setCertifications(prev => [...prev, ...validFiles]);
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const removeCertification = (index) => {
    setCertifications(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />
  }

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Profile</h1>
          <p className="mt-1 text-gray-600">
            Complete your profile to start listing products
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Company Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    {...register('companyName', { required: 'Company name is required' })}
                    className={`input-field ${errors.companyName ? 'input-error' : ''}`}
                    placeholder="Enter company name"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-danger-600">{errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Name
                  </label>
                  <input
                    {...register('brandName')}
                    className="input-field"
                    placeholder="Enter brand name"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      {...register('address.street')}
                      className="input-field"
                      placeholder="Enter street address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      {...register('address.city', { required: 'City is required' })}
                      className={`input-field ${errors.address?.city ? 'input-error' : ''}`}
                      placeholder="Enter city"
                    />
                    {errors.address?.city && (
                      <p className="mt-1 text-sm text-danger-600">{errors.address.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <select
                      {...register('address.state', { required: 'State is required' })}
                      className={`input-field ${errors.address?.state ? 'input-error' : ''}`}
                    >
                      <option value="">Select state</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.address?.state && (
                      <p className="mt-1 text-sm text-danger-600">{errors.address.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      {...register('address.pincode', { 
                        required: 'Pincode is required',
                        pattern: {
                          value: /^\d{6}$/,
                          message: 'Enter a valid 6-digit pincode'
                        }
                      })}
                      className={`input-field ${errors.address?.pincode ? 'input-error' : ''}`}
                      placeholder="Enter pincode"
                    />
                    {errors.address?.pincode && (
                      <p className="mt-1 text-sm text-danger-600">{errors.address.pincode.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Email *
                  </label>
                  <input
                    {...register('contactDetails.email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Enter a valid email address'
                      }
                    })}
                    type="email"
                    className={`input-field ${errors.contactDetails?.email ? 'input-error' : ''}`}
                    placeholder="Enter business email"
                  />
                  {errors.contactDetails?.email && (
                    <p className="mt-1 text-sm text-danger-600">{errors.contactDetails.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    {...register('contactDetails.phone', { required: 'Phone number is required' })}
                    className={`input-field ${errors.contactDetails?.phone ? 'input-error' : ''}`}
                    placeholder="Enter phone number"
                  />
                  {errors.contactDetails?.phone && (
                    <p className="mt-1 text-sm text-danger-600">{errors.contactDetails.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alternate Phone
                  </label>
                  <input
                    {...register('contactDetails.alternatePhone')}
                    className="input-field"
                    placeholder="Enter alternate phone"
                  />
                </div>
              </div>

              {/* Official Contact Person */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Official Contact Person</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      {...register('officialContactPerson.name', { required: 'Contact person name is required' })}
                      className={`input-field ${errors.officialContactPerson?.name ? 'input-error' : ''}`}
                      placeholder="Enter contact person name"
                    />
                    {errors.officialContactPerson?.name && (
                      <p className="mt-1 text-sm text-danger-600">{errors.officialContactPerson.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Designation
                    </label>
                    <input
                      {...register('officialContactPerson.designation')}
                      className="input-field"
                      placeholder="Enter designation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      {...register('officialContactPerson.email')}
                      type="email"
                      className="input-field"
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      {...register('officialContactPerson.phone')}
                      className="input-field"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Business Details</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GSTIN *
                  </label>
                  <input
                    {...register('businessDetails.gstin', { 
                      required: 'GSTIN is required',
                      pattern: {
                        value: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,
                        message: 'Enter a valid GSTIN'
                      }
                    })}
                    className={`input-field ${errors.businessDetails?.gstin ? 'input-error' : ''}`}
                    placeholder="Enter GSTIN"
                  />
                  {errors.businessDetails?.gstin && (
                    <p className="mt-1 text-sm text-danger-600">{errors.businessDetails.gstin.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PAN *
                  </label>
                  <input
                    {...register('businessDetails.pan', { 
                      required: 'PAN is required',
                      pattern: {
                        value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                        message: 'Enter a valid PAN'
                      }
                    })}
                    className={`input-field ${errors.businessDetails?.pan ? 'input-error' : ''}`}
                    placeholder="Enter PAN"
                  />
                  {errors.businessDetails?.pan && (
                    <p className="mt-1 text-sm text-danger-600">{errors.businessDetails.pan.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CIN Number (Optional)
                  </label>
                  <input
                    {...register('businessDetails.cinNumber')}
                    className="input-field"
                    placeholder="Enter CIN number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Documents Upload */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Documents & Certifications</h2>
            </div>
            <div className="card-body space-y-6">
              {/* Documents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Documents
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload business documents
                        </span>
                        <input
                          type="file"
                          className="sr-only"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleDocumentChange}
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        PDF, DOC, JPG, PNG up to 10MB each
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Document List */}
                {documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{doc.name}</span>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-danger-600 hover:text-danger-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Existing Documents */}
                {profile?.documents && profile.documents.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Uploaded Documents</h4>
                    <div className="space-y-2">
                      {profile.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <span className="text-sm text-gray-700">{doc.fileName}</span>
                          <span className={`badge ${
                            doc.verificationStatus === 'verified' ? 'badge-success' :
                            doc.verificationStatus === 'pending' ? 'badge-warning' : 'badge-danger'
                          }`}>
                            {doc.verificationStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload certifications
                        </span>
                        <input
                          type="file"
                          className="sr-only"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleCertificationChange}
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        ISO, Quality certificates, etc.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Certification List */}
                {certifications.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{cert.name}</span>
                        <button
                          type="button"
                          onClick={() => removeCertification(index)}
                          className="text-danger-600 hover:text-danger-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Existing Certifications */}
                {profile?.certifications && profile.certifications.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Uploaded Certifications</h4>
                    <div className="space-y-2">
                      {profile.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="text-sm text-gray-700">{cert.name}</span>
                          <span className={`badge ${
                            cert.verificationStatus === 'verified' ? 'badge-success' :
                            cert.verificationStatus === 'pending' ? 'badge-warning' : 'badge-danger'
                          }`}>
                            {cert.verificationStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerProfile;