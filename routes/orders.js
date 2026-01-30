const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      startDate,
      endDate
    } = req.query;

    const filter = { user: req.user._id };

    if (status) filter.status = status;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('items.product', 'name images');

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message
    });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product', 'name images specifications');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order',
      error: error.message
    });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { shippingAddress, shippingAddressId, paymentMethod, items } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required'
      });
    }

    // Validate shipping address
    let finalShippingAddress = shippingAddress;
    if (shippingAddressId) {
      const user = await User.findById(req.user._id);
      const addressObj = user.addresses.find(addr => addr._id.toString() === shippingAddressId);
      if (!addressObj) {
        return res.status(400).json({
          success: false,
          message: 'Selected address not found'
        });
      }
      finalShippingAddress = addressObj.toObject ? addressObj.toObject() : addressObj;
    } else if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address or address ID is required'
      });
    }

    const user = req.user;
    let orderItems = [];

    if (items && items.length > 0) {
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product || !product.isActive) {
          return res.status(400).json({
            success: false,
            message: `Product ${item.productId} not found or inactive`
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}`
          });
        }

        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.images[0]?.url || ''
        });
      }
    } else {
      const cart = await Cart.findOne({ user: user._id }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cart is empty'
        });
      }

      for (const cartItem of cart.items) {
        const product = cartItem.product;
        if (product.stock < cartItem.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}`
          });
        }

        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: cartItem.quantity,
          image: product.images[0]?.url || ''
        });
      }
    }

    const subtotal = orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    const shipping = subtotal > 500 ? 0 : 40;
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const total = subtotal + shipping + tax;

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      shippingAddress: finalShippingAddress,
      paymentInfo: {
        method: paymentMethod,
        status: 'pending'
      },
      pricing: {
        subtotal,
        shipping,
        tax,
        discount: 0,
        total
      },
      status: 'pending'
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    if (!items || items.length === 0) {
      await Cart.findOneAndUpdate(
        { user: user._id },
        { $set: { items: [], totalAmount: 0, lastUpdated: Date.now() } }
      );
    }

    await order.populate('items.product', 'name images');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    order.updateStatus('cancelled', { reason });
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
});

module.exports = router;