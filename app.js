require("express-async-errors");
const express = require("express");
const { connectToDatabase } = require("./util/db");
const middleware = require("./util/middleware");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const authorsRouter = require("./controllers/authors");
const readingListsRouter = require("./controllers/readingLists");
const loginRouter = require("./controllers/login");
const logoutRouter = require("./controllers/logout");

connectToDatabase();

const app = express();

app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.userExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/readingLists", readingListsRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);

app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;
