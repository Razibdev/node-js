const User = require("./../models/userModel");
const Contact = require("./../models/contactModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerController.js");
const {v2: cloudinary} = require("cloudinary");
const ProjectMenu = require("../models/projectMenuModel");
const Team = require('../models/teamModel');
const APIFeatures = require("../utils/apiFeatures");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  console.log(req.user.id);
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is for password updates. Please use /updateMyPassword"
      )
    );
  }

  // 2) Update user document
  // 2) Filtered out unwanted fields names, that are not awlloed to be updated
  const filterBody = filterObj(req.body, "name", "email");

  const updateUser = await User.findByIdAndUpdate(req.user._id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    satus: "success",
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.userInfo = catchAsync(async (req,res,next) =>{
  const user =  await User.findById(req.user._id);
  res.status(200).json({
    status:'success',
    data:user
  })
})

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   res.status(200).json({
//     status: "success",
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

exports.contactFormSubmit = catchAsync(async (req,res, next) =>{
  const contact = await Contact.create({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    message: req.body.message
  });

  res.status(201).json({
    satus: "success",
    data: {
      user: contact
    },
  });

});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);


// project menu create method
exports.addTeamMemberAdmin = catchAsync(async (req, res, next)=>{

  const filename = req.files.feature_image;
  var feature_path = '';
  const data =   await  cloudinary.uploader.upload(filename.tempFilePath);
  feature_path = data.url;

  const team = await Team.create({
    full_name: req.body.full_name,
    designation: req.body.designation,
    short_bio: req.body.short_bio,
    feature_image: feature_path,
    fb_link: req.body.fb_link,
    tw_link: req.body.tw_link,
    ln_link: req.body.ln_link,
    gh_link: req.body.gh_link
  });

  res.status(201).json({
    status: 'success',
    data: {
      project: team,
      message: 'Team Member added Successfully Done',
      type: 'success'
    }
  });

});


//project menu all view
exports.viewTeamMemberAdmin = catchAsync(async (req, res, next)=>{
  const features = new APIFeatures(Team.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
  const team = await features.query;
  // const tours = await features.query.populate("reviews");
  res.status(200).json({
    status: "success",
    results: team.length,
    data: team
  });
});


//team list show front endt view
exports.viewTeamMemberUser = catchAsync(async (req, res, next)=>{
  const features = new APIFeatures(Team.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
  const team = await features.query;
  // const tours = await features.query.populate("reviews");
  res.status(200).json({
    status: "success",
    results: team.length,
    data: team
  });
});
