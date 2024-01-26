const express = require('express');
const router = express.Router();

const users = require('../controllers/authController');
const post = require('../controllers/postController');
const comment = require('../controllers/comment');
const auth = require('../middlewares/auth');

// for user authentication
router.post('/login',users.login);
router.post('/signup',users.signup);
router.get('/refresh',users.refresh);
router.get('/logout',auth,users.logout);


// for posts
router.post('/create',auth,post.create_post);
router.put('/update',auth,post.update_post);
router.delete('/delete/:id',auth,post.delete_post);
router.get('/posts',post.getAllPost);
router.get('/post/:id',post.getSinglePost);
router.get('/postbyuser/:id',post.postByuser);


// for comments 

router.post('/comment',auth,comment.comment);
router.get('/getcomments/:id',auth,comment.getAllcomments);


module.exports = router;