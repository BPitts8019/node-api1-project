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

/**
 * DELETE /api/users/:id
 * Removes the user with the specified id and returns the deleted user.
 * @param {number} id
 * @returns {Object} oldUser
 */
app.delete("/api/users/:id", async (req, res) => {
   try {
      const oldUser = await db.findById(Number(req.params.id));
      if (!oldUser) {
         return res.status(404).json({ message: "The user with the specified ID does not exist." });
      }

      const result = await db.remove(oldUser.id);
      res.status(200).json(oldUser);
   } catch (err) {
      console.log(err);
      res.status(500).json({ errorMessage: "The user could not be removed" });
   }
});

/**
 * PUT /api/users/:id
 * Updates the user with the specified id using data from the request body. 
 * Returns the modified document, NOT the original.
 * @param {number} id
 * @returns {Object} updatedUser
 */
app.put("/api/users/:id", (req, res) => {
   /*
   If the user with the specified id is not found:
      respond with HTTP status code 404 (Not Found).
      return the following JSON object: { message: "The user with the specified 
      ID does not exist." }.
      
   If the request body is missing the name or bio property:
      respond with HTTP status code 400 (Bad Request).
      return the following JSON response: { errorMessage: "Please provide name 
      and bio for the user." }.
   
   If there's an error when updating the user:
      respond with HTTP status code 500.
      return the following JSON object: { errorMessage: "The user information 
      could not be modified." }.
      
   If the user is found and the new information is valid:
      update the user document in the database using the new information sent in the request body.
      respond with HTTP status code 200 (OK).
      return the newly updated user document.
   */

   /*
      update(): accepts two arguments, the first is the id of the user to update 
      and the second is an object with the changes to apply. It returns the count 
      of updated records. If the count is 1 it means the record was updated 
      correctly.
   */
   const result = db.update(24, {});
   console.log(result);

   res.status(200).json(req.body);
});

//Start server
const port = 8080;
const host = "127.0.0.1"; //another way to say "localhost"
app.listen(port, host, () => {
   console.log(`Server running at http://${host}:${port}`);
});