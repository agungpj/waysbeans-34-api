const { tb_topping, tb_user } = require("../../models");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");

exports.addTopping = async (req, res) => {
  try {
    const toppingExist = await tb_topping.findOne({
      where: {
        title: req.body.title,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (toppingExist) {
      return res.status(400).send({
        status: "Failed",
        message: "Topping already registered",
      });
    }

    const { data } = req.body;

    // code here
    let newTopping = await tb_topping.create({
      ...data,
      title: req.body.title,
      price: req.body.price,
      image: req.file.filename,
      idUser: req.tb_user.id,
    });

    newTopping = JSON.parse(JSON.stringify(newTopping));

    newTopping = {
      ...newTopping,
      image: process.env.FILE_PATH + newTopping.image,
    };

    // code here
    res.send({
      status: "Success...",
      data: {
        newTopping,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getToppings = async (req, res) => {
  try {
    let data = await tb_topping.findAll({
      include: [
        {
          model: tb_user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        image: process.env.FILE_PATH + item.image,
      };
    });

    res.send({
      status: "Success on Getting Toppings",
      data: {
        toppings: data,
      },
    });
  } catch (error) {
    res.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.getTopping = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await tb_topping.findOne({
      where: {
        id,
      },
      include: [
        {
          model: tb_user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "email"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    // data[id].image = process.env.FILE_PATH + tb_product[id].image

    res.send({
      status: "Success...",
      message: `Showing Topping with id: ${id}`,
      data: {
        topping: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.updateTopping = async (req, res) => {
  try {
    const { id } = req.params;
    await tb_topping.update(req.body, {
      where: {
        id,
      },
    });

    res.send({
      status: "Success...",
      message: `Topping id: ${id} Updated`,
      data: {
        topping: id,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.deleteTopping = async (req, res) => {
  try {
    const { id } = req.params;

    const topping = await tb_topping.findOne({
      where: {
        id,
      },
      attributes: ["image"],
    });

    // Delete image file
    cloudinary.uploader.destroy(topping.image, function (result) {
      console.log(result);
    });

    await tb_topping.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "Success...",
      message: `Deleted Topping id: ${id}`,
      data: {
        id,
      },
    });
  } catch (error) {
    res.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};
