const express = require('express');
const userController = require('../../../controller/usercontroller');
const bookController = require('../../../controller/bookDetails.controller')
const isVerified = require('../../../middleware/isauthorizedmiddleware')
const rentController = require('../../../controller/rent.controller')
const router = express.Router();
//----------------------user register / create user router----------
router.post('/user/register', userController.regester);
router.get('/user/basiclogin', userController.login);
router.get('/user/login', userController.strongLogin);
//---------------------------search user-----------------------------
router.get('/user/search', isVerified.verifyToken, userController.searchUser);
//---------------------book register or create books router-----------------
router.post('/book/register', isVerified.verifyToken, bookController.bookRegister);
//----------------------find all books -------------------------------------
router.get('/books', isVerified.verifyToken, bookController.findAllbooksorByisbn)
//---------------------Rent Details routers -------------------------------------
router.post('/torent', rentController.bootRentTocustomer)
module.exports = router;