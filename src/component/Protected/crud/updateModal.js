import React, { useEffect, useState } from 'react';
import { ProductSchema } from './productSchema';
import "./product.css";
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload, Modal, Button, Input } from 'antd';
import { Formik, Form } from 'formik';

const { TextArea } = Input;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ProductUpdateModal = ({ open, onClose, onSave, initialValues, formRef }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (!open) {
            setFileList([]);
        } else {
            const initialFileList = initialValues.images?.map((img, index) => ({
                uid: index,
                name: `image-${index}`,
                status: 'done',
                url: img,
            })) || [];
            setFileList(initialFileList);
        }
    }, [open, initialValues.images]);

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
        setFileList([]); // Clear file list after saving
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    useEffect(() => {
        formRef?.current?.setValues(initialValues);
    }, [initialValues, formRef]);

    return (
        <Modal
            title="Update Product"
            visible={open}
            onCancel={onClose}
            footer={null}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={ProductSchema}
                onSubmit={handleSave}
                innerRef={formRef}
            >
                {({ handleSubmit, handleChange, values }) => (
                    <Form layout="vertical" onFinish={handleSubmit}>
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
                        </div>
                        <div>
                            <TextArea
                                className='textInp'
                                id='text'
                                name='description'
                                placeholder='Description'
                                value={values.description}
                                onChange={handleChange}
                            />
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
                                beforeUpload={() => false} // Prevent auto-upload
                            >
                                {fileList.length >= 8 ? null : uploadButton}
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
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default ProductUpdateModal;
