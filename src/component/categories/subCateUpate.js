import React, { useEffect, useState } from 'react';
import { CategorySchema } from "./categorySchema";
import "../crud/productModal.css";
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

const SubCateUpate = ({ open, onClose, onSave, initialValues, formRef }) => {
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
        <>
            <Modal
                visible={open}
                onCancel={onClose}
                footer={null}
            >
                <Formik
                    initialValues={initialValues}
                    validationSchema={CategorySchema}
                    onSubmit={handleSave}
                    innerRef={formRef}
                >
                    {({ handleSubmit, handleChange, values }) => (
                        <Form layout="vertical" onFinish={handleSubmit}>
                            <h1 className='modalHeadng'>Update Sub Category</h1>
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
                            <Button type="primary" htmlType="submit" className='saveforall'>
                                update 
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </>
    )
}

export default SubCateUpate