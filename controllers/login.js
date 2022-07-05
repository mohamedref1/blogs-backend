const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const { SECRET } = require("../util/config");

const { User, Session } = require("../models");

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!(username && password)) {
    return res
      .status(400)
      .json({ error: "Should provide both the username and password" });
  }

  const user = await User.findOne({
    where: {
      username,
    },
  });

  if (user.disabled) {
    return res
      .status(403)
      .json({ error: "The account is disabled. contact with the admin" });
  }

  const passwordCorrect = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!passwordCorrect) {
    return res
      .status(400)
      .json({ error: "The given username or password is invalid" });
  }

  const session = await Session.findOne({
    where: {
      userId: user.id,
    },
  });

  if (session) {
    return res.json({ token: session.token });
  }

  const userForToken = {
    id: user.id,
    username: user.username,
    name: user.name,
  };

  const token = jwt.sign(userForToken, SECRET);
  await Session.create({
    userId: user.id,
    token,
  });
  res.json({ token });
});

module.exports = loginRouter;
