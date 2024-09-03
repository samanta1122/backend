import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js";
import {User} from '../models/user.models.js'
import { uploadResultLocal } from '../utils/cloudinary.js'
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler (async(req,res)=>{
    // get user details
    // validation=-not empty
    // check if user already exists
    // checks images and avatar
    // upload them to cloudinary
    // create user object-create entry in db
    // remove password and refresh token
    // check user response
    // return response


    // return res.status(200).json({
    //     message: "ok"
    // })

    const {fullname, username, email} = req.body
    console.log("email:",email);
    if(
        [fullname,username,email,password].some((field)=>
        field?.trim() === "")
    ){
        throw new apiError(400,"fullname is required")
    }

    const existedUser = User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new apiError(409,"username or email already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new apiError(400,"avatar not found")
    }

    const  avatar = await uploadResultLocal(avatarLocalPath);
    const coverImage = await uploadResultLocal(coverImageLocalPath);

    if(!avatar){
        throw new apiError(400,"avatar not found")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    ) //if user has created than id will be dispalyed n mongodb

    if(!createdUser){
        throw new apiError(500,"Something went wrong")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully")
    )
})

export { registerUser }