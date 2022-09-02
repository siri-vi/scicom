const IdeaData = require('../../models/ideaDataModel')
const sdk = require('api')('@cometchat/v3#ev191hl5kwgink');

exports.getIdeaProfile = async (req,res,next)=>{
    try {
        var user_id;
        if(req.query.user_id !=null){
            user_id=req.query.user_id;
            const user = await IdeaData.findOne({user_id:user_id});
            res.status(200).json({
                status:"success",
                user
            })
        }else{
            user_id = req.user.user_id;
            const user = await IdeaData.findOne({user_id:user_id});
            res.status(200).json({
                status:"success",
                user
            })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            status:"fail",
            msg:"Internal Server Error"
        })
    }
}

exports.registerIdeaProfile = async (req,res,next)=>{
    try {
        
        const user = await IdeaData.create(req.body);
        //create user for chats
        sdk['creates-user']({
          uid: req.body.user_id,
          name: req.body.name,
          avatar: req.body.image[0].image_URL,
          role:"Idea",
          withAuthToken: false,
        }, {
            apiKey: process.env.cometchat_api_key
        })
          .then(res => console.log(res))
          .catch(err => console.error(err));
                
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
exports.updateIdeaProfile = async (req,res,next)=>{
    try {
        const user = await IdeaData.findByIdAndUpdate(req.user.user_id, req.body,{
            new:true,
            runValidators:true
        });

        if(req.body.name || req.body.image[0].image_URL){
            sdk.updateUser({name: req.body.name , avatar: req.body.image[0].image_URL}, {uid: req.user.user_id,  apiKey: process.env.cometchat_api_key})
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