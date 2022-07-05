const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("blogs", "year", {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1991,
        isExceedsMax(value) {
          const currentYear = new Date().getFullYear();
          if (value > currentYear) {
            throw new Error(
              `year field should be in range 1991 and ${currentYear}`
            );
          }
        },
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("blogs", "year");
  },
};
