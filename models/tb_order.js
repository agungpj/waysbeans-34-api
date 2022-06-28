'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_order.belongsTo(models.tb_user, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });
      
      tb_order.belongsTo(models.tb_product, {
        as: "product",
        foreignKey: {
          name: "idProduct",
        },
      });
      
      tb_order.belongsTo(models.tb_topping, {
        as: "topping",
        foreignKey: {
          name: "idTopping",
        },
      });
    }
  }
  tb_order.init({
    idUser: DataTypes.INTEGER,
    idProduct: DataTypes.INTEGER,
    idTopping: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'tb_order',
  });
  return tb_order;
};