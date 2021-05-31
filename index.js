// implement your API here
const express = require("express");
const db = require("./data/db");

const app = express();
const port = 8080;
const usersRoute = "/api/users";

app.use(express.json());

app.get("/", (req, res) => {
   res.send({ message: "Welcome to the Node API-1 project" });
});

app.get(usersRoute, async (req, res) => {
   const users = await db.find();

   if (users) {
      res.send(users);
      return;
   }

   res.status(500).send({
      errorMessage: "The users information could not be retrieved.",
   });
});

app.listen(port, () => {
   console.log(`Server is running on port: ${port}`);
});
