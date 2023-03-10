const express = require('express');

const userController = require('../controllers/userController');
const sessionController = require('../controllers/sessionController');
const cookieController = require('../controllers/cookieController');

const router = express.Router();


//route handler for sending back information 



router.get('/getItems', sessionController.isLoggedIn, userController.getItems, (req, res) => {

    return res.status(200).json(res.locals.user.items);

});

router.post('/signup', userController.createUser, sessionController.startSession, cookieController.setSSIDCookie, (req, res) => {
    
    
    console.log('made it out of creating a user');
    return res.status(200).redirect('/app');
});


/**
 * THe purpose here is after login to START a session. Then we are going to create a session and put the user's id as the cookie id
 * then we are going to set the cookie to be the user's id as well for us to use later
 */
router.post('/login', userController.verifyUser, sessionController.startSession, cookieController.setSSIDCookie, (req, res) => {
    
  
    return res.status(200).redirect('/app');
});

/**
 * Before being able to add, we are going to verify the user still has an active session
 * if so then we are going to go into the addItem controller, here we are going to find a user by using the cookies and searching for the id in the database
 */
router.post('/add',sessionController.isLoggedIn, userController.addItem, (req, res) => {
    
    
    return res.status(200).json(res.locals.user.items);
});


router.patch('/update', sessionController.isLoggedIn, userController.updateItem, (req, res) => {
    
    
    return res.status(200).json(res.locals.user.items);
});

router.patch('/updateName', sessionController.isLoggedIn, userController.updateItemName, (req, res) => {
    
    
    return res.status(200).json(res.locals.user.items);
});

router.delete('/delete', sessionController.isLoggedIn, userController.deleteItem, (req, res) => {
    
   
    return res.status(200).json('task officially deleted');
});



module.exports = router;

