import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken, changeCurrentPassword, getCurrentUser, updateUserAccountDetails } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        } 
    ]),
    registerUser)

 router.route("/login").post(loginUser)
 //secured routes
 router.route("/logout").post(verifyJWT,logoutUser)  
 //here verifyJWT middleware will check if the user is logged in or not and then logout the user

 router.route("/refresh-token").post(refreshAccessToken)
    
 router.route("/change-password").post(verifyJWT,changeCurrentPassword)
//here verifyJWT middleware will check if the user is logged in or not and then change the password of the user

router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateUserAccountDetails)
//router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
//here verifyJWT middleware will check if the user is logged in or not and then update the avatar of the user
//router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
//here verifyJWT middleware will check if the user is logged in or not and then update the cover image of the user



export default router;