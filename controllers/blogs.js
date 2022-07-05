const { Op } = require("sequelize");
const blogsRouter = require("express").Router();

const { Blog, User } = require("../models");

blogsRouter.get("/", async (req, res) => {
  const where = {};
  const { search } = req.query;

  if (search) {
    where[Op.or] = [
      { title: { [Op.substring]: search } },
      { author: { [Op.substring]: search } },
    ];
  }

  const blogs = await Blog.findAll({
    where,
    include: [{ model: User }],
    attributes: { exclude: ["userId"] },
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const { user } = req;
  const { author, title, url, likes, year } = req.body;

  if (!user) {
    return res
      .status(401)
      .json({ error: "You should login first to add a blog" });
  }

  const fields = {
    title,
    url,
    year,
    userId: user.id,
  };

  if (author) fields.author = author;
  if (likes) fields.likes = likes;

  const blog = await Blog.create(fields);
  res.json(blog);
});

blogsRouter.put("/:id", async (req, res) => {
  const likes = Number(req.body.likes);
  if (Number.isNaN(likes)) {
    return res
      .status(400)
      .json({ error: "You should provide number of likes" });
  }

  const blog = await Blog.findByPk(req.params.id);
  if (!blog) {
    return res
      .status(404)
      .json({ error: "Cannot find a blog with the given id" });
  }

  blog.likes = likes;
  const newBlog = await blog.save();
  res.json(newBlog);
});

blogsRouter.delete("/:id", async (req, res) => {
  const { user } = req;
  const { id } = req.params;

  if (!user) {
    return res
      .status(401)
      .json({ error: "You have to login first to delete the blog" });
  }

  const blog = await Blog.findByPk(id);

  if (blog && Number(blog.userId) === Number(user.id)) {
    await blog.destroy();
  }
  res.status(204).end();
});

module.exports = blogsRouter;
