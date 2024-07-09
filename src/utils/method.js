import { Select } from "antd"
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";


export const renderOptions = (array = [], key = '', displayKey = '') => {
    return array?.map((obj, index) => {
        return <Select.Option key={obj[key] || index} >{obj[displayKey]}</Select.Option>
    })
}
export const subCatResetRow = async (id, catId, CB) => {
    const docRef = doc(db, 'SubCategory', id); // Corrected this line
    await deleteDoc(docRef)
    .then(() => {
        CB && CB(catId);
    })
    .catch(err => {
        console.log('err', err);
    })
};


export const useAuth = () => {
  const navigate = useNavigate();

  const login = async (values) => {
    try {
      const auth = getAuth();  
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      console.log('User signed in:', user);
      navigate('/product');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error signing in:', errorCode, errorMessage);
      alert('Invalid username or password.');
    }
  };

  const signUp = async (values) => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: values.email,
        password: values.password,
        name: values.name,
      });
      navigate('/product');
    } catch (e) {
      console.error('Error adding document: ', e);
      alert('Failed to sign up. Please try again.');
    }
  };

  return { login, signUp };
};


export const useNavigation = () => {

  const navigate = useNavigate();

    const handleForget = (path) => {
      navigate(path);
  };
    
  const logOut = async (path) => {
    try {
      await signOut(auth);
      navigate(path);
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };
    
    const categorie = (path) => {
      navigate(path);
    };
    
    const onClickMenuItem = (path) => {
      navigate(path);
    };

    const handleSignup = (path) => {
      navigate(path);
  };
  
    return { logOut, categorie, onClickMenuItem , handleForget , handleSignup  };
  };
