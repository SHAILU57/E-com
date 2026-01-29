const express = require('express');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin, validateAddress } = require('../middleware/validation');

const router = express.Router();

router.post('/register', validateRegister, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    
    console.log(`[REGISTER] Attempting registration for email: ${email}, mobile: ${mobile}`);

    const existingUser = await User.findOne({ 
      $or: [{ email }, { mobile }] 
    });

    if (existingUser) {
      const duplicateField = existingUser.email === email ? 'Email' : 'Mobile number';
      console.log(`[REGISTER] ${duplicateField} already exists: ${email || mobile}`);
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Mobile number already registered'
      });
    }

    const user = await User.create({
      name,
      email,
      mobile,
      password
    });

    const token = generateToken({ id: user._id });

    console.log(`[REGISTER] Registration successful for email: ${email}`);
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: user.getJSON(),
        token
      }
    });
  } catch (error) {
    console.error('[REGISTER] Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`[LOGIN] Attempting login for email: ${email}`);

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log(`[LOGIN] User not found for email: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      console.log(`[LOGIN] Password mismatch for email: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      console.log(`[LOGIN] Account deactivated for email: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    const token = generateToken({ id: user._id });

    console.log(`[LOGIN] Login successful for email: ${email}`);
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getJSON(),
        token
      }
    });
  } catch (error) {
    console.error('[LOGIN] Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

router.get('/profile', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.getJSON()
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getJSON()
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

router.get('/addresses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: user.addresses || []
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get addresses',
      error: error.message
    });
  }
});

router.put('/addresses/:addressId', protect, async (req, res) => {
  try {
    const { addressId } = req.params;
    const { name, mobile, address, city, state, pincode, type } = req.body;
    
    const user = await User.findById(req.user._id);
    
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      name: name || user.addresses[addressIndex].name,
      mobile: mobile || user.addresses[addressIndex].mobile,
      address: address || user.addresses[addressIndex].address,
      city: city || user.addresses[addressIndex].city,
      state: state || user.addresses[addressIndex].state,
      pincode: pincode || user.addresses[addressIndex].pincode,
      type: type || user.addresses[addressIndex].type
    };
    
    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: {
        addresses: user.addresses
      }
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error.message
    });
  }
});

router.delete('/addresses/:addressId', protect, async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    
    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully',
      data: {
        addresses: user.addresses
      }
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: error.message
    });
  }
});

router.post('/addresses', protect, validateAddress, async (req, res) => {
  try {
    const { name, mobile, address, city, state, pincode, type } = req.body;

    const user = await User.findById(req.user._id);
    
    if (user.addresses.length === 0) {
      req.body.isDefault = true;
    }

    user.addresses.push({ name, mobile, address, city, state, pincode, type });
    
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: {
        addresses: user.addresses
      }
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add address',
      error: error.message
    });
  }
});

router.put('/addresses/:addressId/default', protect, async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === addressId;
    });
    
    await user.save();

    res.json({
      success: true,
      message: 'Default address updated successfully',
      data: {
        addresses: user.addresses
      }
    });
  } catch (error) {
    console.error('Update default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update default address',
      error: error.message
    });
  }
});

module.exports = router;