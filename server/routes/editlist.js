const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const List = require("../models/list.js");
const verify = require("./verify.js");
const mongoose = require("mongoose");

router.post('/', verify, async (req, res) => {
    //modify videos in list
    if(req.body.videos.length > 0) {
        try {
            // (if you know better way, please tell me :)
            for(i = 0; i < req.body.videos.length; i++) {
                await List.findByIdAndUpdate(req.body.list, {$pull: {videos: {id: req.body.videos[i].id}}}, {safe: true});
                await List.findByIdAndUpdate(req.body.list, {$push: {videos: req.body.videos[i]}}, {safe: true, upsert: true});
            }
            res.send("success");
        } catch(error) {
            res.send(error);
        }
    }
    //modify list name
    try {
        await List.findOneAndUpdate({_id: req.body.list, owner: req.user.id}, {
            name: req.body.name
        });
        //send details
        res.send("success");
    } catch(error) {
        res.send(error);
    }
});

module.exports = router;