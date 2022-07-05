const { Sequelize } = require("sequelize");
const { Umzug, SequelizeStorage } = require("umzug");
const { DATABASE_URL } = require("./config");
const logger = require("./logger");

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const migrationConf = {
  migrations: {
    glob: "migrations/*.js",
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.getQueryInterface(),
  logger,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);

  const migrations = await migrator.up();
  logger.info("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

const rollbackMigration = async () => {
  try {
    await sequelize.authenticate();
    const migrator = new Umzug(migrationConf);
    await migrator.down();
    logger.info("Migrator downs the last migration successfully");
  } catch (error) {
    logger.info("Migrator failed to down the last migration");
    logger.info(error.message);
  }
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    logger.info("Connected to the database");
  } catch (error) {
    logger.error("Failed to connect to database");
    logger.error(error.message);
    return process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectToDatabase,
  rollbackMigration,
};
