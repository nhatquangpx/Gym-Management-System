const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Package = require('../models/Package');
const Order = require('../models/Order');
const { verifyToken } = require('../middleware/authMiddleware');

// Endpoint to get a user's membership status
router.get('/membership-status', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get membership info
    const membershipInfo = user.memberInfo || {};
    const currentDate = new Date();
    const membershipEnd = membershipInfo.membershipEnd ? new Date(membershipInfo.membershipEnd) : null;
    
    // Calculate membership status
    let status = 'inactive';
    if (membershipEnd) {
      if (membershipEnd > currentDate) {
        status = 'active';
      } else {
        status = 'expired';
      }
    }
    
    // Calculate days remaining or days since expiration
    let daysRemaining = 0;
    if (membershipEnd) {
      const diffTime = Math.abs(membershipEnd - currentDate);
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Make it negative if expired
      if (status === 'expired') {
        daysRemaining = -daysRemaining;
      }
    }
    
    // Get package details if available
    let packageDetails = null;
    const latestOrder = await Order.findOne({ 
      userId: userId,
      status: 'paid'
    }).sort({ createdAt: -1 });
    
    if (latestOrder) {
      const gymPackage = await Package.findById(latestOrder.packageId);
      if (gymPackage) {
        packageDetails = {
          id: gymPackage._id,
          name: gymPackage.name,
          description: gymPackage.description,
          price: gymPackage.price,
          duration: gymPackage.duration
        };
      }
    }
    
    return res.json({
      success: true,
      membershipInfo: {
        status,
        startDate: membershipInfo.membershipStart,
        endDate: membershipInfo.membershipEnd,
        daysRemaining,
        isExpired: status === 'expired',
        packageDetails
      }
    });
    
  } catch (error) {
    console.error('Error fetching membership status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Export router
module.exports = router;
