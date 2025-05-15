const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all products
router.get('/', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT p.*, COALESCE(i.imageURL, '/images/no_image.jpg') AS imageURL
        FROM Products p
        LEFT JOIN ImageMaster i ON p.imageID = i.imageID
      `);
      res.json(rows);
    } catch (error) {
      console.error('Error in GET /api/products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });
  
// POST add product
router.post('/', async (req, res) => {
  const { name, price, description, imageURL } = req.body;
  if (!name || !price || !description) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    await db.query(
      'INSERT INTO Products (productName, price, description, imageURL) VALUES (?, ?, ?, ?)',
      [name, price, description, imageURL]
    );
    res.status(201).json({ message: 'Product added' });
  } catch (error) {
    res.status(500).json({ error: 'Insert failed' });
  }
});

// PUT edit product
router.put('/:id', async (req, res) => {
  const { name, price, description, imageURL } = req.body;
  const { id } = req.params;
  try {
    await db.query(
      'UPDATE Products SET productName = ?, price = ?, description = ?, imageURL = ? WHERE productID = ?',
      [name, price, description, imageURL, id]
    );
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Products WHERE productID = ?', [id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;