const movieRoutes = require("./movies");
//const app =express();

const constructorMethod = (app) => {
  app.use("/api", movieRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};


module.exports = constructorMethod;