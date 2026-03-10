import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { Crop, Farmer } from '../models/models.js';
import { makeCrudController } from '../controllers/crud.controller.js';

const router = Router();
const ctrl = makeCrudController(Crop);

router.use(authenticate);

// List crops: admin sees all, farmer sees own
router.get('/', authorize('admin', 'farmer'), async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const items = await Crop.findAll();
      return res.json(items);
    }
    const farmer = await Farmer.findOne({ where: { user_id: req.user.id } });
    if (!farmer) return res.json([]);
    const items = await Crop.findAll({ where: { farmer_id: farmer.id } });
    return res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load crops', error: e.message });
  }
});

// Create crop: farmer can only create for self
router.post('/', authorize('admin', 'farmer'), async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.user.role === 'farmer') {
      let farmer = await Farmer.findOne({ where: { user_id: req.user.id } });
      if (!farmer) {
        farmer = await Farmer.create({ user_id: req.user.id, aadhar_number: String(Math.floor(Math.random() * 1e12)).padStart(12, '0'), phone: '0000000000', address: '' });
      }
      body.farmer_id = farmer.id;
    }
    const created = await Crop.create(body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ message: 'Create failed', error: e.message });
  }
});

router.get('/:id', authorize('admin', 'farmer'), ctrl.get);
router.put('/:id', authorize('admin', 'farmer'), ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

export default router;




