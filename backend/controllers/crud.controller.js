import { User, Farmer, Shop } from '../models/models.js';

export function makeCrudController(Model) {
  return {
    async create(req, res) {
      try {
        const created = await Model.create(req.body);
        res.status(201).json(created);
      } catch (e) {
        res.status(400).json({ message: 'Create failed', error: e.message });
      }
    },
    async list(_req, res) {
      try {
        const items = await Model.findAll();
        res.json(items);
      } catch (e) {
        res.status(500).json({ message: 'List failed', error: e.message });
      }
    },
    async get(req, res) {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.json(item);
      } catch (e) {
        res.status(500).json({ message: 'Get failed', error: e.message });
      }
    },
    async update(req, res) {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        await item.update(req.body);
        res.json(item);
      } catch (e) {
        res.status(400).json({ message: 'Update failed', error: e.message });
      }
    },
    async remove(req, res) {
      const { Product, Purchase, Crop } = require('../models/models');
      const transaction = await Model.sequelize.transaction();
      
      try {
        const item = await Model.findByPk(req.params.id, { transaction });
        if (!item) {
          await transaction.rollback();
          console.log('User not found');
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent deleting the current user
        if (item.id == req.user?.id) {
          await transaction.rollback();
          console.log('Attempt to delete own account');
          return res.status(403).json({ 
            success: false,
            message: 'You cannot delete your own account' 
          });
        }

        // Log the deletion attempt
        console.log(`Attempting to delete user ${item.id} (${item.role})`);

        // Delete associated records based on role
        if (item.role === 'farmer') {
          console.log(`Deleting related records for farmer ${item.id}`);
          
          // Delete purchases made by this farmer
          await Purchase.destroy({
            where: { farmer_id: item.id },
            transaction
          });
          
          // Delete crops owned by this farmer
          await Crop.destroy({
            where: { farmer_id: item.id },
            transaction
          });
          
          // Delete the farmer record
          await Farmer.destroy({ 
            where: { user_id: item.id },
            transaction 
          });
          
        } else if (item.role === 'shop') {
          console.log(`Deleting related records for shop ${item.id}`);
          
          // First get all products of this shop
          const products = await Product.findAll({
            where: { shop_id: item.id },
            transaction
          });
          
          // Set product_id to NULL in purchases to preserve purchase history
          for (const product of products) {
            await Purchase.update(
              { product_id: null },
              { where: { product_id: product.id }, transaction }
            );
          }
          
          // Delete all products of this shop
          await Product.destroy({
            where: { shop_id: item.id },
            transaction
          });
          
          // Delete the shop record
          await Shop.destroy({ 
            where: { user_id: item.id },
            transaction 
          });
        }

        // Finally, delete the user
        await item.destroy({ transaction });
        await transaction.commit();
        
        console.log(`Successfully deleted user ${item.id}`);
        return res.json({ 
          success: true, 
          message: 'User and all related data deleted successfully' 
        });
        
      } catch (error) {
        if (transaction.finished !== 'commit') {
          await transaction.rollback();
        }
        console.error('Error in delete operation:', error);
        return res.status(500).json({ 
          success: false,
          message: 'Delete failed', 
          error: error.message,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
    },
  };
}




