import dotenv from 'dotenv';
dotenv.config();
import { db, User, Farmer, Shop, Product, Purchase, Crop } from '../models/models.js';

async function clearAuthData() {
  const t = await db.sequelize.transaction();
  try {
    // 1) Find target users by role
    const targetRoles = ['admin', 'farmer', 'shop'];
    const users = await User.findAll({ where: { role: targetRoles }, transaction: t });
    const userIds = users.map(u => u.id);

    // If nothing to delete, exit early
    if (userIds.length === 0) {
      await t.commit();
      console.log('No users with roles admin/farmer/shop found. Nothing to delete.');
      return;
    }

    // 2) Farmers and related entities
    const farmers = await Farmer.findAll({ where: { user_id: userIds }, transaction: t });
    const farmerIds = farmers.map(f => f.id);

    if (farmerIds.length > 0) {
      // Delete dependent: purchases, crops
      await Purchase.destroy({ where: { farmer_id: farmerIds }, transaction: t });
      await Crop.destroy({ where: { farmer_id: farmerIds }, transaction: t });
      // Delete farmers
      await Farmer.destroy({ where: { id: farmerIds }, transaction: t });
    }

    // 3) Shops and related entities
    const shops = await Shop.findAll({ where: { user_id: userIds }, transaction: t });
    const shopIds = shops.map(s => s.id);

    if (shopIds.length > 0) {
      // Delete dependent: products (and any purchases linked to those products to be safe)
      const products = await Product.findAll({ where: { shop_id: shopIds }, transaction: t });
      const productIds = products.map(p => p.id);
      if (productIds.length > 0) {
        await Purchase.destroy({ where: { product_id: productIds }, transaction: t });
        await Product.destroy({ where: { id: productIds }, transaction: t });
      }
      // Delete shops
      await Shop.destroy({ where: { id: shopIds }, transaction: t });
    }

    // 4) Finally, delete users with the target roles
    await User.destroy({ where: { role: targetRoles }, transaction: t });

    await t.commit();
    console.log('Successfully cleared admin/farmer/shop users and related data.');
  } catch (err) {
    await t.rollback();
    console.error('Failed to clear data:', err?.message || err);
    process.exitCode = 1;
  }
}

clearAuthData().catch((e) => { console.error(e); process.exitCode = 1; });
