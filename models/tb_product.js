"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tb_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_product.belongsTo(models.tb_user, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });

      tb_product.hasMany(models.tb_order, {
        as: "order",
        foreignKey: {
          name: "idProduct",
        },
      });
    }
  }
  tb_product.init(
    {
      title: DataTypes.STRING,
      desc: DataTypes.STRING,
      price: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      image: DataTypes.STRING,
      idUser: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "tb_product",
    }
  );
  return tb_product;
};
