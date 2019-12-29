'use strict';

function hashString(string) {
    const bcrypt = require('bcrypt');
    return bcrypt.hashSync(string, 10);
}

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
      'Users',
      [
        {
            name: 'Damjan Veljkovic',
            email: 'damjan.veljkovic@gmail.com',
            password: hashString('testtest'),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'Some Author',
            email: 'some@author.com',
            password: hashString('testtest'),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
      ],
      {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}),
};

