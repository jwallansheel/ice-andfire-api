const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// Route to fetch data from Ice and Fire API
app.get("/api/getall", async (req, res) => {
  try {
    const objects = ["books", "characters", "houses"];
    const apiCalls = objects.map((name) =>
      axios.get(`https://www.anapioficeandfire.com/api/${name}`)
    );
    const responses = await Promise.all(apiCalls);

    const data = objects.reduce((acc, curr, index) => {
      acc[curr] = responses[index].data;
      return acc;
    }, {});

    console.log(data);

    if (!data.books.length && !data.characters.length && !data.houses.length) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching data from Ice and Fire API",
      error: error.message,
    });
  }
});
app.get("/api/get", async (req, res) => {
  try {
    // Get the URL parameter from the query string (e.g., /api/get?url=someurl)
    const { url } = req.query; // Use req.query to extract the 'url' parameter

    // Check if the URL parameter is provided
    if (!url) {
      return res.status(400).json({ message: "URL parameter is required" });
    }

    // Fetch data from the external API using the provided URL
    const response = await axios.get(url); // Use the extracted 'url'

    // Return the data from the API
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching data from Ice and Fire API",
      error: error.message,
    });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
