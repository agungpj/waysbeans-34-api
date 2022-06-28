const { tb_user, tb_profile } = require('../../models')

exports.addUsers = async (req, res) => {
    try {
        await tb_user.create(req.body);
    
        res.send({
            status: "success",
            message: "Add user finished",
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await tb_user.findAll({
            include: {
                model: tb_profile,
                as: "profile",
                attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
                },
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
            },
        });

        res.send({
            status: "success",
            data: {
                users,
            },
        });
    } catch (error) {
        console.log(error);
        res.send({
        status: "failed",
        message: "Server Error",
        });
    }
};

exports.getUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      const data = await tb_user.findOne({
        where: {
          id,
        },
        include: {
          model: tb_profile,
          as: "profile",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });
  
      res.send({
        status: "success",
        data: {
          user: data,
        },
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Server Error",
      });
    }
  };

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    await tb_user.update(req.body, {
      where: {
        id,
      },
    });

    await tb_profile.update(req.body, {
      where: {
        idUser: id,
      },
    });

    res.send({
      status: "Success...",
      message: `Update user ID: ${id} finished`,
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

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await tb_user.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Delete user id: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};