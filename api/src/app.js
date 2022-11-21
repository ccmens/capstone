const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./config");
const bodyParser = require("body-parser");

const path = require('path');
const rootPath = path.dirname(path.dirname(require.main.filename));

const mongoose = require('mongoose');
// connect to the database
mongoose.connect(config.database_url, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(`connection error: ${error}`));
db.once("open", () =>
  console.log(`Connected to MongoDB: ${config.database_url}`)
);

app.use(bodyParser.json({ limit: "50mb" }));
app.set(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// corss origin domain
app.use(cors());

app.get(`${config.prefix}/test`, async (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get('/public/static/*', function (req, res) {
    res.sendFile(rootPath + "/" + req.url);
})

app.get('/public/upload/*', function (req, res) {
    res.sendFile(rootPath + "/" + req.url);
})

const authMiddle = require("./middlewares/auth.middle");
app.use(authMiddle.checkToken);

const userRouter = require("./routes/user.route");
const itemRouter = require("./routes/item.route");
const roleRouter = require("./routes/role.route");
const categoryRouter = require("./routes/category.route");
const salesRouter = require("./routes/sales.route");

app.use(config.prefix, userRouter);
app.use(config.prefix, itemRouter);
app.use(config.prefix, roleRouter);
app.use(config.prefix, categoryRouter);
app.use(config.prefix, salesRouter);
// init role
const roleModel = require("./models/role.model");
const { table } = require("console");

async function initRole() {
  const role = await roleModel.findOne({ name: "admin" });
  if (!role) {
    new roleModel({
      role_name: "user",
    }).save();

    adminRole = new roleModel({
      role_name: "admin",
    }).save();
  }
}

initRole();

app.listen(config.server_port, config.server_host, () => {
  console.log("Server Started, The port is " + config.server_port);
});

