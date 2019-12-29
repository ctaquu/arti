'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('ArticleVersions', [
          {
              articleId: 1,
              title: 'Me first article!!',
              description: 'An article is a word used to modify a noun, which is a person, place, object, or idea. Technically, an article is an adjective, which is any word that modifies a noun. Usually adjectives modify nouns through description, but articles are used instead to point out or refer to nouns.',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              articleId: 1,
              title: 'Me first article!!',
              description: 'An EDITED article is a word used to modify a noun, which is a person, place, object, or idea. Technically, an article is an adjective, which is any word that modifies a noun. Usually adjectives modify nouns through description, but articles are used instead to point out or refer to nouns.',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              articleId: 1,
              title: 'Me first article 666!!',
              description: 'An EDITED article is a word used to modify a noun, which is a person, place, object, or idea. Technically, an article is an adjective, which is any word that modifies a noun. Usually adjectives modify nouns through description, but articles are used instead to point out or refer to nouns.',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              articleId: 2,
              title: 'Second son of a second son...',
              description: 'Here they stand brothers them all All the sons divided they\'d fall Here await the birth of the son The seventh, the heavenly, the chosen one Here the birth from an unbroken line Born the healer the seventh, his tim Unknowingly blessed and as his life unfolds Slowly unveiling the power he holds Seventh son of a seventh son Seventh son of a seventh son Seventh son of a seventh son',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              articleId: 2,
              title: 'Second son of a second son... changed',
              description: 'Here they stand brothers them all All the sons divided they\'d fall Here await the birth of the son The seventh, the heavenly, the chosen one Here the birth from an unbroken line Born the healer the seventh, his tim Unknowingly blessed and as his life unfolds Slowly unveiling the power he holds Seventh son of a seventh son Seventh son of a seventh son Seventh son of a seventh son',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              articleId: 3,
              title: 'There can be only one (or Three)',
              description: 'Highlander is a 1986 fantasy action-adventure film directed by Russell Mulcahy and based on ... and television spin-offs. Its tagline, "There can be only one", has carried on, as have the songs provided for the film by the rock band Queen.',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('ArticleVersions', null, {});
  }
};
