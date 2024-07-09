import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload, Modal, Button, Input } from 'antd';
import { Formik, Form } from 'formik';
import { CategorySchema } from "./categorySchema";
import "../crud/productModal.css";

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
        console.log("object")
        setFileList([]);
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
                    validationSchema={CategorySchema}
                    onSubmit={(values) => handleSave(values)}
                >
                    {({ values, errors, touched, handleChange, handleSubmit }) => (
                        <Form onSubmit={handleSubmit} className='mainform'>
                            <h1 className='modalHeadng'>Add Category</h1>
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
                                <Upload
                                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleFileListChange}
                                    onRemove={handleRemove}
                                >
                                    {fileList.length >= 3 ? null : uploadButton}
                                </Upload>
                                {errors.images && touched.images ? (<p className="p_msg">{errors.images}</p>) : null}
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
