import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Strategy from '../models/strategy.model.js';
import { strategyTemplates } from '../templates/strategyTemplates.js';
import { DB_NAME } from '../constants.js';

// Load environment variables
dotenv.config({ path: '../.env' });

const seedTemplates = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log('Connected to MongoDB');

    // Clear existing templates
    await Strategy.deleteMany({ isTemplate: true });
    console.log('Cleared existing templates');

    // Add userId field to templates (using a system user ID)
    const systemUserId = new mongoose.Types.ObjectId();
    const templatesWithUserId = strategyTemplates.map(template => ({
      ...template,
      userId: systemUserId,
      isTemplate: true
    }));

    // Insert templates
    const insertedTemplates = await Strategy.insertMany(templatesWithUserId);
    console.log(`Successfully seeded ${insertedTemplates.length} templates`);

    // List the seeded templates
    insertedTemplates.forEach(template => {
      console.log(`- ${template.name} (${template.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding templates:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedTemplates();
