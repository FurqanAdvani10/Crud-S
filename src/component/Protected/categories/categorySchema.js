import *  as Yup from 'yup'



export const CategorySchema = Yup.object({
    name: Yup.string()
    .required("Please Enter Your Name")
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name can be up to 50 characters long"),
    // images: Yup.string().required("Please Enter Image URL").url("Image must be a valid URL")
    // images: Yup.array().required("Please enter at least one image URL")
}); 