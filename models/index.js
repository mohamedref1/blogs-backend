const Blog = require("./blog");
const User = require("./user");
const Reading = require("./reading");
const Session = require("./session");

User.hasMany(Blog);
Blog.belongsTo(User);

Blog.belongsToMany(User, { through: Reading, as: "readings" });
User.belongsToMany(Blog, { through: Reading, as: "readings" });

User.hasOne(Session);
Session.belongsTo(User);

module.exports = {
  Blog,
  User,
  Reading,
  Session,
};
