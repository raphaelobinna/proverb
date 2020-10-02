const { Router } = require('express');
const homeController = require('../controllers/homeController');
const { auth, checkUser } = require('../middleware/auth');

const router = Router();

router.get('/', homeController.home_get);
router.get('/dashboard', auth, checkUser, homeController.dashboard_get);
