const { tb_user, tb_transaction, tb_order } = require("../../models");
const cloudinary = require("../utils/cloudinary");

exports.addTransaction = async (req, res) => {
  try {
    const { data } = req.body;

    // code here
    let newTransaction = await tb_transaction.create({
      ...data,
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      idUser: req.tb_user.id,
      totalPrice: req.body.totalPrice,
      status: "Waiting Approve",
    });

    await tb_order.update(
      {
        status: "process",
      },
      {
        where: {
          idUser: req.tb_user.id,
          status: "active",
        },
      }
    );

    res.send({
      status: "Success...",
      message: "Add Transaction Successfully",
      data: {
        newTransaction,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
    console.log(error);
  }
};

exports.getTransactions = async (req, res) => {
  try {
    let data = await tb_transaction.findAll({
      // include: [
      //   {
      //     model: tb_user,
      //     as: "user",
      //     attributes: {
      //       exclude: ["createdAt", "updatedAt", "password"],
      //     },
      //   },
      // ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    // data = JSON.parse(JSON.stringify(data));

    // data = data.map((item) => {
    //   return {
    //     ...item,
    //   };
    // });

    res.send({
      status: "Success on Getting Transactions",
      transactions: data,
    });
  } catch (error) {
    res.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    let data = await tb_transaction.findOne({
      where: {
        idUser: id,
      },
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

    data.attachment = process.env.FILE_PATH + data.attachment;

    res.send({
      status: "Success on Getting Transaction",
      transaction: data,
    });
  } catch (error) {
    res.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    await tb_transaction.update(req.body, {
      where: {
        id,
      },
    });

    res.send({
      status: "Success...",
      message: `Transaction with ID: ${id} updated`,
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.finishTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await tb_transaction.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    await tb_transaction.update(req.body, {
      where: {
        id,
      },
    });

    await tb_order.update(
      {
        status: "success",
      },
      {
        where: {
          idUser: transaction.idUser,
          status: "process",
        },
      }
    );

    res.send({
      status: "Success...",
      message: `Transaction with ID: ${id} success`,
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.cancelTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await tb_transaction.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    await tb_transaction.update(req.body, {
      where: {
        id,
      },
    });

    await tb_order.update(
      {
        status: "cancel",
      },
      {
        where: {
          idUser: transaction.idUser,
          status: "process",
        },
      }
    );

    res.send({
      status: "Success...",
      message: `Transaction with ID: ${id} canceled`,
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};
