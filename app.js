const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");

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

// app.use((req, res, next) => {
//     console.log('in the next middleware');
//     next();
// })

//These are the blog routes

//Gets the things from blogs collection from that database
// Sorts it in descending order
app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { title: "All Blogs", blogs: result });
    })
    .catch((err) => {
      console.log("Error!");
    });
});

//Post blog
app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body)

  blog.save()
  .then(result => {
    res.redirect("/blogs")
  })
  .catch(err => {
    console.log(err)
  })
});

app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a new blog" });
});

app.get("/blogs/:id", (req,res) => {
    const id = req.params.id
    Blog.findById(id)
    .then(result => {
        res.render("details", {blog: result, title: "Blog Details"})
    })
    .catch(err => {
        console.log(err)
    })

})

app.delete("/blogs/:id", (req, res) => {
    const id = req.params.id

    Blog.findByIdAndDelete(id)
    .then(result => {
        res.json({redirect: "/blogs"})
    })
    .catch(err => {
        console.log(err)
    })
})


// page does not exist
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
