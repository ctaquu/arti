'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserToken = sequelize.define('UserToken', {
    token: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    expires: DataTypes.DATE
  }, {});
  UserToken.associate = function(models) {
    // associations can be defined here
    UserToken.belongsTo(models.User)
  };
  return UserToken;
};