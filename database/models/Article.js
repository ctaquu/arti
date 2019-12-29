'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    user_id: DataTypes.STRING,
    is_published: DataTypes.BOOLEAN
  }, {});
  Article.associate = function(models) {
    // associations can be defined here
  };
  return Article;
};