const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const authHeader = req.header("Authorization")
  const token = authHeader && authHeader.split(' ')[1]
  // check if user send token via Authorization header or not
  if (!token) {
    return res.status(401).send({ message: "Access denied!" }); // rejected request and send response access denied
  }

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN); //verified token
    req.tb_user = verified;
    next()
  } catch (error) {
    // if token not valid, send response invalid token
    res.status(400).send({ message: "Invalid token" });
  }
};