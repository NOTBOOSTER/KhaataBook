const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const data = path.join(__dirname, "Data");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public"))); //

//hendling home page route
app.get("/", (req, res) => {
  fs.readdir(data, (err, dataDir) => {
    if (err) console.log(err);
    res.render("index", { data: dataDir });
  });
});

//handling create new hisaab page route
app.get("/create", (req, res) => {
  const date = getDate();
  fs.access(`${data}/${date}.txt`, (err) => {
    if (err) {
      res.render("create");
    } else {
      res.redirect(`/edit/${date}`);
    }
  });
});

//handling edit hisaab page route
app.get("/edit/:date", (req, res) => {
  fs.readFile(
    `${data}/${req.params.date}.txt`,
    { encoding: "utf8" },
    (err, data) => {
      if (err) res.redirect("/");
      res.render("edit", { data: data, date: req.params.date });
    }
  );
});

//hendling new hisaab route
app.post("/create/new", (req, res) => {
  const date = getDate();
  fs.writeFile(`${data}/${date}.txt`, req.body.newHisaab, "utf8", (err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

//hendling update route
app.post("/edit/:date/update", (req, res) => {
  fs.writeFile(
    `${data}/${req.params.date}.txt`,
    req.body.updatedHisaab,
    "utf8",
    (err) => {
      if (err) console.log(err);
    }
  );
  res.redirect("/");
});

//handling read route
app.get("/:date", (req, res) => {
  fs.readFile(
    `${data}/${req.params.date}.txt`,
    { encoding: "utf8" },
    (err, data) => {
      if (err) {
        res.redirect("/");
      } else {
        res.render("read", { data: data, date: req.params.date });
      }
    }
  );
});

// handling delete route
app.get("/delete/:date/confirmed" , (req, res) => {
  fs.unlink(`${data}/${req.params.date}.txt`, (err) => {
    if (err) console.log(err);
    res.redirect("/");
  })
  });

  // * route
  app.get("*", (req, res) => {
    res.redirect("/");
  })
// test route
app.get("/test", (req, res) => {
  res.send("hey");
});

// helper function to get current date in dd-mm-yyyy format
const getDate = () => {
  const getDate = new Date();
  const day = getDate.getDate();
  const month = getDate.getMonth() + 1;
  const year = getDate.getFullYear();
  return `${day}-${month}-${year}`;
};


// starting the server
app.listen(3000);
