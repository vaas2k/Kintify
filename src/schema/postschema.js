
import * as yup from 'yup'

const PostSchema = yup.object().shape({
    title : yup.string().max(40).min(5).required(),
    description : yup.string().max(250).required(),
    link : yup.string(),
    tags : yup.string().required(),
    allowcomment : yup.boolean()
})


export default PostSchema;