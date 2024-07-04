import React, { useRef, useState, useEffect, onExpand } from 'react';
import { Button, Image, Table } from 'antd';
import '../crud/product.css';
import { useNavigate } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import ProductModal from './categoryModal';
import CategoryUpdate from "./cateUpdate";
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import SubCategoryModal from './subCategoryModal';
import { subCatResetRow } from '../../utils/method';
import subCateUpdateModal from './subCateUpate';
const { Header, Sider, Content } = Layout;

const Categories = () => {
    const formRef = useRef();
    const [tableData, setTableData] = useState([]);
    const [open, setOpen] = useState(false);
    const [categoryOpen, setCategoroyOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [sub , setSub] =useState(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [SubCateUpdeModal, setSubCateUpdeModal] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [subCategories, setSubCategories] = useState([]);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // table headings
    const columns = [
        {
            title: 'Images', dataIndex: 'images', key: 'images', render: images => (
                Array.isArray(images) ? images.map((src, index) => (
                    <Image key={index} width={50} src={src} />
                )) : null
            )
        },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: (
                <div>
                    <Button type="primary" onClick={() => setOpen(true)}>
                        Add Category
                    </Button>
                </div>
            ),
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button className='Delbtn' type="primary" onClick={() => resetRow(record.key)}>
                        <DeleteOutlined style={{ fontSize: '20px' }} />
                    </Button>
                    <Button className='Delbtn' type="primary" onClick={() => {
                        // setEditingItem(record);
                        // setUpdateModalOpen(true);
                        console.log("s")
                    }}>
                        <EditOutlined style={{ fontSize: '20px' }} />
                    </Button>
                </>
            ),
        },
        {
            title: (
                <div>
                    <Button type="primary" onClick={() => setCategoroyOpen(true)}>
                        Add SubCategory
                    </Button>
                </div>
            ),
        },
    ];
    const column = [
        {
            title: 'Images', dataIndex: 'images', key: 'images', render: images => (
                Array.isArray(images) ? images.map((src, index) => (
                    <Image key={index} width={50} src={src} />
                )) : null
            )
        },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: "Action",
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button className='Delbtn' type="primary" onClick={() => subCatResetRow(record?.key, record?.category, get)}>
                        <DeleteOutlined style={{ fontSize: '20px' }} />
                    </Button>
                    <Button className='Delbtn' type="primary" onClick={() => {
                        setEditingItem(record);
                        setSubCateUpdeModal(true);
                    }}>
                        <EditOutlined style={{ fontSize: '20px' }} />
                    </Button>
                </>
            ),
        }
    ]
    const initialValues = {
        name: "",
        images: [],
    };

    // path routing  

    const navigate = useNavigate();
    const onClickMenuItem = (path) => {
        navigate(path);
    };
    const logOut = (path) => {
        navigate(path);
    }
    const Categorie = (path) => {
        navigate(path);
    }

    // run functions 
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const q = query(collection(db, 'category'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), key: doc.id }));
        setTableData(data);
    };


    const get = async (key) => {
        const q = query(collection(db, 'subCategory'), where("category", "==", key || ''));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), key: doc.id }));
        setSubCategories(data)
    }


    const saveData = async (values) => {
        try {
            if (editingItem) {
                console.log(editingItem, "editingItemfromcat");
                const docRef = doc(db, 'category', editingItem.key);
                const docSnapshot = await getDoc(docRef);
    
                if (docSnapshot.exists()) {
                    await updateDoc(docRef, { ...values, images: values.images || [] });
                    console.log('Document updated successfully');
                } else {
                    console.log('Document does not exist, creating a new one');
                    await setDoc(docRef, { ...values, images: values.images || [] });
                    console.log('Document created successfully');
                }
                fetchData();
                setEditingItem(null);
            } else {
                await addDoc(collection(db, 'category'), { ...values, images: values.images || [] });
                console.log('Document added successfully');
                fetchData();
            }
            
            setOpen(false);
            setUpdateModalOpen(false);
            formRef.current.resetForm();
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };
    

    // delete row
    const resetRow = async (key) => {
        const docRef = doc(db, 'category', key); // Corrected this line
        await deleteDoc(docRef);
        fetchData()
    };


    return (
        <div>
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="demo-logo-vertical" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        items={[
                            { key: '1', label: 'Products', onClick: () => onClickMenuItem('/Product'), icon: <UserOutlined /> },
                            { key: '2', label: 'Category', onClick: () => Categorie("/Category") },
                            { key: '3', label: 'Sign out', onClick: () => logOut('/Login') }
                        ]}
                    />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ fontSize: '16px', width: 64, height: 64 }}
                        />
                    </Header>
                    <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG, overflow: 'auto', }}> 
                        <div>
                            <Table className='productTable' columns={columns}

                                expandable={{
                                    expandedRowRender: (record) => (
                                        <Table dataSource={subCategories} columns={column} />
                                    ),
                                    rowExpandable: (record) => record.name !== 'Not Expandable',
                                    onExpand: (expanded, record) => expanded && get(record?.key)
                                }}
                                dataSource={tableData} />
                            <ProductModal
                                open={open}
                                onClose={() => setOpen(false)}
                                onSave={saveData}
                                initialValues={initialValues}
                                formRef={formRef}
                            />
                            <SubCategoryModal
                                open={categoryOpen}
                                onClose={() => setCategoroyOpen(false)}
                                onSave={saveData}
                                initialValues={initialValues}
                                formRef={formRef}
                            />
                            <CategoryUpdate
                                open={updateModalOpen}
                                onClose={() => {
                                    setEditingItem(null);
                                    setUpdateModalOpen(false);
                                }}
                                onSave={saveData}
                                initialValues={editingItem || initialValues}
                                formRef={formRef}
                            />
                            {/* <subCateUpdateModal 
                            open={SubCateUpdeModal}
                            onClose={() => {
                                setSub(null);
                                setSubCateUpdeModal(false);
                            }}
                            onSave={saveDataUpdateSub}
                            initialValues={sub || initialValues}
                            formRef={formRef} */}
                            {/* /> */}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </div>
    )
}

export default Categories
