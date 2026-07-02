import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('MoonHaul Backend API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
