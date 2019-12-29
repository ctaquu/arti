'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('ArticleDrafts', [
          {
              userId: 1,
              title: 'All Around The Infinity',
              description: 'The accompanying spoken blessing, "live long and prosper" – "dif-tor heh smusma" in the Vulcan language (as spoken in Star Trek: The Motion Picture) – also appeared for the first time in "Amok Time", scripted by Theodore Sturgeon.',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              userId: 2,
              title: 'Your Hybrid told me something.',
              description: `In the fictional world of Battlestar Galactica, you kind of have to be a bit of a badass if you have any hopes of surviving. Especially if you're human. The series as a whole revolves around a war between the human inhabitants of the twelve colonies of Kobol and the cylon robots that they created, but the war seems like it's nearly finished the moment it starts. The Cylons return to Kobol and destroy all of the colonies, only leaving a few thousand humans left alive.`,
              createdAt: new Date(),
              updatedAt: new Date(),
          },
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('ArticleDrafts', null, {});
  }
};
