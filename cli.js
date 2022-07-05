require("dotenv").config();
const { Sequelize, QueryTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const getBlogs = async () => {
  const QUERY = "SELECT * FROM blogs";
  const blogs = await sequelize.query(QUERY, { type: QueryTypes.SELECT });

  return blogs;
};

const main = async () => {
  const blogs = await getBlogs();
  blogs.forEach(({ author, title, likes }) => {
    // eslint-disable-next-line no-console
    console.log(`${author}: '${title}', ${likes} likes`);
  });
};

main();
