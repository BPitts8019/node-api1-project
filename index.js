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

   try {
      const { id } = await db.insert({
         name: req.body.name,
         bio: req.body.bio,
      });
      const user = await db.findById(id);
      res.status(201).send(user);
   } catch (error) {
      res.status(500).send({
         message: "Something went wrong while creating the new user.",
      });
   }
});

app.get(usersRoute, async (req, res) => {
   try {
      const users = await db.find();
      res.send(users);
   } catch (error) {
      res.status(500).send({
         errorMessage: "The users information could not be retrieved.",
      });
   }
});

app.get(`${usersRoute}/:id`, async (req, res) => {
   const { id } = req.params;

   try {
      const user = await db.findById(id);

      if (user) {
         res.send(user);
         return;
      }

      res.status(404).send({
         message: "The user with the specified ID does not exist.",
      });
   } catch (error) {
      res.status(500).send({
         message: "The user information could not be retrieved.",
      });
   }
});

app.put(`${usersRoute}/:id`, async (req, res) => {
   if (!req.body.name || !req.body.bio) {
      res.status(400).send({
         errorMessage: "Please provide name and bio for the user.",
      });
      return;
   }

   const { id } = req.params;
   try {
      const user = await db.findById(id);
      if (!user) {
         res.status(404).send({
            message: "The user with the specified ID does not exist.",
         });
         return;
      }

      const numRecs = await db.update(id, {
         name: req.body.name,
         bio: req.body.bio,
      });
      if (numRecs <= 0) {
         res.status(500).send({
            errorMessage: "The user information could not be modified.",
         });
         return;
      }

      const updatedUser = await db.findById(id);
      res.send(updatedUser);
   } catch (error) {
      res.status(500).send({
         errorMessage: "The user information could not be modified.",
      });
   }
});

app.delete(`${usersRoute}/:id`, async (req, res) => {
   const { id } = req.params;

   try {
      const user = await db.findById(id);

      if (user) {
         await db.remove(id);
         res.send(user);
         return;
      }

      res.status(404).send({
         message: "The user with the specified ID does not exist.",
      });
   } catch (error) {
      res.status(500).send({ errorMessage: "The user could not be removed." });
   }
});

app.listen(port, () => {
   console.log(`Server is running on port: ${port}`);
});
