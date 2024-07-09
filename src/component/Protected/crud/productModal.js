import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload, Modal, Button, Input } from 'antd'; 
import { Formik, Form } from 'formik';
import { ProductSchema } from "./productSchema";
import "./productModal.css";

const { TextArea } = Input;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        console.log(file, "file")
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ProductModal = ({ open, onClose, onSave, initialValues, formRef }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (!open) {
            setFileList([]);
        }
    }, [open]);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleFileListChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        formRef.current.setFieldValue("images", newFileList);
    };

    // const handleFileListChange = ({ fileList: newFileList }) => {
    //     if (newFileList.length <= 1) {
    //         setFileList(newFileList);
    //         formRef.current.setFieldValue("images", newFileList);
    //     }
    // };

    const handleRemove = (file) => {
        const newFileList = fileList.filter(item => item.uid !== file.uid);
        setFileList(newFileList);
        formRef.current.setFieldValue("images", newFileList);
    };

    const handleSave = (values) => {
        const newValues = {
            ...values,
            images: fileList.map(file => file.url || file.thumbUrl || file.preview),
        };
        onSave(newValues);
        setFileList([]); // Clear file list after saving
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <Modal
                centered
                open={open}
                onCancel={onClose}
                footer={null}
            >
                <Formik
                    innerRef={formRef}
                    initialValues={initialValues}
                    validationSchema={ProductSchema}
                    onSubmit={handleSave} 
                >
                    {({ values, errors, touched, handleChange, handleSubmit }) => (
                        <Form onSubmit={handleSubmit} className='mainform'>
                            <h1 className='modalHeadng'>Add Product</h1> 

                            <div>
                                <Input
                                    className='inputFields'
                                    id='text' 
                                    type='text'
                                    name='title'
                                    placeholder='Title'
                                    value={values.title}
                                    onChange={handleChange}
                                />
                                {errors.title && touched.title && <p className="p_msg">{errors.title}</p>}
                            </div>
                            <div>
                                <Input
                                    className='inputFields'
                                    id='text' 
                                    type='number'
                                    name='quantity'
                                    placeholder='Quantity'
                                    value={values.quantity}
                                    onChange={handleChange}
                                />
                                {errors.quantity && touched.quantity && <p className="p_msg">{errors.quantity}</p>}
                            </div>
                            <div>
                                <Input
                                    className='inputFields'
                                    id='text' 
                                    type='number'
                                    name='price'
                                    placeholder='Price'
                                    value={values.price}
                                    onChange={handleChange}
                                />
                                {errors.price && touched.price && <p className="p_msg">{errors.price}</p>}
                            </div>
                            <div>
                                <TextArea
                                    className='textInp'
                                    rows={4}
                                    id='text' 
                                    name='description'
                                    placeholder='Description'
                                    value={values.description}
                                    onChange={handleChange}
                                />
                                {errors.description && touched.description && <p className="p_msg">{errors.description}</p>}
                            </div>
                            <div>
                                <Upload
                                    name='upload'
                                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleFileListChange}
                                    onRemove={handleRemove}
                                >
                                    {fileList.length >= 8 ? null : uploadButton}
                                {errors.images && touched.images && <p className="p_msg">{errors.images}</p>}
                                </Upload>

                                {previewImage && (
                                    <Image
                                    wrapperStyle={{ display: 'none' }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                    }}
                                    src={previewImage}
                                    />
                                )}
                            </div>
                            <Button className='submitClas' type="primary" htmlType="submit">Submit</Button> 
                        </Form>
                    )}
                </Formik>
            </Modal>
        </>
    );
}

export default ProductModal;
