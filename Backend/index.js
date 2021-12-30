//CORE
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
//CUSTOM
const { validateToken } = require("./Middleware/Authentication/index.ts");
// ROUTERS
const authRouter = require("./Routers/auth");
const postsRouter = require("./Routers/posts");

app.use(bodyParser.json());
app.use(cors());
app.use("/auth", authRouter);
app.use("/posts", validateToken, postsRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
