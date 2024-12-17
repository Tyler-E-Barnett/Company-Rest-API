const fs = require("fs");
const path = "./data.json";

const appendToJson = (req, res) => {
  const data = req.body;

  const uniqueItemCodes = new Set(data);
  const array = Array.from(uniqueItemCodes);

  let existingData = [];
  if (fs.existsSync(path)) {
    const fileContent = fs.readFileSync(path, "utf8");
    if (fileContent) {
      existingData = JSON.parse(fileContent);
    }
  }

  const updatedData = existingData.concat(array);
  fs.writeFileSync(path, JSON.stringify(updatedData, null, 2), "utf8");

  res.send({ message: "Data appended successfully" });
};

const readJson = (req, res) => {
  if (!fs.existsSync(path)) {
    return res.status(404).send({ message: "File not found" });
  }

  const fileContent = fs.readFileSync(path, "utf8");
  const data = JSON.parse(fileContent);
  const dataSet = new Set(data);

  res.send({ set: [...dataSet] });
};

module.exports = { appendToJson, readJson };
