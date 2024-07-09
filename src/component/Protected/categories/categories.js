import React, { useRef, useState, useEffect } from 'react';
import { Button, Image, Table } from 'antd';
import '../crud/product.css';
import { useNavigate } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import ProductModal from './categoryModal';
import CategoryUpdate from "./cateUpdate";
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import SubCategoryModal from './subCategoryModal';
import { subCatResetRow, useNavigation } from '../../../utils/method';
import SubCateUpdateModal from '../categories/subCateUpate';
import { db } from '../../../firebaseConfig';

const { Header, Sider, Content } = Layout;

const Categories = () => {
  const { logOut, categorie, onClickMenuItem } = useNavigation();

  const initialValues = {
    name: "",
    images: [],
  };

  const formRef = useRef();
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoroyOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [sub, setSub] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [SubCateUpdeModal, setSubCateUpdeModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();

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
            setEditingItem(record);
            setUpdateModalOpen(true);
          }}>
            <EditOutlined style={{ fontSize: '20px' }} />
          </Button>
        </>
      ),
    },
    {
      title: (
        <div>
          <Button type="primary" onClick={(record) => setCategoroyOpen(record)}>
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
            setSubCateUpdeModal(true);
            setSub(record);
          }}>
            <EditOutlined style={{ fontSize: '20px' }} />
          </Button>
        </>
      ),
    }
  ];

  const fetchData = async () => {
    const q = query(collection(db, 'category'));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ ...doc.data(), key: doc.id }));
    setTableData(data);
    get(data.map(item => item.key));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetRow = async (key) => {
    const docRef = doc(db, 'category', key);
    await deleteDoc(docRef);
    fetchData();
  };

  const get = async (keys) => {
    for (const key of keys) {
      if (!key || typeof key !== 'string' || key.length > 500) {
        console.error("Invalid or too large key for category:", key);
        continue;
      }
      const q = query(collection(db, 'subCategory'), where("category", "==", key));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ ...doc.data(), key: doc.id }));
      setSubCategories(prevSubCategories => [
        ...prevSubCategories.filter(subCat => subCat.category !== key),
        ...data
      ]);
    }
  };

  const saveDataUpdateSub = async (values) => {
    try {
      const docRef = sub ? doc(db, 'subCategory', sub.key) : collection(db, 'subCategory');
      const saveOperation = sub
        ? updateDoc(docRef, { ...values, images: values.images || [] })
        : addDoc(docRef, { ...values, images: values.images || [], category: editingItem.key }); // Ensure subcategory is linked to a category

      await saveOperation;
      console.log(sub ? 'Document updated successfully' : 'Document added successfully');

      setSubCateUpdeModal(false);
      setSub(null);
      fetchData();
      formRef.current.resetForm();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const saveData = async (values) => {
    try {
      const docRef = editingItem ? doc(db, 'category', editingItem.key) : collection(db, 'category');
      const saveOperation = editingItem
        ? updateDoc(docRef, { ...values, images: values.images || [] })
        : addDoc(docRef, { ...values, images: values.images || [] });

      await saveOperation;
      console.log(editingItem ? 'Document updated successfully' : 'Document added successfully');

      fetchData();
      setEditingItem(null);
      setOpen(false);
      setUpdateModalOpen(false);
      formRef.current.resetForm();
    } catch (error) {
      console.error('Error saving data:', error);
    }
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
              { key: '2', label: 'Category', onClick: () => categorie("/Category") },
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
          <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG, overflow: 'auto' }}>

            <div>
              <Table
                className='productTable'
                columns={columns}
                expandable={{
                  expandedRowRender: (record) => (
                    <Table dataSource={subCategories.filter(subCat => subCat.category === record.key)} columns={column} />
                  ),
                  rowExpandable: (record) => record.name !== 'Not Expandable',
                  onExpand: (expanded, record) => expanded && get(record?.key)
                }}
                dataSource={tableData}
              />
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
                onSave={saveDataUpdateSub} // Save subcategory data
                initialValues={{ ...initialValues, category: editingItem?.key }} // Pass category ID to subcategory form
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
              <SubCateUpdateModal
                open={SubCateUpdeModal} onClose={() => { setSub(null); setSubCateUpdeModal(false); }}
                onSave={saveDataUpdateSub} initialValues={sub || initialValues}
              />
            </div>

          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Categories;
