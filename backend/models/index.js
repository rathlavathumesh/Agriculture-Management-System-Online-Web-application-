import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../agro.db',
  logging: false,
});

export default sequelize;

