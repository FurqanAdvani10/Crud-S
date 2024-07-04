import React, { useRef, useState } from 'react';
import { Button, Input, Modal, Table } from 'antd';
import { Form, Formik } from 'formik';
import { SignUpSchema } from './schema';
import './signup.css'
import { useNavigate } from 'react-router-dom';

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

    
const Signup = () => {
    const formRef = useRef();
    const [tableData, setTableData] = useState([]);
    const [open, setOpen] = useState(false);



    const initialValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    // const handleSubmit = (values) => {
    // };

    const navigate = useNavigate()

    function hanlelogin() {
        navigate('/Login')

    }
    
   
  const saveData = async (values) => {
    try {
        // Create user with email and password
        const auth = getAuth();

        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;

        // Save additional user data to Firestore
        const docRef = await addDoc(collection(db, 'users'), {
            uid: user.uid,
            email: values.email,
            password: values.password,
            name:values.name,
        });
        console.log('Document written with ID: ', docRef.id);

        navigate('/Product');

        setOpen(false);
        if (formRef.current) {
            formRef.current.resetForm();
        }
    } catch (e) {
        console.error('Error adding document: ', e);
        alert('Failed to sign up. Please try again.');
    }
};



    return (
        <div className='allParent'>
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={SignUpSchema}
                onSubmit={(values) => saveData(values)}
            >
                {({ values, errors, touched, handleChange, handleSubmit, resetForm }) => (
                    <Form onSubmit={handleSubmit} className='mainform'>
                        <div className='parentDiv'>
                            <div className='mainDiv '>
                                <h1 className='head'>Create Account</h1>
                                <div>
                                    <Input
                                        className='inputFields'
                                        id='t'
                                        type='text'
                                        name='name'
                                        placeholder='Name'
                                        value={values.name}
                                        onChange={handleChange}
                                    />
                                    {errors.name && touched.name && <p className="p_msg">{errors.name}</p>}
                                </div>
                                <div>
                                    <Input
                                        className='inputFields'
                                        id='te'
                                        type='email'
                                        name='email'
                                        placeholder='Email'
                                        value={values.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && touched.email && <p className="p_msg">{errors.email}</p>}
                                </div>
                                <div>
                                    <Input.Password 
                                        className='inputFields'
                                        id='tex'
                                        type='password'
                                        name='password'
                                        placeholder='Password'
                                        value={values.password}
                                        onChange={handleChange}
                                    />

                                    {errors.password && touched.password && <p className="p_msg">{errors.password}</p>}
                                </div>
                                <div>
                                    <Input.Password 
                                        className='inputFields'
                                        id='text'
                                        type='password'
                                        name='confirmPassword'
                                        placeholder='Confirm Password'
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    {errors.confirmPassword && touched.confirmPassword && <p className="p_msg">{errors.confirmPassword}</p>}
                                    
                                </div>
                                <Button className='sumbitBtn' type="primary" htmlType="submit" >Submit</Button>
                                <h2 className='textSign'>Already have an account? <span className='login-sign' onClick={hanlelogin}> Login </span></h2>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Signup;      