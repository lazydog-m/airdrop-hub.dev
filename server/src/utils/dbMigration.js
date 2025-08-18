require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../configs/dbConnection');

const migration = async (aciton) => {
  try {
    const models = {};
    const modelsDir = path.join(__dirname, '../models');

    fs.readdirSync(modelsDir)
      .filter(file => file.endsWith('.js'))
      .forEach(file => {
        const model = require(path.join(modelsDir, file));
        models[model.name] = model;
      });

    switch (aciton) {
      case 'none':
        await db.authenticate();
        break;

      case 'create':
        console.log('Creating new schemas...');
        await db.sync();
        console.log('Schemas created successfully!');
        break;

      case 'update':
        console.log('Updating schemas...');
        for (const modelName in models) {
          await models[modelName].sync({ alter: true });
          console.log(`Table ${modelName} updated successfully!`);
        }
        console.log('Schemas updated successfully!');
        break;

      default:
        await db.authenticate();
        console.log('No database action!');
    }
  } catch (error) {
    console.error('Error database:', error);
  }
}

module.exports = migration;
