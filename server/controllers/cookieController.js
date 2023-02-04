
const cookieController = {};

/**
* setCookie - set a cookie with a random number
*/
cookieController.setCookie = (req, res, next) => {


  try {
    const randomNum = Math.floor(Math.random() * 100);

    // write code here
    res.cookie('codesmith', 'hi');
    res.cookie('secret', randomNum)

    return next();

  }

  catch (err) {
    if (err) next({
      log: 'error on cookieController.setCookie middleware function',
      message: {
        error: err,
      }
    })
  }
}

/**
* setSSIDCookie - store the user id in a cookie
*/
cookieController.setSSIDCookie = (req, res, next) => {
  // write code here
  console.log('cookieController setSSID Cookie');
  //original way

  res.cookie('ssid', res.locals.user._id, { httpOnly: true });
  console.log('cookies using cookie parser', req.cookies); // --> cookies using cookie parser { codesmith: 'hi', ssid: '637d945ed389b3d757195f6e', secret: '31' }
  //using app.use(cookieParser()); in the server.js file, now we have access to req.cookies (which will be an object)

  console.log('hello');
  return next();
}



module.exports = cookieController;
