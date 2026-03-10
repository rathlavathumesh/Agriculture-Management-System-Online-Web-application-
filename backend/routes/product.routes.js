import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { Product, Shop, Purchase } from '../models/models.js';
import { makeCrudController } from '../controllers/crud.controller.js';
import { sequelize } from '../models/index.js';

const router = Router();
const ctrl = makeCrudController(Product);

router.use(authenticate);
router.get('/', authorize('admin', 'farmer', 'shop'), ctrl.list);

// Shop can only create products for their own shop
router.post('/', authorize('admin', 'shop'), async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.user.role === 'shop') {
      const shop = await Shop.findOne({ where: { user_id: req.user.id } });
      if (!shop) return res.status(400).json({ message: 'Shop profile not found' });
      body.shop_id = shop.id;
    }
    const created = await Product.create(body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ message: 'Create failed', error: e.message });
  }
});
router.get('/:id', authorize('admin', 'farmer', 'shop'), ctrl.get);
router.put('/:id', authorize('admin', 'shop'), ctrl.update);

// Custom delete: nullify related purchases then delete product
router.delete('/:id', authorize('admin', 'shop'), async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const product = await Product.findByPk(req.params.id, { transaction: t });
    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: 'Not found' });
    }
    // If role is shop, ensure they own the product
    if (req.user.role === 'shop') {
      const shop = await Shop.findOne({ where: { user_id: req.user.id }, transaction: t });
      if (!shop || product.shop_id !== shop.id) {
        await t.rollback();
        return res.status(403).json({ message: 'Forbidden' });
      }
    }
    // Set product_id to NULL in related purchases to preserve purchase history
    await Purchase.update(
      { product_id: null },
      { where: { product_id: product.id }, transaction: t }
    );
    await product.destroy({ transaction: t });
    await t.commit();
    return res.json({ success: true });
  } catch (e) {
    try { await t.rollback(); } catch {}
    return res.status(500).json({ message: 'Delete failed', error: e.message });
  }
});

export default router;




