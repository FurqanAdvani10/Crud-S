import { Select } from "antd"
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const renderOptions = (array = [], key = '', displayKey = '') => {
    return array?.map((obj, index) => {
        return <Select.Option key={obj[key] || index} >{obj[displayKey]}</Select.Option>
    })
}
export const subCatResetRow = async (id, catId, CB) => {
    const docRef = doc(db, 'subCategory', id); // Corrected this line
    await deleteDoc(docRef)
        .then(() => {
            CB && CB(catId);
        })
        .catch(err => {
            console.log('err', err);
        })
};
