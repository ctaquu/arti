'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    userId: DataTypes.INTEGER,
    articleVersionId: DataTypes.INTEGER,
    isPublished: DataTypes.BOOLEAN,
  }, {});
  Article.associate = function(models) {
    Article.belongsTo(models.User);
    Article.hasMany(models.ArticleVersion, {
      foreignKey: 'articleId',
      as: 'AllArticleVersions',
      onDelete: 'CASCADE',
    });
    Article.belongsTo(models.ArticleVersion, {
      foreignKey: 'articleVersionId',
      as: 'CurrentArticleVersion',
      onDelete: 'CASCADE',
    });
  };
  return Article;
};