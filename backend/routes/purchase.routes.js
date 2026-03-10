import { Router } from 'express';
import { Op } from 'sequelize';
import { authenticate, authorize } from '../middleware/auth.js';
import { Purchase, Product, Farmer, Shop, User } from '../models/models.js';
import { makeCrudController } from '../controllers/crud.controller.js';
import { sequelize } from '../models/index.js';

const router = Router();
const ctrl = makeCrudController(Purchase);

router.use(authenticate);

// List purchases based on role
router.get('/', authorize('admin', 'shop', 'farmer'), async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const items = await Purchase.findAll({
        include: [
          { model: Farmer, as: 'farmer', include: [{ model: User, as: 'user', attributes: ['id','name','email'] }] },
          { model: Product, as: 'product', attributes: ['id', 'name', 'price', 'category'], include: [
            { model: Shop, as: 'shop', include: [{ model: User, as: 'user', attributes: ['id','name','email'] }] }
          ] },
        ],
        order: [['purchase_date', 'DESC'], ['createdAt', 'DESC']],
      });
      return res.json(items);
    }
    if (req.user.role === 'farmer') {
      const farmer = await Farmer.findOne({ where: { user_id: req.user.id } });
      if (!farmer) return res.json([]);
      const items = await Purchase.findAll({
        where: { farmer_id: farmer.id },
        include: [
          { model: Product, as: 'product', attributes: ['id', 'name', 'price', 'category'] },
        ],
        order: [['purchase_date', 'DESC'], ['createdAt', 'DESC']],
      });
      return res.json(items);
    }
    // shop owner
    const shop = await Shop.findOne({ where: { user_id: req.user.id } });
    if (!shop) return res.json([]);
    const items = await Purchase.findAll({
      where: { shop_id: shop.id },
      include: [
        { model: Product, as: 'product', attributes: ['id', 'name', 'price', 'category'], required: false },
      ],
      order: [['purchase_date', 'DESC'], ['createdAt', 'DESC']],
    });
    return res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load purchases', error: e.message });
  }
});

// Create purchase - farmer can only create for self, and stock is decremented atomically
router.post('/', authorize('admin', 'farmer'), async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const body = { ...req.body };

    if (req.user.role === 'farmer') {
      let farmer = await Farmer.findOne({ where: { user_id: req.user.id }, transaction: t });
      if (!farmer) {
        // Create a minimal farmer profile to unblock the action
        farmer = await Farmer.create({ user_id: req.user.id, aadhar_number: String(Math.floor(Math.random() * 1e12)).padStart(12, '0'), phone: '0000000000', address: '' }, { transaction: t });
      }
      body.farmer_id = farmer.id;
    }

    const quantity = parseInt(body.quantity, 10);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      await t.rollback();
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    const productId = body.product_id;
    const product = await Product.findByPk(productId, { transaction: t });
    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: 'Product not found' });
    }

    // Compute total price on the server to prevent tampering
    const unitPrice = Number(product.price);
    const totalPrice = (unitPrice * quantity).toFixed(2);

    // Atomically decrement stock if sufficient
    const [affected] = await Product.update(
      { stock_quantity: sequelize.literal(`CASE WHEN stock_quantity >= ${quantity} THEN stock_quantity - ${quantity} ELSE stock_quantity END`) },
      { where: { id: productId, stock_quantity: { [Op.gte]: quantity } }, transaction: t }
    );
    if (!affected) {
      await t.rollback();
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const created = await Purchase.create({
      farmer_id: body.farmer_id,
      product_id: productId,
      shop_id: product.shop_id,
      product_name: product.name,
      product_price: product.price,
      quantity,
      total_price: totalPrice,
      purchase_date: body.purchase_date || new Date(),
    }, { transaction: t });

    // Fetch updated product to include new stock in response (optional but useful for UI)
    const updatedProduct = await Product.findByPk(productId, { transaction: t });

    await t.commit();
    return res.status(201).json({ ...created.toJSON(), product: updatedProduct });
  } catch (e) {
    try { await t.rollback(); } catch {}
    return res.status(400).json({ message: 'Create failed', error: e.message });
  }
});

router.get('/:id', authorize('admin', 'shop', 'farmer'), ctrl.get);
router.put('/:id', authorize('admin'), ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

export default router;




