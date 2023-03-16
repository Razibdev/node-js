const catchAsync = require("../utils/catchAsync");
const Project = require('../models/projectModel');
const ProjectMenu = require('../models/projectMenuModel');
const Contact = require('../models/contactModel')
const APIFeatures = require('../utils/apiFeatures.js');
const imgur = require('imgur');
const cloudinary = require('cloudinary').v2;


// Configuration
cloudinary.config({
    cloud_name: "dxzfwutcp",
    api_key: "153876889631992",
    api_secret: "DmCMPO6rUk_1kcatDDoZr11KQVc"
});


exports.getAllAppView = catchAsync(async (req, res, next)=>{
    const features = new APIFeatures(Project.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const project = await features.query;

    const allResult = new APIFeatures(Project.find(), req.query);
    const all = await allResult.query;
    // const tours = await features.query.populate("reviews");
    res.status(200).json({
        status: "success",
        results: project.length,
        allresult: all.length,
        data: project
    });
});


exports.getWebAppView = catchAsync(async (req, res, next)=>{
    const features = new APIFeatures(Project.find({project_type: 'web'}), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const project = await features.query;

    const allResult = new APIFeatures(Project.find({project_type: 'web'}), req.query);
    const all = await allResult.query;
    // const tours = await features.query.populate("reviews");
    res.status(200).json({
        status: "success",
        results: project.length,
        allresult: all.length,
        data: project
    });
});



exports.getAppAppView = catchAsync(async (req, res, next)=>{
    const features = new APIFeatures(Project.find({project_type: 'app'}), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const project = await features.query;

    const allResult = new APIFeatures(Project.find({project_type: 'app'}), req.query);
    const all = await allResult.query;
    // const tours = await features.query.populate("reviews");
    res.status(200).json({
        status: "success",
        results: project.length,
        allresult: all.length,
        data: project
    });
});


exports.getGraphicsAppView = catchAsync(async (req, res, next)=>{
    const features = new APIFeatures(Project.find({project_type: 'graphics'}), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const project = await features.query;

    const allResult = new APIFeatures(Project.find({project_type: 'graphics'}), req.query);
    const all = await allResult.query;
    // const tours = await features.query.populate("reviews");
    res.status(200).json({
        status: "success",
        results: project.length,
        allresult: all.length,
        data: project
    });
});














exports.addProject = async (req, res, next)=>{

    const filename = req.files.feature_image;
    var feature_path = '';
    const data =   await  cloudinary.uploader.upload(filename.tempFilePath);
    feature_path = data.url;

    const project = await Project.create({
        project_name: req.body.project_name,
        project_description: req.body.project_description,
        project_price: req.body.project_price*1,
        project_offer_price: req.body.project_offer_price*1,
        feature_image: feature_path
    });
    // const gallary = req.files.gallary_image;
    var gallary_data = [];
    req.files.gallary_image.forEach( async (item, index)=>{
        const data =   await  cloudinary.uploader.upload(item.tempFilePath);
        gallary_data[index] = data.url;
        if(req.files.gallary_image.length -1 == index){
            project.gallary_image = gallary_data;
            project.save();
        }
    });

    res.status(201).json({
        status: 'success',
        data: project
    })



}


exports.viewProject = catchAsync(async (req, res, next)=>{
    const features = new APIFeatures(Project.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const project = await features.query;
    // const tours = await features.query.populate("reviews");
    res.status(200).json({
        status: "success",
        results: project.length,
        data: project
    });
});



// project menu create method
exports.addProjectMenu = async (req, res, next)=>{

    const filename = req.files.feature_image;
    var feature_path = '';
    const data =   await  cloudinary.uploader.upload(filename.tempFilePath);
    feature_path = data.url;

    const project = await ProjectMenu.create({
        project_id: req.params.pid,
        menu_name: req.body.project_name,
        menu_description: req.body.project_description,
        feature_image: feature_path
    });

    res.status(201).json({
        status: 'success',
        data: {
            project: project,
            message: 'Project Menu Updated Successfully Done',
            type: 'success'
        }
    });

}

//project menu all view
exports.viewProjectMenu = catchAsync(async (req, res, next)=>{
    const features = new APIFeatures(ProjectMenu.find({'project_id': req.params.pid}), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const project = await features.query;
    // const tours = await features.query.populate("reviews");
    res.status(200).json({
        status: "success",
        results: project.length,
        data: project
    });
});


//project menu delete method
exports.deleteProjectMenu = catchAsync(async (req, res, next) => {
  await ProjectMenu.findByIdAndDelete(req.params.pid);
  res.status(200).json({
    status: "success",
    data: {
        message: 'Project Menu Deleted Successfully Done',
        type: 'failure'
    },
  });
});


// admin contact list admin common route

exports.viewContactList = catchAsync(async (req, res, next)=>{
    const features = new APIFeatures(Contact.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const project = await features.query;
    // const tours = await features.query.populate("reviews");
    res.status(200).json({
        status: "success",
        results: project.length,
        data: project
    });
});