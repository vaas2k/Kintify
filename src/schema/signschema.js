import * as yup from 'yup'

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const erroMessage = "use lowercase, uppercase and digits";

const signschema = yup.object().shape({
    name : yup.string().max(30).min(4).required("name is required"),
    username : yup.string().max(30).min(4).required("username is required"),
    email : yup.string().email('Enter a valid email').required('email required'),
    password : yup.string().matches(passwordPattern, {message : erroMessage}).required('password required'),
    confirm_password : yup.string().oneOf([yup.ref("password")], "passwords must match").required('password required')
})

export default signschema;