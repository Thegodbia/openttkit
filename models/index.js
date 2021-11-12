'use strict';
// Include Sequelize module 
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

// Creating new Object of Sequelize 
const trade = new Sequelize(process.env.DTT_DB_NAME, null, null, {
    dialect: 'mysql',
    logging: false,
    replication: {
      read: [
        { host: process.env.DTT_DB_HOST, port: 3306, username: process.env.DTT_DB_USERNAME }
      ],
      write: { host: process.env.DTT_DB_HOST, port: 3306, username: process.env.DTT_DB_USERNAME}
    }
});

const ydDb = new Sequelize(process.env.YDNG_DATABASE_NAME, null, null, {
  dialect: 'mariadb',
  logging: false,
  replication: {
    read: [
      { host: process.env.YDNG_DATABASE_HOST, port: 3317, username: process.env.YDNG_DATABASE_USERNAME, password: process.env.YDNG_DATABASE_PASSWORD },
      { host: process.env.YDNG_DATABASE_HOST, port: 3318, username: process.env.YDNG_DATABASE_USERNAME, password: process.env.YDNG_DATABASE_PASSWORD },
      { host: process.env.YDNG_DATABASE_HOST, port: 3319, username: process.env.YDNG_DATABASE_USERNAME, password: process.env.YDNG_DATABASE_PASSWORD },
      { host: process.env.YDNG_DATABASE_HOST, port: 3315, username: process.env.YDNG_DATABASE_USERNAME, password: process.env.YDNG_DATABASE_PASSWORD }
    ],
    write: { host: process.env.YDNG_DATABASE_HOST, port: 3316, username: process.env.YDNG_DATABASE_USERNAME, password: process.env.YDNG_DATABASE_PASSWORD }
  },
  dialectOptions: {
    // Your mysql2 options here
    connectTimeout: 2000
    },
   pool: {
     idle: 200000,
     acquire: 600000,
     handleDisconnects: true
    }
});

 /**fs
    .readdirSync(__dirname)
    .filter((file) =>
        file !== 'index.js'
    )

    .forEach((file) => {

        //const model = sequelize.import(path.join(__dirname, file))

        const model = require(path.join(__dirname, file))(trackingDb, Sequelize.DataTypes);
        trackingDb[model.name] = model

        
    })
    Object.keys(trackingDb).forEach(modelName => {
        if (trackingDb[modelName].associate) {
          trackingDb[modelName].associate(trackingDb);
        }
    });*/


// Exporting the sequelize object.  
// We can use it in another file 
// for creating models 
module.exports = {trade, ydDb}