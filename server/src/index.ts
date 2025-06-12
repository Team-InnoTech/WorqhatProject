import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import goalRoutes from './routes/goalRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/goals', goalRoutes);

app.get('/', (req, res) => {
  res.send('Learning Tracker API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
