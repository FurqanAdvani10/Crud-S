import React from 'react'
// import Categories from '../component/categories/categories'
// import Product from '../component/crud/product'
import { Route, Routes } from 'react-router-dom'
import Product from '../component/Protected/crud/product'
import Categories from '../component/Protected/categories/categories'

function Protected() {
  return (
<Routes>
    <Route index path='/category' element={<Categories/>}/>
    <Route path='/Product' element={<Product/>}/>
</Routes>
  )
}

export default Protected