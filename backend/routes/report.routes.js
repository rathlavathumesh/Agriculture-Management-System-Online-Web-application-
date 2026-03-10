import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { Report, Purchase, Product, Farmer, Shop, User } from '../models/models.js';

const router = Router();

router.use(authenticate);

// Basic CRUD for reports
router.get('/', authorize('admin'), async (_req, res) => {
  const reports = await Report.findAll();
  res.json(reports);
});

router.post('/', authorize('admin'), async (req, res) => {
  const report = await Report.create(req.body);
  res.status(201).json(report);
});

// Example: total products sold
router.get('/metrics/total-products-sold', authorize('admin', 'shop'), async (_req, res) => {
  const purchases = await Purchase.findAll();
  const total = purchases.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
  res.json({ totalProductsSold: total });
});

// Example: farmer purchase trends (simple aggregation)
router.get('/metrics/farmer-purchases', authorize('admin', 'shop'), async (_req, res) => {
  const purchases = await Purchase.findAll({ include: [{ model: Farmer, as: 'farmer' }, { model: Product, as: 'product' }] });
  const trends = {};
  for (const p of purchases) {
    const key = p.farmer_id;
    trends[key] = (trends[key] || 0) + Number(p.total_price || 0);
  }
  res.json(trends);
});

// Shop-specific sales metrics for the authenticated shop owner
router.get('/metrics/shop-sales', authorize('shop'), async (req, res) => {
  const shop = await Shop.findOne({ where: { user_id: req.user.id } });
  if (!shop) return res.json({ totalRevenue: 0, totalOrders: 0, totalItemsSold: 0 });
  const products = await Product.findAll({ where: { shop_id: shop.id } });
  const productIds = products.map(p => p.id);
  if (productIds.length === 0) return res.json({ totalRevenue: 0, totalOrders: 0, totalItemsSold: 0 });
  const purchases = await Purchase.findAll({ where: { product_id: productIds } });
  const totalRevenue = purchases.reduce((s, p) => s + Number(p.total_price || 0), 0);
  const totalOrders = purchases.length;
  const totalItemsSold = purchases.reduce((s, p) => s + Number(p.quantity || 0), 0);
  res.json({ totalRevenue, totalOrders, totalItemsSold });
});

// Admin overview tables
router.get('/admin/farmer-purchases', authorize('admin'), async (_req, res) => {
  const rows = await Purchase.findAll({
    include: [
      { model: Farmer, as: 'farmer' },
      { model: Product, as: 'product', include: [{ model: Shop, as: 'shop', include: [{ model: User, as: 'user' }] }] },
    ],
    order: [['purchase_date', 'DESC']],
  });
  const table = rows.map(r => ({
    farmerAadhar: r.farmer?.aadhar_number || null,
    productName: r.product?.name || null,
    quantity: Number(r.quantity || 0),
    date: r.purchase_date,
    totalAmount: Number(r.total_price || 0),
  }));
  res.json(table);
});

router.get('/admin/shop-sales', authorize('admin'), async (_req, res) => {
  const rows = await Purchase.findAll({
    include: [
      { model: Farmer, as: 'farmer', include: [{ model: User, as: 'user' }] },
      { model: Product, as: 'product', include: [{ model: Shop, as: 'shop', include: [{ model: User, as: 'user' }] }] },
    ],
    order: [['purchase_date', 'DESC']],
  });
  const table = rows.map(r => ({
    shopName: r.product?.shop?.name || null,
    soldProduct: r.product?.name || null,
    soldToFarmerAadhar: r.farmer?.aadhar_number || null,
    quantity: Number(r.quantity || 0),
    date: r.purchase_date,
    totalAmount: Number(r.total_price || 0),
  }));
  res.json(table);
});

export default router;
