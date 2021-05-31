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

app.post(usersRoute, async (req, res) => {
   if (!req.body.name || !req.body.bio) {
      res.status(400).send({
         errorMessage: "Please provide name and bio for the user.",
      });
      return;
   }

   const { id } = await db.insert({
      name: req.body.name,
      bio: req.body.bio,
   });
   const user = await db.findById(id);

   if (user) {
      res.status(201).send(user);
      return;
   }

   res.status(500).send({
      message: "Something went wrong while creating the new user.",
   });
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

app.get(`${usersRoute}/:id`, async (req, res) => {
   const { id } = req.params;
   const user = await db.findById(id);

   if (user) {
      res.send(user);
      return;
   }

   res.status(404).send({
      message: "The user with the specified ID does not exist.",
   });
});

app.listen(port, () => {
   console.log(`Server is running on port: ${port}`);
});
