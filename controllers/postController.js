const puppeteer = require('puppeteer')
const Post = require('../models/Post');

//show add page
//GET request /posts/add
module.exports.add_get = (req,res) => {


    res.render('posts/add')
    
    
};

//process add form
//POST request /posts
module.exports.add_post =  async (req,res) => {
     

   try {
       req.body.user = res.locals.user._id
       await Post.create(req.body)
       res.redirect('/dashboard')
   } catch (err) {
       console.log(err)
       res.render('errors/500')
   }
    
    
};

//show all posts
//GET request /posts
module.exports.show_get = async (req,res) => {
   try {
       const posts = await Post.find({ status: 'public' })
                                .populate('user')
                                .sort({ createdAt: 'desc' })
                                .lean()
        res.render('posts/index', {
            posts,
        })
   } catch (err) {
       console.log(err)
       res.render('errors/500')
   }   
};

// @desc    Show single post
// @route   GET /posts/:id
module.exports.single_get = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id).populate('user').lean()

    if (!post) {
      return res.render('errors/404')
    }

    if (post.user._id != res.locals.user._id && post.status == 'private') {
      res.render('errors/404')
    } else {
      res.render('posts/show', {
        post,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('errors/404')
  }
};

//show edit page
//GET request /posts/edit/:id
module.exports.edit_get = async (req,res) => {
    try {
        const post = await Post.findOne({
          _id: req.params.id,
        }).lean()
    
        if (!post) {
          return res.render('errors/404')
        }
    
        if (post.user != res.locals.user._id) {
            console.log(post.user);
            console.log(res.locals.user._id)
            res.render('posts/edit', {
                post,
              })
         
        } else {
            res.redirect('/posts')
        }
      } catch (err) {
        console.error(err)
        return res.render('errors/500')
      }
};

// @desc    Update post
// @route   PUT /posts/:id
module.exports.update_put = async (req, res) => {
    try {
      let post = await Post.findById(req.params.id).lean()
  
      if (!post) {
        return res.render('errors/404')
      }
  
      if (post.user != res.locals.user._id) {
        post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
          })
          res.redirect('/dashboard')       
      } else {
        res.redirect('/posts')
        
      }
    } catch (err) {
      console.error(err)
      return res.render('errors/500')
    }
};

  // @desc    Delete post
// @route   DELETE /posts/:id
module.exports.post_delete = async (req, res) => {

  try {
    await Post.remove({_id: req.params.id})
    res.redirect('/dashboard')
    
  } catch (err) {
    console.error(err)
    res.render('errors/500')
  }
 
};

// @desc    User posts
// @route   GET /posts/user/:userId
module.exports.userpost_get = async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('posts/index', {
      posts,
    })
  } catch (err) {
    console.error(err)
    res.render('errors/500')
  }
};
  
//translate textarea
// method POST /trans
module.exports.trans_post = async (req, res) => {
       const data = req.body; 
        const rec = data.data
       console.log('data received:' + rec)



    const url = 'https://translate.google.com/#view=home&op=translate&sl=auto&tl=ig&text=' + rec ;
    

        let browser = await puppeteer.launch();
        let page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' })

        let datu =await page.evaluate(() => {
            let trans = document.querySelector('span[class="tlid-translation translation"]').innerText;

            return trans;
        })
        console.log('datu is: ' + datu);
        //return data
        res.json(datu)
       // await browser.close();
}

