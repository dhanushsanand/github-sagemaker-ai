import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import repoRoutes from './routes/repoRoutes.js';

export let dbConnected = false;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many requests, please slow down.' },
}));

app.use('/api', repoRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  if (process.env.MONGO_URI) {
    try {
      mongoose.set('bufferCommands', false);
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      dbConnected = true;
      console.log('MongoDB connected');
    } catch (err) {
      console.warn('MongoDB not available, running without persistence:', err.message);
    }
  } else {
    console.warn('No MONGO_URI set, running without persistence');
  }
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();