const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const productRoutes = require('./routes/product');

app.use(cors());
app.use(express.json());

// Mount the product routes
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));