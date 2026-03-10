import { Router } from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { User, Farmer, Shop } from '../models/models.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Return current authenticated user with linked farmer/shop ids
router.get('/me', authenticate, async (req, res) => {
  try {
    let user = await User.findByPk(req.user.id, { include: [
      { model: Farmer, as: 'farmer' },
      { model: Shop, as: 'shop' },
    ]});
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Ensure role-linked profile exists to avoid downstream failures
    if (user.role === 'farmer' && !user.farmer) {
      const genAadhar = (() => {
        const rand = String(Math.floor(Math.random() * 1e12)).padStart(12, '0');
        return rand;
      })();
      await Farmer.create({ user_id: user.id, aadhar_number: genAadhar, phone: '0000000000', address: '' });
    }
    if (user.role === 'shop' && !user.shop) {
      await Shop.create({ user_id: user.id, name: `${user.name}'s Shop`, location: '' });
    }
    // Re-fetch to include newly created associations
    if ((user.role === 'farmer' && !user.farmer) || (user.role === 'shop' && !user.shop)) {
      user = await User.findByPk(req.user.id, { include: [
        { model: Farmer, as: 'farmer' },
        { model: Shop, as: 'shop' },
      ]});
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      farmerId: user.farmer?.id || null,
      shopId: user.shop?.id || null,
      farmerAadhar: user.farmer?.aadhar_number || null,
      shopName: user.shop?.name || null,
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to load profile', error: e.message });
  }
});

export default router;
