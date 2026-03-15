import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import Sidebar from './Layout/Sidebar';
import FormSubmit from './Pages/FormSubmit';
import FormList from './Pages/FormList';
import FormBuilder from './Pages/FormBuilder';


export default function App() {
  return (
    <Router>
        <div className="d-flex">
          <Sidebar />
          <div className="flex-grow-1 d-flex flex-column">
            <Header />
            <Routes>
            <Route path='/' element={<FormList />}></Route>
            <Route path='/formbuilder' element={<FormBuilder  />}></Route>
            <Route path="/FormList" element={<FormSubmit/>}/>
            <Route path='/users' element={<Home />}></Route>
             </Routes>
            <Footer />
          </div>
        </div>
    </Router>
  )
}