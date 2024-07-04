import  * as Yup from 'yup'



export const LoginSchema = Yup.object({
    email: Yup.string().email("Enter a valid email").required("Please Enter Your Email..."),
    password : Yup.string().required("Please Enter Your Password").min(8, "Password must be atleast 8 characters long"),
   
});
