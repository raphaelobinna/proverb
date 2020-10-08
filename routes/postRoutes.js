const { Router } = require('express')
const postController = require('../controllers/postController')
const {auth, checkUser} = require('../middleware/auth')


const router = Router();

router.get('/posts/add', auth, postController.add_get);
router.post('/posts', auth, checkUser, postController.add_post);
router.get('/posts', auth, postController.show_get);
router.get('/posts/:id', auth, checkUser, postController.single_get);
router.get('/posts/edit/:id', auth, checkUser, postController.edit_get);
router.put('/posts/:id', auth, checkUser, postController.update_put);
router.delete('/posts/:id', auth, checkUser, postController.post_delete);
router.get('/posts/user/:userId', auth, postController.userpost_get);
router.post('/trans', auth, checkUser, postController.trans_post);

module.exports = router;