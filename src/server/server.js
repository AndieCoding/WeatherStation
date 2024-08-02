const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

const consultasRouter = require('./routes/consultas');
app.use('/api', consultasRouter);

app.use(express.static(path.join(__dirname, "..", "..")));
app.get("/registro", (req, res) => 
  res.sendFile(path.join(__dirname, "..", "registro.html")));
 app.get("/clima", (req, res) =>   
  res.sendFile(path.join(__dirname, "..", "clima.html"))); 
 app.get("/index", (req, res) => 
  res.sendFile(path.join(__dirname, "..", "index.html")));
 app.get("/config", (req, res) => 
  res.sendFile(path.join(__dirname, "..", "config.html")));
 
app.use(function (req, res) {
  res.status(404).end('error'); });

app.listen(port, () => 
  console.log(`App running at port ${port}`));


/*
const multer = require("multer");
const upload = multer({ dest: '../assets/user' });

let users = require("./usuarios.json");
const filePath = path.join(__dirname, "usuarios.json");

app.use('/uploads', express.static(path.join(__dirname, '..', 'assets', 'user')));





app.post("/:id/historial", (req, res) => {
  const newHistory = req.body;
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((user) => user.id === userId);
  users[userIndex].history.push(newHistory);
  console.log("Success");
  res.json("success");
});

app.post("/upload/:user", upload.single('image'), (req, res) => {
  if (req.file) {
    console.log(`Uploaded file`);
    res.status(200).send("File uploaded successfully.");
  } else {
    res.status(400).send("No file uploaded.");
  }
});

*/



