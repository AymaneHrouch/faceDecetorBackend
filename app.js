const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
const port = process.env.PORT || 2000;
const fs = require("fs");
const cors = require("cors");
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/reset", (req, res) => {
  fs.writeFile("./public/counter.txt", "0", () => {});
  fs.writeFile("./public/list.txt", "", () => {});
  fs.rmdirSync("./public/imgs", { recursive: true });
  fs.mkdirSync("./public/imgs");
  res.send("RESET!");
});

app.get("/count", (req, res) => {
  fs.readFile("./public/counter.txt", "utf8", (err, data) => {
    res.send(data);
  });
});

app.post("/", async (req, res) => {
  const { img, name } = req.body;
  const result = await new Promise((resolve, reject) => {
    fs.readFile("./public/counter.txt", "utf8", (err, data) => {
      if (err) reject(err);
      let nbre = parseInt(data);
      nbre++;
      nbre = nbre.toString();
      resolve(nbre);
    });
  });
  fs.writeFile("./public/counter.txt", result, () =>
    console.log("incremented!")
  );
  fs.appendFile("./public/list.txt", `${name}\n`, () =>
    console.log("name added to list.txt")
  );

  const data = img.replace(/^data:image\/\w+;base64,/, "");
  const buf = Buffer.from(data, "base64");
  fs.writeFile(`./public/imgs/${result}_${name}.png`, buf, () =>
    console.log("what abt now!")
  );
  res.send("hi there!");
});

app.use(function (req, res) {
  res.status(404).send("You're not supposed to be here, are you?");
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
