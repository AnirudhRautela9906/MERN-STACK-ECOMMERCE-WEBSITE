const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto")
const cloudinary = require('cloudinary')


// Register a User

exports.registerUser = catchAsyncErrors(async (req, res, next) => {


  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width:500,
    crop: "scale"
  })

    const {name,email,password} = req.body

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id:  myCloud.public_id ,
      url: myCloud.secure_url,
 
    },
  });


sendToken(user,201,res)

});

// Login User
exports.loginUser = catchAsyncErrors(async (req,res,next)=>{
    const {email,password} =req.body

    // checking for email and password

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password",400))
    }

    const user =await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }

   sendToken(user,200,res)

})


// Logout User

exports.logout = catchAsyncErrors(async(req,res,next)=>{
  if(!req.cookies.token){
    return next(new ErrorHandler("Cookie missing",401))
  }
  res.clearCookie("token")
  // res.cookie("token",req.cookies.token,{
  //   expires:new Date(Date.now()),
  //   httpOnly:true,
  //   secure:true,
  //   path:"/"
  // })
  res.status(200).json({
    success:true,
    message:"Logged Out"
  })
  res.end()
})

// Forgot Password

exports.forgotPassword = catchAsyncErrors(async (req,res,next)=>{
  const user = await User.findOne({email:req.body.email})

   if(!user){
    return next(new ErrorHandler("User not found",404))
   }
   const resetToken =  user.getResetPasswordToken()

   await user.save({validateBeforeSave:false})

   const resetPasswordUrl = `${req.protocol}://${req.get("host")}/reset_password/${resetToken}`
  // const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset_password/${resetToken}`
  
   const message = `Your password reset link :- \n\n ${resetPasswordUrl} \n\nClick on this link to set New Password for your Ecommerce Account. \n\nIf you have not requested this email then please ignore it.`
   
   try {
    await sendEmail({
      email:user.email,
      subject:`Ecommerce Password Recovery`,
      message
    })
    res.status(200).json({
      success:true,
      message:`Email sent to ${user.email} successfully. Please also check your "Spam Folder"`
    })
   } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
   await user.save({validateBeforeSave:false})
return next( new ErrorHandler(error.message,500))
   }
})

// Reset Password

exports.resetPassword = catchAsyncErrors(async (req,res,next)=>{

  //  Creating token hash
  const  resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt: Date.now()}
  })

  if(!user){
    return next(new ErrorHandler("Reset Password Token is invalid or has been expired",400))
   }

   if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler("Password and Confirm Password are different.",400))
   }
   
   user.password = req.body.password
   user.resetPasswordExpire= undefined
   user.resetPasswordToken= undefined
   
   await user.save()
   sendToken(user,200,res)
})

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.user.id)
  if(!user){
    return next(new ErrorHandler("User not found",401))
}
  res.status(200).json({
    success:true,
    user
  })
})

// Update User Password 
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.user.id).select("+password")

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

  if(!isPasswordMatched){
    return next(new ErrorHandler("Old password is incorrect",400))
  }

  if(req.body.newPassword!==req.body.confirmPassword){
    return next(new ErrorHandler("Password and Confirm Password are different.",400))
  }

  user.password = req.body.newPassword

  await user.save()

  sendToken(user,200,res)
})


// Update User Profile 
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
const newUserData = {
  name:req.body.name,
  email:req.body.email
}

if(req.body.avatar !== ""){
  const user = await User.findById(req.user.id)
  const imageId = user.avatar.public_id
  await cloudinary.v2.uploader.destroy(imageId)

  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width:500,
    crop: "scale"
  })

  newUserData.avatar = {
    public_id:  myCloud.public_id ,
      url: myCloud.secure_url,
  }
}

const user =await User.findByIdAndUpdate(req.user.id,newUserData,{
  new:true,
  runValidators:true,
  userFindAndModify:false
})

res.status(200).json({
  success:true
})

})

// Get all Users
exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{
  const users  = await User.find()
  res.status(200).json({
    success:true,
    users

  })
})
// Get single User
exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.params.id)
  if(!user){
    return next(new ErrorHandler(`No such user found with Id: ${req.params.id}`))
   }


  res.status(200).json({
    success:true,
    user

  })
})

// Update User Role -- ADMIN
exports.updateRole = catchAsyncErrors(async(req,res,next)=>{
  let user =await User.findById(req.params.id)
  if(!user){
    return next(new ErrorHandler(`No such user found with Id: ${req.params.id}`))
   }
  const newUserData = {
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  }

//  To avoid Role Change of Owner
  if(req.params.id === process.env.OWNER_ID && req.body.role === "User"){
    return next(new ErrorHandler(`Owner role cannot be updated`))
   }
   user =await User.findByIdAndUpdate(req.params.id,newUserData,{
    new:true,
    runValidators:true,
    userFindAndModify:false
  })
 
   
  res.status(200).json({
    success:true,
    user
  })
  
  })
// Delete User -- ADMIN
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
  const user =await User.findById(req.params.id)
  if(!user){
    return next(new ErrorHandler(`No such user found with Id: ${req.params.id}`))
   }

//  To avoid deletion of Owner
if(req.params.id === process.env.OWNER_ID){
  return next(new ErrorHandler(`Owner cannot be deleted`))
 }
   const imageId = user.avatar.public_id
   await cloudinary.v2.uploader.destroy(imageId)
   await user.deleteOne()
  
  res.status(200).json({
    success:true,
    message:"User Deleted Successfully"
  })
  
  })


