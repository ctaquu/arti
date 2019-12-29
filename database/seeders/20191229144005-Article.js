'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Articles', [
          {
              userId: 1,
              articleVersionId: 2,
              isPublished: true,
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              userId: 1,
              articleVersionId: 5,
              isPublished: false,
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              userId: 2,
              articleVersionId: 6,
              isPublished: true,
              createdAt: new Date(),
              updatedAt: new Date(),
          },
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Articles', null, {});
  }
};
