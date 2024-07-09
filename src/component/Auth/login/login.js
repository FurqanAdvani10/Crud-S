import React, { useRef } from 'react';
import { Button, Input } from 'antd';
import { Form, Formik } from 'formik';
import { LoginSchema } from './schemaLogin';
import './login.css';
import '../signup/signup.css';
import { useAuth, useNavigation } from '../../../utils/method';

const Login = () => {
    const {handleForget  , handleSignup } = useNavigation();
    
    const { login } = useAuth()

    const formRef = useRef();

    const initialValues = {
        email: '',
        password: '',
    };
   
    
    return (
        <div className='allParent'>
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={LoginSchema}
                onSubmit={(val) => login(val)}
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
                                <h2 className='textSign' onClick={ () => handleForget('/Forget')}>Forget Password?</h2>
                                <h2 className='textSign' onClick={ ()  => handleSignup('/')}>Din't have an account <span className='ahgda'> Sign Up</span>?</h2>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Login;
