import mongoose from 'mongoose';
import { Checklist } from '../models/checklist.model';
import dotenv from 'dotenv';

dotenv.config();

const migrateChecklists = async () => {
  try {
    // Подключаемся к базе данных
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/modern-web-app');
    console.log('Connected to MongoDB');

    // Получаем все чек-листы
    const checklists = await Checklist.find({});
    console.log(`Found ${checklists.length} checklists`);

    // Обновляем каждый чек-лист
    for (const checklist of checklists) {
      if (!checklist.id) {
        checklist.id = checklist._id.toString();
        await checklist.save();
        console.log(`Updated checklist ${checklist.id}`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

migrateChecklists();
