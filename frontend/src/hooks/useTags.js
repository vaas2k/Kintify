import { useEffect } from "react"
import { useSelector } from "react-redux";
import { update_user_suggestions } from "../api/internal";


const useTags = async () => {
    const user_id = useSelector((state) => { return state.user._id; })

    const sendReq = async () => {

        const liked_tags = JSON.parse(window.sessionStorage.getItem('Liked-tags'));
        const post_clicked_tags = JSON.parse(window.sessionStorage.getItem('Post-Saw-tags'));

        const words = [...liked_tags, ...post_clicked_tags];

        let CommenTags = [];
        let newmap = new Map(); // for tracking visited elements
        for (let i = 0; i < words.length; i++) {

            if (newmap.has(words[i])) {

                let val = newmap.get(words[i]);
                val++;
                if (val == 2) {
                    CommenTags.push(words[i]);
                }
                newmap.set(words[i], val);
                continue;
            }

            newmap.set(words[i], 1);
        }

        const data = {
            id: user_id,
            tags: CommenTags
        }

        let responce;
        try {
            responce = await update_user_suggestions(data);
        } catch (error) {
            return error;
        }
    }
    useEffect(() => {

        window.addEventListener('beforeunload', sendReq);

        return () => { window.removeEventListener('beforeunload', sendReq) }
    }, [user_id]);
}

/*
["meme","blind","cj","sanandreas","gta","meme","nigga","black","cute","naruto","nigga","money","black"]

[ 1  2  3  4  5  6  7  8  9  10]
[                              ]
*/

export default useTags;