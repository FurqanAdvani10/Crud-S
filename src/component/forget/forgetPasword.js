import React, { useRef, useState } from 'react';
import { Button, Input, Modal, Table } from 'antd';
import { Form, Formik } from 'formik';
import { ForgetSchema } from './forgetSchema';
import { useNavigate } from 'react-router-dom';
import '../login/login.css'
import '../signup/signup.css'
const Forget = () => {
    const formRef = useRef();
    const [tableData, setTableData] = useState([]);
    const [open, setOpen] = useState(false);



    const initialValues = {
        email: '',
        password: '',
    };

    const handleSubmit = (values) => {
        setTableData([...tableData, values]);
        setOpen(false);
        formRef.current.resetForm();

    };

    // const navigate = useNavigate()

    // const handleForget=() =>{
    //   navigate('/Forget')
    // }

    return (
        <div className='allParent'>
        <Formik
            innerRef={formRef}
            initialValues={initialValues}
            validationSchema={ForgetSchema}
            onSubmit={handleSubmit}
        >
            {({ values, errors, touched, handleChange, handleSubmit, resetForm }) => (
                <Form onSubmit={handleSubmit} className='mainform'>
                    <div className='parentDiv'>
                        <div className='mainDiv '>
                            <h1 className='head'>Forget Password</h1>
                           
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
                                <Input
                                    className='inputFields'
                                    id='text'
                                    type='password'
                                    name='password'
                                    placeholder='reset password'
                                    value={values.password}
                                    onChange={handleChange}
                                />

                                {errors.password && touched.password && <p className="p_msg">{errors.password}</p>}
                            </div>
                            <div>
                                <Input
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
                            <Button className='sumbitBtn' type="primary" htmlType="submit">Submit</Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
        </div>
    );
};

export default Forget;
