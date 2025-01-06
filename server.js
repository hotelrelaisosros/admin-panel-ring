const express = require("express");
var cors = require('cors')

const path = require("path");
// const { base_Url } = require("./src/constants/Apibase");
const app = express();

app.use(cors()) 
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("http://real.heroksa.net/api/v1/products/update_customization", (req, res) => {
  console.log(req.body);

  res.send({ success: true });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});