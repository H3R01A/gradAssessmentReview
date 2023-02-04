const Session = require("../models/sessionModel");
const path = require("path");

const sessionController = {};

/**
 * isLoggedIn - find the appropriate session for this request in the database, then
 * verify whether or not the session is still valid.
 */
sessionController.isLoggedIn = async (req, res, next) => {
  // write code here
  //lookup session and determine if it still exists

  console.log("this is req.cookies.ssid", req.cookies.ssid);

  try {
    //attempt to find session based on request cookies

    //! We are going to attempt to find a session/user's id. If we find one we are going to pass it along
    const session = await Session.findOne({ cookieId: req.cookies.ssid });

    console.log("isLoggedIn", session);

    //if it doesn't exist, the user will be redirected http://localhost:3000/signup
    if (session === null) {
      console.log("session has expired. Please log in again");
      //redirect to sign up
      return next({
        log: "session has expired. Please log in again. You will now be redirected",
        message: {
          error: err,
        },
      });

    } else {
      //else continue on to be redirected http://localhost:3000/secret

      res.locals.userId = session.cookieId;
      return next();
    }
  } catch (err) {
    console.log(
      "error on sessionController isLoggedIn middleware function" + err
    );
   
  }
};

/**
 * startSession - create and save a new Session into the database.
 */
sessionController.startSession = async (req, res, next) => {
  //write code here

  console.log("Starting a session");

  try {
    //add session to Session collection (database)
    const session = await Session.create({ cookieId: res.locals.user._id });
    return next();
  } catch (err) {

    console.log('this is an error after trying to create a session', err);
    return next({
      log: "error on sessionController.startSession middleware function",
      message: {
        error: err,
      },
    });
  }
};
// throw new Error('Unknown JavaScript defined.');
module.exports = sessionController;
