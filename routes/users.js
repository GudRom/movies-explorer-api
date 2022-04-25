const router = require('express').Router();
const { updateProfile, getUserInfo } = require('../controllers/users');
const validations = require('../middlewares/validations');

router.get('/users/me', getUserInfo);
router.patch('/users/me', validations.userInfoValidate, updateProfile);
module.exports = router;
