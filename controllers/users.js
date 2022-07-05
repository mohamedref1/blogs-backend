const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();

const { User, Blog } = require("../models");

usersRouter.get("/", async (req, res) => {
  const users = await User.findAll({
    include: [{ model: Blog, attributes: { exclude: ["userId"] } }],
  });
  res.json(users);
});

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  if (!(username && name && password)) {
    return res
      .status(400)
      .json({ error: "should provide username, name and password" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const fields = {
    username,
    name,
    passwordHash,
  };

  const user = await User.create(fields);
  res.json(user);
});

usersRouter.put("/:username", async (req, res) => {
  const { username } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Should provide a valid name" });
  }

  const user = await User.findOne({
    where: {
      username,
    },
  });

  if (!user) {
    return res
      .status(404)
      .json({ error: "Couldn't find a user with the given username" });
  }

  user.name = name;
  const updatedUser = await user.save();
  res.json(updatedUser);
});

usersRouter.get("/:id", async (req, res) => {
  const where = {};
  const { read } = req.query;
  const { id } = req.params;

  if (read) where.read = read;

  const users = await User.findByPk(id, {
    include: [
      { model: Blog, attributes: { exclude: ["userId"] } },
      {
        model: Blog,
        as: "readings",
        through: {
          where,
          attributes: ["id", "read"],
        },
      },
    ],
  });
  res.json(users);
});

module.exports = usersRouter;
