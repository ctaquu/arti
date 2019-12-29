module.exports = {
  development: {
    dialect: "sqlite",
    storage: `${__dirname}/../arti.database.dev.sqlite3`
  },
  test: {
    dialect: "sqlite",
    storage: `${__dirname}/../arti.database.test.sqlite3`
  },
}