'use strict';
module.exports = (sequelize, DataTypes) => {
  const ArticleVersion = sequelize.define('ArticleVersion', {
    articleId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {});
  ArticleVersion.associate = function(models) {
    ArticleVersion.belongsTo(models.Article)
  };
  return ArticleVersion;
};