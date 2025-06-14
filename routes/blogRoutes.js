const express = require("express")

const blogController = require("../controllers/blogController")

const router = express.Router()

const Blog = require("../models/blog");


router.get("/", blogController.blog_index)

//Post blog
router.post("/", blogController.blog_create_post)

router.get("/create", blogController.blog_create_get)


router.get("/:id", blogController.blog_details)

router.delete("/:id", blogController.blog_delete)

module.exports = router