require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const {
  getWidgets,
  deleteWidget,
  addWidget,
  getDataStream,
} = require("./service");
// Enable CORS for all routes
app.use(cors("*"));

// Built-in middleware for parsing JSON
app.use(express.json());

// Built-in middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.get("/data-stream/:identifier", (req, res) => {
  try {
    const data = getDataStream(req.params.identifier);
    return res.status(201).json({ data });
  } catch (error) {
    console.error("Error fetching widget:", error);
    return res
      .status(500)
      .json({ message: "Error fetching widget", error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Healthy app!");
});

app.get("/widgets", (req, res) => {
  try {
    const data = getWidgets();
    return res.status(201).json({ data });
  } catch (error) {
    console.error("Error fetching widget:", error);
    return res
      .status(500)
      .json({ message: "Error fetching widget", error: error.message });
  }
});

app.post("/widgets", (req, res) => {
  try {
    addWidget(req.body);
    return res.status(201).json({ message: "Widget added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding widget", error: error.message });
  }
});

app.delete("/widgets/:id", (req, res) => {
  try {
    deleteWidget(req.params.id);
    return res.status(200).json({ message: "Widget deleted successfully" });
  } catch (error) {
    console.error("Error deleting widget:", error);
    return res
      .status(500)
      .json({ message: "Error deleting widget", error: error.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});
