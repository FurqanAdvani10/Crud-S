import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';


const SubCategory = () => {
    const [tableData, setTableData] = useState([]);
    const [open, setOpen] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const q = query(collection(db, 'subcategory'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ ...doc.data(), key: doc.id }));
            setTableData(data);
        };

        fetchData();
    }, []);

    const saveData = async (values) => {
        console.log(values);
        const docRef = await addDoc(collection(db, 'subcategory'), { ...values, images: values.images || [] });
        const newRow = { ...values, key: docRef.id, images: values.images || [] };
        const updatedTableData = [...tableData, newRow];
        setTableData(updatedTableData);

        setOpen(false);
        formRef.current.resetForm();
    };

  return (
    <div>
      
    </div>
  )
}

export default SubCategory
