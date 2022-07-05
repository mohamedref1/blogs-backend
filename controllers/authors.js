const { fn, col } = require("sequelize");
const authorsRouter = require("express").Router();

const { Blog } = require("../models");

authorsRouter.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    group: "author",
    attributes: [
      "author",
      [fn("count", col("*")), "articles"],
      [fn("sum", col("likes")), "likes"],
    ],
    order: [[fn("sum", col("likes")), "DESC"]],
  });
  res.json(blogs);
});

module.exports = authorsRouter;
