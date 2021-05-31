// implement your API here
const express = require("express");
const server = express();
const port = 8080;

server.use(express.json());

server.get("/", (req, res) => {
   res.send({ message: "Welcome to the Node API-1 project" });
});

server.listen(port, () => {
   console.log(`Server is running on port: ${port}`);
});
