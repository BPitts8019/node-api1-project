// implement your API here
const express = require("express");
const db = require("./data/db");
const app = express();

//apply middleware
app.use(express.json());

/**
 * POST /api/users
 * Creates a user using the information sent inside the request body.
 * @returns {Object} The user that was created
 */
app.post("/api/users", async (req, res) => {
   if (!req.body.name || !req.body.bio) {
      return res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
   }

   try {
      const newId = await db.insert(req.body);
      const newUser = await db.findById(newId.id);
      
      res.status(200).json(newUser);
   } catch (err) {
      res.status(500).json({ errorMessage: "There was an error while saving the user to the database" });
   }
});

/**
 * GET /api/users
 * Returns an array of all the user objects contained in the database.
 * @returns {Array}
 */
app.get("/api/users", async (req, res) => {
   const users = await db.find();

   if (users) {
      res.status(200).json(users);
   } else {
      res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
   }
});

/**
 * GET /api/users/:id
 * Returns the user object with the specified id.
 * @param {number} id
 */
app.get("/api/users/:id", async (req, res) => {
   try {
      const user = await db.findById(Number(req.params.id));

      if (user) {
         res.status(200).json(user);
      } else {
         res.status(404).json({ message: "The user with the specified ID does not exist." });
      }
   } catch (err) {
      res.status(500).json({ errorMessage: "The user information could not be retrieved." });
   }
});

//Start server
const port = 8080;
const host = "127.0.0.1"; //another way to say "localhost"
app.listen(port, host, () => {
   console.log(`Server running at http://${host}:${port}`);
});