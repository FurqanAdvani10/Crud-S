// Product.js
import React, { useRef, useState, useEffect } from 'react';
import { Button, Image, Table } from 'antd';
import '../crud/product.css';
import { useNavigate } from 'react-router-dom';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import ProductModal from './productModal';
import ProductUpdateModal from './updateModal';
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Category from "../categories/categories"
const { Header, Sider, Content } = Layout;

const Product = () => {
    const formRef = useRef();
    const [tableData, setTableData] = useState([]);
    const [open, setOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const columns = [
        {
            title: 'Images', dataIndex: 'images', key: 'images', render: images => (
                Array.isArray(images) ? images.map((src, index) => (
                    <Image key={index} width={50} src={src} />
                )) : null
            )
        },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        { title: 'Description', dataIndex: 'description', key: 'description' },

        {
            title: (
                <div>
                    <Button type="primary" onClick={() => setOpen(true)}>
                        Add Product
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
                        setEditingItem(record);
                        setUpdateModalOpen(true);
                    }}>
                        <EditOutlined style={{ fontSize: '20px' }} />
                    </Button>
                </>
            ),
        }
    ];

    const initialValues = {
        title: '',
        quantity: '',
        price: '',
        description: '',
        images: [],
    };

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
    

    useEffect(() => {
        // Fetch initial data from Firestore
        const fetchData = async () => {
            const q = query(collection(db, 'tableData'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ ...doc.data(), key: doc.id }));
            setTableData(data);
        };

        fetchData();
    }, []);

    const saveData = async (values) => {
        console.log(values);
        if (editingItem) {
            console.log(editingItem, "asdyasgy")
            const docRef = doc(db, 'tableData', editingItem.key);
            await updateDoc(docRef, { ...values, images: values.images || [] });
            const updatedTableData = tableData.map(item =>
                item.key === editingItem.key ? { ...item, ...values, images: values.images || [] } : item
            );
            setTableData(updatedTableData);
            setEditingItem(null);
        } else {
            console.log("safsfa")
            const docRef = await addDoc(collection(db, 'tableData'), { ...values, images: values.images || [] });
            const newRow = { ...values, key: docRef.id, images: values.images || [] };
            const updatedTableData = [...tableData, newRow];
            setTableData(updatedTableData);
        }
        setOpen(false);
        setUpdateModalOpen(false);
        formRef.current.resetForm();
    };

    const resetRow = async (key) => {
        const docRef = doc(db, 'tableData', key);
        await deleteDoc(docRef);
        const updatedTableData = tableData.filter(row => row.key !== key);
        setTableData(updatedTableData);
    };

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        { key: '1', label: 'Products', onClick: () => onClickMenuItem('/Product'), icon: <UserOutlined /> },
                        {key: '2', label: 'Category', onClick: () => Categorie("/category")},
                        { key: '3', label: 'Sign out', onClick: () => logOut('/Login') },

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
                        <Table className='productTable' columns={columns} dataSource={tableData} />
                        <ProductModal
                            open={open}
                            onClose={() => setOpen(false)}
                            onSave={saveData}
                            initialValues={initialValues}
                            formRef={formRef}
                        />
                        <ProductUpdateModal
                            open={updateModalOpen}
                            onClose={() => {
                                setEditingItem(null);
                                setUpdateModalOpen(false);
                            }}
                            onSave={saveData}
                            initialValues={editingItem || initialValues}
                            formRef={formRef}
                        />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Product;
