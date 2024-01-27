import { useParams } from "react-router-dom";
import sp from "./singlePost.module.css";


const SinglePost = () => {

    const params = useParams();
    return(
        <div className={sp.SinglePost}>
            Single Post
            {params}
        </div>
    );
}

export default SinglePost;