import React, { useState, useEffect, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload, Modal, Button, Input } from 'antd';
import { Formik, Form } from 'formik';
import { CategorySchema } from "./categorySchema";
import "../crud/productModal.css";
import { Select, Space } from 'antd';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { renderOptions } from "../../utils/method";
import CategoryUpdate from "./cateUpdate"
// import Categories from './categories';

const handleChange = (value) => {
    console.log(`selected ${value}`);
};
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        console.log(file, "file")
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const SubCategoryModal = ({ open, onClose, initialValues }) => {
    const [categories, setCategories] = useState([])
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const formRef = useRef(null);
    // const [tableData, setTableData] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    // const [updateModalOpen, setUpdateModalOpen] = useState(false);

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


    useEffect(() => {
        get();
    }, []);

    const get = async () => {
        const q = query(collection(db, 'category'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), value: doc.id }));
        // console.log(data);
        setCategories(data)
    }


    // all conditions  


    const saveData = async (values) => {
        console.log("sarim")
        try {
            if (editingItem) {
                console.log(editingItem, "asdyasgy");
                const docRef = doc(db, 'subCategory', editingItem.key);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    await updateDoc(docRef, { ...values, images: values.images || [] });
                    console.log('Document updated successfully');
                } else {
                    console.log('Document does not exist, creating a new one');
                    await setDoc(docRef, { ...values, images: values.images || [] });
                    console.log('Document created successfully');
                }
                get();
                setEditingItem(null);
            } else {
                await addDoc(collection(db, 'subCategory'), { ...values, images: values.images || [] });
                console.log('Document added successfully');
                get();
            }

            setFileList([]);
            formRef.current?.resetForm();
            onClose && onClose();
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    // const saveData = async (values) => {
    //     if (editingItem) {
    //         console.log(editingItem?.key, "asdyasgy")
    //         // const docRe  f = doc(db, 'subCategory', editingItem.key);
    //         // await updateDoc(docRef, { ...values, images: values.images || [] });
    //         // get()
    //         // setEditingItem(null);
    //     } else {
    //         // await addDoc(collection(db, 'subCategory'), { ...values, images: fileList.map(file => file.url || file.thumbUrl || file.preview) });
    //         // get();
    //     }
    //     // setFileList([]);
    //     // formRef.current?.resetForm();
    //     // onClose && onClose();
    // }

    const handleRemove = (file) => {
        const newFileList = fileList.filter(item => item.uid !== file.uid);
        setFileList(newFileList);
        formRef.current.setFieldValue("images", newFileList);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );


    return (
        <>
        <div>
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
                    onSubmit={saveData}

                >
                    {({ values, errors, touched, handleChange, handleSubmit, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} className='mainform'>
                            <h1 className='modalHeadng'>Add Sub Category</h1>
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

                                <Space wrap>
                                    <Select
                                        name='category'
                                        className='inputFields'
                                        placeholder="Select"
                                        value={values.category}
                                        onChange={(val) => setFieldValue('category', val)}
                                    // options={categories}
                                    >
                                        {renderOptions(categories, "value", "name")}
                                    </Select>
                                </Space>
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
                                </Upload>
                                {errors.images && touched.images && (
                                    <p className="p_msg">{errors.images}</p>
                                )}
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
        </div>
        <div>
    </div>
    </>
    )
}

export default SubCategoryModal
