import React, { useRef, useState } from 'react';
import { Button, Input } from 'antd';
import { Form, Formik } from 'formik';
import { LoginSchema } from './schemaLogin';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import '../login/login.css';
import '../signup/signup.css';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const formRef = useRef();
    const navigate = useNavigate();

    const initialValues = {
        email: '',
        password: '',
    };

    const handleForget = () => {
        navigate('/Forget');
    };

    const handleSignup = () => {
        navigate('/');
    };

   
    const login = async (values) => {
        try {
            const auth = getAuth();  
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
            console.log('User signed in:', user);
            navigate('/Product');
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error signing in:', errorCode, errorMessage);
            alert('Invalid username or password.');
        }
    };


    
    return (
        <div className='allParent'>
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={LoginSchema}
                onSubmit={login}
            >
                {({ values, errors, touched, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit} className='mainform'>
                        <div className='parentDiv'>
                            <div className='mainDiv '>
                                <h1 className='head'>Login</h1>
                                <div>
                                    <Input
                                        className='inputFields'
                                        id='text'
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
                                        id='text'
                                        type='password'
                                        name='password'
                                        placeholder='Password'
                                        value={values.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && touched.password && <p className="p_msg">{errors.password}</p>}
                                </div>
                                <Button className='sumbitBtn' type="primary" htmlType="submit">Submit</Button>
                                <h2 className='textSign' onClick={handleForget}>Forget Password?</h2>
                                <h2 className='textSign' onClick={handleSignup}>Din't have an account <span className='ahgda'> Sign Up</span>?</h2>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Login;
