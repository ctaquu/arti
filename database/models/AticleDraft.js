'use strict';
module.exports = (sequelize, DataTypes) => {
  const ArticleDraft = sequelize.define('ArticleDraft', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {});
  ArticleDraft.associate = function(models) {
    ArticleDraft.belongsTo(models.User)
  };
  return ArticleDraft;
};