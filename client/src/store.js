if (process.env.NODE_ENV === "production") {
  module.exports = require("./store_prod");
} else {
  module.exports = require("./store_dev");
}
