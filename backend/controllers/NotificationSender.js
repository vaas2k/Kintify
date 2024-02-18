const FOLLOW = require('../Schemas/following');
const NOTIFICATION = require('../Schemas/notifiactions');


const notification = {

    async Post_Notification(req, res, next) {


        const { SenderID, Message, SenderName, } = req.body;
        console.log(req.body);
        try {
            let follow = await FOLLOW.findOne({ userID: SenderID });
            for (let i = 0; i < follow.followers.length; i++) {
                const follower = follow.followers[i];
                console.log(follower);
                await NOTIFICATION.updateOne(
                    { username: follower.Username },
                    { $push: { notification: { SenderID: SenderID, SenderName: SenderName, Message: Message } } }
                )
            }

        } catch (error) {
            return next(error);
        }
        return res.status(200).json({ sucess: true });

    },
    async Notification(req, res, next) {

        const { ID, Name, Message, username, type, post_id, photo } = req.body;

        try {
            const getnotif = await NOTIFICATION.findOne({ username: username });

            if (type === 'follow') {
                await getnotif.updateOne(
                    { $push: { notification: { SenderID: ID, SenderName: Name, Message: Message, photo: photo } } }
                );
            }
            else if (type === 'liked' || 'comment') {
                await getnotif.updateOne(
                    { $push: { notification: { SenderID: ID, SenderName: Name, Message: Message, on_post: post_id, photo: photo } } }
                );
            }
        } catch (error) {
            return next(error);
        }
        return res.status(200).json({ sucess: true });
    },
    async get_notifications(req, res, next) {

        const { id } = req.params;
        console.log(id);
        let notis;
        try {
            notis = await NOTIFICATION.findOne({ username: id });
        } catch (error) {
            console.log(error);
            return next(error);
        }
        if (notis) { notis.notification.reverse(); }
        return res.status(200).json({ notis });
    },
    async update_notifications(req, res, next) {
        const { username, notification } = req.body;
        try {
            for (let i = 0; i < notification.length; i++) {
                const {_id , is_seen } = notification[i];
                const fnu = await NOTIFICATION.findOneAndUpdate(
                    {username : username,'notification._id' : _id},
                    {$set : {'notification.$.is_seen' : true}}
                );
            }
        } catch (error) {
            return next(error);
        }
        return res.status(200).json({ success: true });
    }
    
    
}


module.exports = notification;