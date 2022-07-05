const jwt = require("jsonwebtoken");
const logger = require("./logger");
const { SECRET } = require("./config");
const { User, Session } = require("../models");

const requestLogger = (req, res, next) => {
  logger.info(`Method: ${req.method}`);
  logger.info(`path: ${req.path}`);
  logger.info(`body: ${JSON.stringify(req.body)}`);
  logger.info("---");
  next();
};

const userExtractor = async (req, res, next) => {
  const authorization = req.get("Authorization");

  if (authorization && authorization.startsWith("bearer")) {
    const token = authorization.substring(7);

    const decodedToken = jwt.verify(token, SECRET);
    const user = await User.findByPk(decodedToken.id);
    const session = await Session.findOne({
      where: {
        userId: user.id,
      },
    });

    if (session && session.token === token) {
      req.user = user;
    } else {
      return res.status(401).json({ error: "token expired" });
    }
  }

  next();
};

const errorHandler = (error, req, res, next) => {
  logger.error(`${error.name}:${error.message}`);
  switch (error.name) {
    case "SequelizeValidationError":
      return res.status(400).json({ error: error.message });
    case "SequelizeDatabaseError":
      return res.status(400).json({ error: error.message });
    case "SequelizeUniqueConstraintError":
      return res.status(400).json({ error: error.message });
    case "JsonWebTokenError":
      return res.status(400).json({ error: error.message });
    default:
      next(error);
  }
};

const unknownEndPoint = (req, res) => {
  res.status(404).json("not found");
};

module.exports = {
  requestLogger,
  userExtractor,
  errorHandler,
  unknownEndPoint,
};
