const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const userController = {};

//! CREATE USER METHOD
userController.createUser = async (req, res, next) => {
  console.log("made it here");

  const { username, password } = req.body;

  console.log({ username, password });

  try {
    //ATTENTION: THIS IS HOW YOU SEND ERROR MESSAGE WITH RESPONSE!!!!
    //INVOKE NEXT AND PASS AN ERROR MESSAGE
    if (!username || !password) {
      console.log("this");
      return next({
        message:
          "Error Signing Up. Please try again with a username and/or password",
      });
    }

    //add a new user to the User Collection
    const newUser = await User.create({
      username,
      password,
    });
    console.log({ newUser });

    res.locals.user = newUser;

    return next();
  } catch (err) {
    console.log("error creating a new user");
    console.log(`Error in userController createUser ${err}`);
    res.redirect("/signup");
    //+ 'Error Signing Up. Please try again'
  }
};

//! VERIFY USER METHOD
userController.verifyUser = async (req, res, next) => {
  // write code here

  try {
    //pull username and password from request body
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });

    //check to see if user does not exist within database
    //if not, redirect to sign up page
    if (!user) {
      res.redirect("/signup");
    }

    //assigning user hash to variable from database
    const userHash = user.password;

    const result = await bcrypt.compare(password, userHash);

    console.log("verify user");
    console.log({ user, userHash, result });

    //check to see if password was correct, if not, redirected to login page
    if (!result) {
      res.redirect("/login");
    }

    //implementation BEFORE USING bcrypt

    // //attempt to find user in User Collection
    // const user = await User.findOne({ username: username, password: password });

    //if there is no user, redirect user to sign up page

    //BEFORE bcrypt implementation

    // if (!user) {
    //   //redirect to sign up
    //   res.redirect('/signup');

    //else add user to res locals object to be used in the next middleware
    // }
    else {
      res.locals.user = user;
      return next();
    }
  } catch (err) {
    console.log("Error in userController.verifyUser" + err);
    next({
      log: "error on userController.verifyUser middleware function",
      message: {
        error: err,
      },
    });
  }
};

userController.getItems = async (req, res, next) => {
  try {
    //ATTENTION: THIS IS HOW YOU SEND ERROR MESSAGE WITH RESPONSE!!!!
    //INVOKE NEXT AND PASS AN ERROR MESSAGE
    if (!username || !password) {
      console.log("this");
      return next({
        message:
          "Error Signing Up. Please try again with a username and/or password",
      });
    }

    //add a new user to the User Collection
    const newUser = await User.create({
      username,
      password,
    });
    console.log({ newUser });

    res.locals.user = newUser;

    return next();
  } catch (err) {
    console.log("Error in userController.getItems" + err);
    next({
      log: "error on userController.getItems middleware function",
      message: {
        error: err,
      },
    });
  }
};

userController.addItem = async (req, res, next) => {
  try {
    //pull username and password from request body

    const { name } = req.body;

    console.log({ name });

    //! we are pulling the userid from locals
    const userID = res.locals.userId;

    //! here we are going to query the database looking for the user because we have their id from the session
    const user = await User.findOne({ _id: userID });

    console.log("this is user in addItem controller", { user });
    //check to see if user does not exist within database
    //if not, redirect to sign up page
    if (!user) {
      res.redirect("/signup");
    }

    //add to items array

    user.items = [{ name }];

    //update user on database
    await User.findOneAndUpdate({ _id: userID }, { items: user.items });

    //return back out
    res.locals.user = user;
    return next();
  } catch (err) {
    console.log("Error in userController.addItem" + err);
    next({
      log: "error on userController.addItem middleware function",
      message: {
        error: err,
      },
    });
  }
};

userController.updateItem = async (req, res, next) => {};

userController.deleteItem = async (req, res, next) => {};

module.exports = userController;