import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/login/login';
import Signup from './component/signup/signup';
import Forget from './component/forget/forgetPasword';
import Product from './component/crud/product';
import Categories from './component/categories/categories';

function App () {
  return ( 
        <Router>
          <Routes>
            <Route  path='/Login' element={<Login />} />
            <Route index  element={<Signup />} />
            <Route path='/forget' element={<Forget />} />
            <Route path='/Product' element={<Product/>}/>
            <Route path='/category' element={<Categories/>}/>
          </Routes>
        </Router>
      );
}

      export default App;



    