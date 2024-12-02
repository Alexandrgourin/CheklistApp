import { app } from './app';
import mongoose from 'mongoose';
import { config } from './config';

// Database connection
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
