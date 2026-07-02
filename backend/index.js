import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

app.get('/', (req, res) => {
  res.send('MoonHaul Backend API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
