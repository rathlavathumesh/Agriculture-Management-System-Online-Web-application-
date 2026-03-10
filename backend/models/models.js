import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(200), allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'farmer', 'shop'), allowNull: false },
  otp: { type: DataTypes.STRING, allowNull: true },
  otp_expires_at: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'users', timestamps: true });

export const Farmer = sequelize.define('Farmer', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  aadhar_number: { type: DataTypes.STRING(12), allowNull: false, unique: true },
  phone: { type: DataTypes.STRING(15), allowNull: false },
  address: { type: DataTypes.STRING(255), allowNull: true },
}, { tableName: 'farmers', timestamps: true });

export const Shop = sequelize.define('Shop', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  name: { type: DataTypes.STRING(150), allowNull: false },
  location: { type: DataTypes.STRING(200), allowNull: true },
}, { tableName: 'shops', timestamps: true });

export const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  shop_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  category: { type: DataTypes.STRING(50), allowNull: false },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  stock_quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
}, { tableName: 'products', timestamps: true });

export const Purchase = sequelize.define('Purchase', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  farmer_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  product_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  shop_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  product_name: { type: DataTypes.STRING(200), allowNull: true },
  product_price: { type: DataTypes.DECIMAL(10,2), allowNull: true },
  quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  total_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  purchase_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { tableName: 'purchases', timestamps: true });

export const Crop = sequelize.define('Crop', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  farmer_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  crop_name: { type: DataTypes.STRING(150), allowNull: false },
  planting_date: { type: DataTypes.DATE, allowNull: true },
  harvest_date: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'crops', timestamps: true });


// Associations
User.hasOne(Farmer, { foreignKey: 'user_id', as: 'farmer', onDelete: 'CASCADE' });
Farmer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(Shop, { foreignKey: 'user_id', as: 'shop', onDelete: 'CASCADE' });
Shop.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Shop.hasMany(Product, { foreignKey: 'shop_id', as: 'products', onDelete: 'CASCADE' });
Product.belongsTo(Shop, { foreignKey: 'shop_id', as: 'shop' });

Farmer.hasMany(Purchase, { foreignKey: 'farmer_id', as: 'purchases', onDelete: 'CASCADE' });
Purchase.belongsTo(Farmer, { foreignKey: 'farmer_id', as: 'farmer' });

Product.hasMany(Purchase, { foreignKey: 'product_id', as: 'purchases', onDelete: 'SET NULL' });
Purchase.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

Farmer.hasMany(Crop, { foreignKey: 'farmer_id', as: 'crops', onDelete: 'CASCADE' });
Crop.belongsTo(Farmer, { foreignKey: 'farmer_id', as: 'farmer' });

export const db = { sequelize, User, Farmer, Shop, Product, Purchase, Crop };




