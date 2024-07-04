import  * as Yup from 'yup'

export const SignUpSchema = Yup.object({
    name: Yup.string().required("Enter your name").min(2,"Name connot be this short"),
    email: Yup.string().email().required("Please enter Your email..."),
    password : Yup.string().required("Please enter your password").min(8, "Password must be atleast 8 characters long"),
    confirmPassword:  Yup.string().required().oneOf([Yup.ref("password"), null] , "Password must match"),
   
});
