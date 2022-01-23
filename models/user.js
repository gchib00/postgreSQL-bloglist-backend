const { Sequelize, DataTypes, Model } = require('sequelize')

class User extends Model {}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 }, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
})

User.sync()

module.exports = User