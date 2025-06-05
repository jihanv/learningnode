const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes")

// express app
const app = express();

//register for view engine
app.set("view engine", "ejs");

//Connect to mongodb
const dbURI =
  "mongodb+srv://jinja:osiduf0rw89usAS@nodetut.xxl2kuo.mongodb.net/node-tuts?retryWrites=true&w=majority&appName=nodetut";
mongoose
  .connect(dbURI)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log("ERROR");
  });

//middleware to give access to static files conveniently. Anything in the "public" folder can now be accessed
app.use(express.static("public"));

// middleware that logs information for you
app.use(morgan("dev"));

//Middleware to help parse post request data
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

//Use the blogRoutes
app.use("/blogs", blogRoutes)

// page does not exist
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
