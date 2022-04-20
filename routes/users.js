const router = require('express').Router();
const { updateProfile, getUserInfo } = require('../controllers/users');
const validations = require('../middlewares/validations');

router.get('/me', getUserInfo);
router.patch('/me', validations.userInfoValidate, updateProfile);
module.exports = router;
