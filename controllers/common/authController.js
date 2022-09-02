const User = require("../../models/userModel")
// const IceData = require("../../models/iceDataModel")

exports.registerUser = async (req,res) =>{
    try {
        const {name, user_id, email, phone } = req.user;
        const {notifToken, initialMode, loggedThru} = req.body;
        const signInProvider = req.user.firebase.sign_in_provider;
        const user = await User.findOne({ user_id: user_id })
        const lastLogin =  Date.now();
        if(user && user!==null){
            user.notifToken = notifToken;
            user.loggedThru = loggedThru;
            user.lastLogin = lastLogin;
            user.markModified('notifToken');
            user.markModified('loggedThru');
            user.markModified('lastLogin');
            await user.save()
            res.status(200).json({
                status: "success",
                message:"User Exists && Data Updated",
                user
            })
        }else{
            const newUser = new User({ loggedThru,lastLogin,name, user_id, email, phone, signInProvider, notifToken, initialMode });
            const success = await newUser.save()
            res.status(201).json({
                status: "success",
                message:"User Not Exists and Created",
                newUser
            })
        }
    } catch (e) {
        // console.log("Error from route: "+e)
        res.status(500).json({
            status: "fail",
            msg:"Internal Server Error"
        })
    }
}

exports.getUserProfile = async (req,res,next)=>{
    try {
        const user = await User.findById(req.user.user_id);
        res.status(200).json({
            status:"success",
            user
        })
    } catch (e) {
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"
        })
    }
}

exports.updateUserProfile = async (req,res,next)=>{
    try {
        const user = await User.findByIdAndUpdate(req.user.user_id, req.body,{
            new:true,
            runValidators:true
        });
        
        res.status(200).json({
            status:"success",
            user
        })
    } catch (e) {
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"

        })
    }
}

exports.deleteUser = async (req,res,next)=>{
    try {
        const {user_id}= req.params;
        const user = await User.findByIdAndDelete({user_id:user_id});
        await IceData.findByIdAndDelete({user_id : user_id});
        await IdeaData.findByIdAndDelete({user_id: user_id});
        
        res.status(200).json({
            status:"success",
            msg:"User Deleted"
        })
    } catch (e) {
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"
        })
    }
}

exports.hideIceProfile = async(req, res, next) =>{
    try {
        const modeActivated = req.query.modeActivated;

        const user = await IceData.findByIdAndUpdate(req.user.user_id, modeActivated ,{
            new:true,
            runValidators:true
        });

        if(modeActivated === false){
            sdk.deactivateUsers({uidsToDeactivate: [`${req.user.user_id}`]}, {apiKey: process.env.cometchat_api_key})
              .then(res => console.log(res))
              .catch(err => console.error(err));
        }else{
            sdk.reactivateUsers({uidsToDeactivate: [`${req.user.user_id}`]}, {apiKey: process.env.cometchat_api_key})
            .then(res => console.log(res))
            .catch(err => console.error(err));
        }
        
        res.status(500).json({
            status:"success",
            user
        })
    } catch (e) {
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"
        })
    }
}