const express = require('express');
const router = express.Router();
const { auth, checkUser } = require('../middleware/auth');
const Post = require('../models/Post');

//login page
//GET request /
router.get('/', (req,res) => {
    res.render('login', {
        layout: 'login'
    })
});

// dashboard
//GET request /dashboard
router.get('/dashboard', auth, checkUser, async (req,res) => {
    try {
        const posts = await Post.find({ user: res.locals.user._id }).lean()
        res.render('dashboard', {name: res.locals.user.email, posts})
    } catch (err) {
        console.log(err)
        res.render('errors/500')
    }
});

// Log Out User
// GEt /logout
// router.get('/logout', (req, res) => {
//     res.cookie('jwt', '', {maxAge: 1})
//     res.redirect('/')
// })



module.exports = router