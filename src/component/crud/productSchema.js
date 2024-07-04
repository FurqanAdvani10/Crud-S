import *  as Yup from 'yup'



export const ProductSchema = Yup.object({
    title: Yup.string().required("Enter the product title"),
    quantity: Yup.string().required("Enter the product quantity"),
    price: Yup.string().required("Enter the price of the product"),
    description : Yup.string().required("Please Enter Your Password").min(25, "description must be atleast 25 characters long").max(120, "maxlenght is 120 character"),
    images: Yup.array().required("Please enter at least one image URL").default([])

}); 
