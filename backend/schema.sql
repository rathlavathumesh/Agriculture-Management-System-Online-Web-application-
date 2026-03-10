-- Enable FK constraints
PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

-- ===== Cleanup for idempotent runs =====
DROP VIEW IF EXISTS purchase_history;
DROP VIEW IF EXISTS shop_inventory;
DROP VIEW IF EXISTS farmer_crops;

DROP TRIGGER IF EXISTS users_set_updatedAt;
DROP TRIGGER IF EXISTS farmers_set_updatedAt;
DROP TRIGGER IF EXISTS shops_set_updatedAt;
DROP TRIGGER IF EXISTS products_set_updatedAt;
DROP TRIGGER IF EXISTS purchases_set_updatedAt;
DROP TRIGGER IF EXISTS crops_set_updatedAt;

DROP TRIGGER IF EXISTS validate_stock_before_purchase;
DROP TRIGGER IF EXISTS update_stock_after_purchase;

DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS crops;
DROP TABLE IF EXISTS shops;
DROP TABLE IF EXISTS farmers;
DROP TABLE IF EXISTS users;

-- ===== Tables =====

-- users
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','farmer','shop')),
  otp TEXT,
  otp_expires_at DATETIME,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- farmers (User.hasOne(Farmer) ON DELETE CASCADE)
CREATE TABLE farmers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  aadhar_number TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- shops (User.hasOne(Shop) ON DELETE CASCADE)
CREATE TABLE shops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  location TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- products (belongs to Shop)
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shop_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE NO ACTION
);

-- purchases (farmer required; product, shop optional; also supports denormalized name/price)
CREATE TABLE purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  farmer_id INTEGER NOT NULL,
  product_id INTEGER,
  shop_id INTEGER,
  product_name TEXT,
  product_price NUMERIC(10,2),
  quantity INTEGER NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  purchase_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE SET NULL
);

-- crops (belongs to Farmer)
CREATE TABLE crops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  farmer_id INTEGER NOT NULL,
  crop_name TEXT NOT NULL,
  planting_date DATETIME,
  harvest_date DATETIME,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
);

-- ===== Indexes =====
CREATE INDEX IF NOT EXISTS idx_farmers_user_id    ON farmers(user_id);
CREATE INDEX IF NOT EXISTS idx_shops_user_id      ON shops(user_id);
CREATE INDEX IF NOT EXISTS idx_products_shop_id   ON products(shop_id);
CREATE INDEX IF NOT EXISTS idx_purchases_farmer   ON purchases(farmer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_product  ON purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_purchases_shop     ON purchases(shop_id);
CREATE INDEX IF NOT EXISTS idx_crops_farmer       ON crops(farmer_id);

-- ===== Views (Joins) =====

-- Purchase history including farmer, user, product and shop info.
-- Uses COALESCE to show denormalized purchase fields when product/shop are null.
CREATE VIEW purchase_history AS
SELECT
  p.id                                   AS purchase_id,
  p.purchase_date,
  p.quantity,
  p.total_price,
  f.id                                   AS farmer_id,
  u.name                                 AS farmer_name,
  COALESCE(p.product_id, pr.id)          AS product_id,
  COALESCE(p.product_name, pr.name)      AS product_name,
  COALESCE(p.product_price, pr.price)    AS product_price,
  COALESCE(p.shop_id, pr.shop_id)        AS shop_id,
  s.name                                 AS shop_name
FROM purchases p
JOIN farmers   f  ON p.farmer_id = f.id
JOIN users     u  ON f.user_id   = u.id
LEFT JOIN products pr ON p.product_id = pr.id
LEFT JOIN shops    s  ON COALESCE(p.shop_id, pr.shop_id) = s.id;

-- Shop inventory with latest product snapshot
CREATE VIEW shop_inventory AS
SELECT
  s.id           AS shop_id,
  s.name         AS shop_name,
  p.id           AS product_id,
  p.name         AS product_name,
  p.category,
  p.price,
  p.stock_quantity,
  p.updatedAt    AS last_updated
FROM shops s
JOIN products p ON p.shop_id = s.id
ORDER BY s.name, p.category, p.name;

-- Farmer crops with user details
CREATE VIEW farmer_crops AS
SELECT
  f.id           AS farmer_id,
  u.name         AS farmer_name,
  c.id           AS crop_id,
  c.crop_name,
  c.planting_date,
  c.harvest_date,
  c.createdAt    AS crop_added_date
FROM farmers f
JOIN users   u ON f.user_id   = u.id
JOIN crops   c ON c.farmer_id = f.id
ORDER BY f.id, c.planting_date DESC;

-- ===== Triggers =====

-- Keep updatedAt current on UPDATE
CREATE TRIGGER users_set_updatedAt
AFTER UPDATE ON users
BEGIN
  UPDATE users SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER farmers_set_updatedAt
AFTER UPDATE ON farmers
BEGIN
  UPDATE farmers SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER shops_set_updatedAt
AFTER UPDATE ON shops
BEGIN
  UPDATE shops SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER products_set_updatedAt
AFTER UPDATE ON products
BEGIN
  UPDATE products SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER purchases_set_updatedAt
AFTER UPDATE ON purchases
BEGIN
  UPDATE purchases SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER crops_set_updatedAt
AFTER UPDATE ON crops
BEGIN
  UPDATE crops SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Validate stock before recording a purchase with a concrete product
CREATE TRIGGER validate_stock_before_purchase
BEFORE INSERT ON purchases
WHEN NEW.product_id IS NOT NULL
BEGIN
  SELECT
    CASE
      WHEN (SELECT stock_quantity FROM products WHERE id = NEW.product_id) < NEW.quantity
      THEN RAISE(ABORT, 'Insufficient stock for product')
    END;
END;

-- Decrement stock after a purchase with a concrete product
CREATE TRIGGER update_stock_after_purchase
AFTER INSERT ON purchases
WHEN NEW.product_id IS NOT NULL
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - NEW.quantity,
      updatedAt      = CURRENT_TIMESTAMP
  WHERE id = NEW.product_id;
END;

COMMIT;
