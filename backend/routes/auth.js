import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register - Register new user
router.post('/register', [
  body('firebaseUid').notEmpty().withMessage('Firebase UID is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('displayName').trim().isLength({ min: 2, max: 50 }).withMessage('Display name must be 2-50 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firebaseUid, email, displayName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ firebaseUid }, { email }] 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = new User({
      firebaseUid,
      email,
      displayName,
      isAdmin: email === process.env.ADMIN_EMAIL
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        isAdmin: user.isAdmin,
        reputation: user.reputation
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /api/auth/login - Login user
router.post('/login', [
  body('firebaseUid').notEmpty().withMessage('Firebase UID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firebaseUid } = req.body;

    // Find user by Firebase UID
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isBanned) {
      return res.status(403).json({ 
        error: 'Account has been banned', 
        reason: user.banReason 
      });
    }

    // Update last seen
    user.lastSeen = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        isAdmin: user.isAdmin,
        reputation: user.reputation,
        stats: user.stats
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// POST /api/auth/demo-login - Demo login for testing
router.post('/demo-login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Handle admin demo login
    if (email === 'admin@qa-platform.com' && password === 'admin123') {
      const adminUser = await User.findOne({ email: 'admin@qa-platform.com' });
      if (!adminUser) {
        return res.status(404).json({ error: 'Admin user not found' });
      }

      const token = generateToken(adminUser._id);
      return res.json({
        message: 'Admin login successful',
        user: {
          _id: adminUser._id,
          email: adminUser.email,
          displayName: adminUser.displayName,
          isAdmin: true,
          reputation: adminUser.reputation,
          stats: adminUser.stats
        },
        token
      });
    }

    // Handle demo user login (Angat Shah)
    if (email === '22amtics097@gmail.com') {
      const demoUser = await User.findOne({ email: '22amtics097@gmail.com' });
      if (!demoUser) {
        return res.status(404).json({ error: 'Demo user not found' });
      }

      if (demoUser.isBanned) {
        return res.status(403).json({ 
          error: 'Account has been banned', 
          reason: demoUser.banReason 
        });
      }

      const token = generateToken(demoUser._id);
      return res.json({
        message: 'Demo login successful',
        user: {
          _id: demoUser._id,
          email: demoUser.email,
          displayName: demoUser.displayName,
          isAdmin: false,
          reputation: demoUser.reputation,
          stats: demoUser.stats
        },
        token
      });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const jwt = await import('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isBanned) {
      return res.status(403).json({ 
        error: 'Account has been banned', 
        reason: user.banReason 
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router; 