// const util = require('util');
const promisify = require("util.promisify");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");
const crypto = require('crypto');

const signToken = (id, email) => {
  return jwt.sign({ user_id: id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) =>{
   const token = signToken(user._id, user.email);
   //send token by cookies
   const cookiesOption = {
    expires: new Date(Date.now()+process.env.JWT_COOKIES_EXPIRES_IN*24*60*60*1000),
    httpOnly: true //the cookie can not modified bye the browser prevent cross site scripting attacks
   };

   if(process.env.NODE_ENV === 'production') cookiesOption.secure = true; //only connection in encryption connection
   res.cookie('jwt', token, cookiesOption);
   user.password = undefined;


   // save user token
   user.token = token;

   // return new user
   res.status(statusCode).json(user);
}


exports.signup = catchAsync(async (req, res, next) => {
  // const { first_name, last_name, email, password } = req.body;
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

 createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  console.log(req.body);
  // res.status(200).json(req.body);

  const { email, password } = req.body;
  // 1) Check if email and password exist

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client

 createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  console.log(req.headers.authorization);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }
  // console.log(req.user);

  // 2) Verification token
  const deocded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists

  const currentUser = await User.findById(deocded.user_id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token dose no longer exist", 401)
    );
  }

  // 4) Check if user change password after the token was issued
  if (currentUser.changePasswordAfter(deocded.iat)) {
    return next(
      new AppError("User recently change password | please login agian", 401)
    );
  }

  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address."), 404);
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordRestToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/reset-password/${resetToken}`;
  const message = `Forgot your password? Submit a Patch request with your new password and passwordConfirm to: ${resetUrl}.\n If you didn't forget your password, Please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password rest token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordRestExpires = undefined;
     await user.save({ validateBeforeSave: false });
     return next(new AppError('There was an error sending the email. Try again leter!'));
  }
});

exports.resetPassword = catchAsync(async(req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordRestExpires: { $gt: Date.now() },
  }).select("+passwordConfirm");;

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  console.log(req.body);
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordRestExpires = undefined;
  await user.save();

   createSendToken(user, 200, res);
});




exports.updatePassword = catchAsync(async(req, res, next) =>{
  // 1) Get user from collection
  console.log(req.user);
  const user = await User.findById(req.user._id).select('+password');
  console.log(user)
  // 2) Check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is worng", 401));
  }

  console.log(req.body);
  console.log(user)
  console.log('ok')
  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
 await user.save();


  // 4) Log user in, send JWT
 createSendToken(user, 200, res);

});
