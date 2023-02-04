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
      console.log("right before redirect");
      res.redirect("/signup");
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
    console.log("made it userController - getItems");
    //pull username and password from request body

    //! we are pulling the userid from locals
    const userID = res.locals.userId;

    //! The below is finding a user and then we are going to modify the items array assigned to the user
    const user = await User.findOne({ _id: userID });

    console.log("this is user in getItems controller", { user });

    res.locals.user = user;

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
    console.log("made it userController - addItem");
    //pull username and password from request body

    const { taskName } = req.body;

    console.log({ taskName });

    //! we are pulling the userid from locals
    const userID = res.locals.userId;

    //! here we are going to query the database looking for the user because we have their id from the session
    // const user = await User.findOne({ _id: userID });

    //! The below is finding a user and pushing a value onto the array
    //https://www.mongodb.com/docs/v4.2/reference/method/db.collection.findAndModify/
    //operators such as $push for adding values to database that is an array https://www.mongodb.com/docs/v4.2/reference/operator/update/#id1
    const user = await User.findOneAndUpdate(
      { _id: userID },
      { $push: { items: { name: taskName } } },

      //the below new options ensures the new value is returned
      { new: true, useFindAndModify: false }
    );

    console.log("this is user in addItem controller", { user });
    //check to see if user does not exist within database
    //if not, redirect to sign up page
    if (!user) {
      res.redirect("/signup");
    }

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

userController.updateItem = async (req, res, next) => {
  try {
    console.log("made it userController - updateItem");
    //pull username and password from request body

    const { taskName, taskStatus } = req.body;

    console.log({ taskName, taskStatus });

    //! we are pulling the userid from locals
    const userID = res.locals.userId;

    //! here we are going to query the database looking for the user because we have their id from the session
    // const user = await User.findOne({ _id: userID });

    //! The below is finding a user and then we are going to modify the items array assigned to the user
    const user = await User.findOne({ _id: userID });

    //Updating the status that needs to be - iterate over array until you find the object with the name property matching the task name. then update the status
    user.items.forEach((task) => {
      if (task.name === taskName) {
        task.status = taskStatus;
      }
    });

    console.log("this is user in updateItem controller", { user });

    await User.findOneAndUpdate(
      { _id: userID },
      { items: user.items },
      //the below new options ensures the new value is returned
      { new: true, useFindAndModify: false }
    );

    res.locals.user = user;

    return next();
  } catch (err) {
    console.log("Error in userController.updateItem" + err);
    next({
      log: "error on userController.updateItem middleware function",
      message: {
        error: err,
      },
    });
  }
};

//https://www.mongodb.com/docs/v4.2/reference/operator/query/

userController.updateItemName = async (req, res, next) => {
  try {
    console.log("made it userController - updateItemName");
    //pull username and password from request body

    const { nameUpdate, taskId } = req.body;

    // console.log({ nameUpdate, taskId });

    //! we are pulling the userid from locals
    const userID = res.locals.userId;

    //! here we are going to query the database looking for the user because we have their id from the session
    // const user = await User.findOne({ _id: userID });

    //! The below is finding a user and then we are going to modify the items array assigned to the user
    const user = await User.findOne({ _id: userID });
    const items = user.items;
    
    // console.log('this is taskId', taskId);
    const updateTask = items.find((task) => task._id.toString() === taskId);
    // console.log("updateTask", updateTask);
    updateTask.name = nameUpdate;
    user.save();

    console.log("this is user in updateItemName controller after update", user.items);

  
    // console.log(user.items);
    // await User.findOneAndUpdate(
    //   {_id: userID},
    //   {items: items.find(task => task._id === taskId)},
      
    //   //the below new options ensures the new value is returned
    //   { new: true, useFindAndModify: false }
    // );


    res.locals.user = user;

    return next();
  } catch (err) {
    console.log("Error in userController.updateItem" + err);
    next({
      log: "error on userController.updateItem middleware function",
      message: {
        error: err,
      },
    });
  }
};

userController.deleteItem = async (req, res, next) => {
  try {
    console.log("made it userController - deleteItem");
    //pull username and password from request body

    const { taskName } = req.body;

    console.log({ taskName });

    //! we are pulling the userid from locals
    const userID = res.locals.userId;

    //! here we are going to query the database looking for the user because we have their id from the session
    // const user = await User.findOne({ _id: userID });

    //! The below is finding a user and pushing a value onto the array
    //https://www.mongodb.com/docs/v4.2/reference/method/db.collection.findAndModify/
    //operators such as $push for adding values to database that is an array https://www.mongodb.com/docs/v4.2/reference/operator/update/#id1

    //! The below is finding a user and then we are going to modify the items array assigned to the user
    const user = await User.findOne({ _id: userID });

    //iterate through the items and filter out the one task to be deleted
    const updatedTasks = user.items.filter((task) => task.name !== taskName);

    await User.findOneAndUpdate(
      { _id: userID },
      { items: updatedTasks },
      //the below new options ensures the new value is returned
      { new: true, useFindAndModify: false }
    );

    return next();

    // const deletedTask = await User.findOneAndDelete({item: { $elemMatch: { name: taskName } }});
  } catch (err) {
    console.log("Error in userController.deleteItem" + err);
    next({
      log: "error on userController.deleteItem middleware function",
      message: {
        error: err,
      },
    });
  }
};

module.exports = userController;
