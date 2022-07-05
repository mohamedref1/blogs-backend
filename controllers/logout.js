const logoutRouter = require("express").Router();

const { Session } = require("../models");

logoutRouter.delete("/", async (req, res) => {
  const { user } = req;

  if (!user) {
    return res.status(204).end();
  }

  const session = await Session.findOne({
    where: {
      userId: user.id,
    },
  });

  if (session) {
    await session.destroy();
  }

  res.status(204).end();
});

module.exports = logoutRouter;
