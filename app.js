
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "to Estonia."

const aboutContent = "Estonia, officially the Republic of Estonia, is a country in Northern Europe. It is bordered to the north by the Gulf of Finland across from Finland, to the west by the Baltic Sea across from Sweden, to the south by Latvia, and to the east by Lake Peipus and Russia. The territory of Estonia consists of the mainland and of 2,222 islands on the eastern coast of the Baltic Sea, covering a total area of 45,227 km2 (17,462 sq mi), and is influenced by a humid continental climate. Tallinn, the capital of Estonia.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-Dilia:test123@cluster0.xdl6k.mongodb.net/myblogDB",
{
  useUnifiedTopology: true,
  useNewUrlParser: true,

});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/posts", function(req, res){

  Post.find({}, function (err, posts){
    res.render("posts", {
      posts: posts
      });
  });

  });

app.get("/", function(req, res){
  res.render("home", {startingContent: homeStartingContent,});
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if (!err) {
      res.redirect("/posts");
    }
  });
});

app.get("/posts/:postId", function(req, res){

  const requestedId = (req.params.postId);

  Post.findOne({_id: requestedId}, function(err, post){
    res.render("post", {
      id: post._id,
      title: post.title,
      content: post.content
    });
  });
});

app.post("/delete", function(req,res){

const idDelete= req.body.button;

Post.findByIdAndRemove(idDelete,function(err){
  if(!err){
    console.log("successfully deleted");
  }
  res.redirect("/");
});
});


// app.get("/posts/:postId/delete", function(req, res){
//
//   const deleteId = (req.params.postId);
//
//   Post.findByIdAndRemove({_id: deleteId}, function(err, post){
//     if(err){
//       console.log(err);
//     } else {
//       console.log("Succesfully removed from the list.")
//       redirect("/");
//     }
//   });
// });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
