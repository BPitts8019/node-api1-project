// implement your API here
const express = require("express");
const db = require("./data/db");

const app = express();
const port = 8080;

app.use(express.json());

app.get("/", (req, res) => {
   res.send({ message: "Welcome to the Node API-1 project" });
});

app.get("/api/users", async (req, res) => {
   const users = await db.find();
   res.send(users);
});

app.listen(port, () => {
   console.log(`Server is running on port: ${port}`);
});
