"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const checklist_model_1 = require("../models/checklist.model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const migrateChecklists = async () => {
    try {
        // Подключаемся к базе данных
        await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/modern-web-app');
        console.log('Connected to MongoDB');
        // Получаем все чек-листы
        const checklists = await checklist_model_1.Checklist.find({});
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
    }
    catch (error) {
        console.error('Migration failed:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
    }
};
migrateChecklists();
