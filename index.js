const http = require("http");
const { PORT } = require("./util/config");
const logger = require("./util/logger");
const app = require("./app");

const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server listening on port ${PORT}`);
});
