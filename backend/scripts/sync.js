import dotenv from 'dotenv';
dotenv.config();
import { db } from '../models/models.js';

async function main() {
  const mode = (process.env.DB_SYNC || 'alter').toLowerCase();
  try {
    // Remove legacy tables no longer in models
    try {
      await db.sequelize.query('DROP TABLE IF EXISTS reports');
      console.log('Dropped legacy table: reports');
    } catch (e) {
      console.warn('Skipping drop of legacy table reports:', e?.message);
    }
    if (mode === 'force') {
      console.warn('WARNING: Running destructive sync with { force: true }');
      await db.sequelize.sync({ force: true });
    } else if (mode === 'safe' || mode === 'none') {
      await db.sequelize.sync();
    } else {
      await db.sequelize.sync({ alter: true });
    }
    console.log(`Database synchronized (mode: ${mode})`);
    process.exit(0);
  } catch (e) {
    console.error('Database sync failed:', e?.message);
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });




