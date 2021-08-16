const express = require("express");
require("dotenv").config();
const fs = require("fs/promises");

const PORT = process.env.PORT || 5001;

const app = express();

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/test", (req, res) => {
  res.status(400).json({
    Status: 200,
    Message: "Ok",
    Data: "Hello Friend!",
  });
});

app.get("/product", async (req, res) => {
  try {
    const data = await fs.readFile("./db/data.json", (err) => {
      if (err) throw new Error("Error in reading file");
    });
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/product", async (req, res) => {
  const { title, price } = req.body;
  if (!title || !price) {
    return res.status(400).json({ error: "Error in validation" });
  }

  const product = {
    id: Date.now(),
    title: title,
    price: price,
  };
  try {
    let products = await fs.readFile("./db/data.json");
    products = JSON.parse(products);
    products.push(product);

    await fs.writeFile("./db/data.json", JSON.stringify(products));
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
