const readingListsRouter = require("express").Router();

const { Reading, Blog } = require("../models");

// readingLists.get("/", async (req, res) => {});

readingListsRouter.post("/", async (req, res) => {
  const { user } = req;
  const { blogId } = req.body;

  if (!user) {
    return res.status(400).json({ error: "Login first to add a reading list" });
  }

  if (!blogId) {
    return res.status(400).json({ error: "Should provide the blogId" });
  }

  const blog = await Blog.findByPk(blogId);
  if (!blog) {
    return res
      .status(404)
      .json({ error: "Couldn't find a blog with the given id" });
  }

  const reading = await Reading.create({
    userId: user.id,
    blogId,
  });

  res.json({ reading });
});

readingListsRouter.put("/:id", async (req, res) => {
  const { user } = req;
  const { id } = req.params;

  if (!user) {
    res
      .status(401)
      .json({ error: "You should login first to read a reading list" });
  }

  const reading = await Reading.findByPk(id);

  if (!reading) {
    res
      .status(404)
      .json({ error: "Couldn't find a reading list with the given id" });
  }

  if (reading.userId !== user.id) {
    res.status(403).json({ error: "You can only read your own reading list" });
  }

  reading.read = true;
  const newReading = await reading.save();
  res.json(newReading);
});

module.exports = readingListsRouter;
