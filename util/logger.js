/* eslint-disable no-console */

const log = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
};

const info = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
};

const warn = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
};

module.exports = {
  log,
  info,
  warn,
  error,
};
