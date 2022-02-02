import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import AuthBox from './AuthBox';
import Header from './Header';

const Layout = () => {
  const { fetchingUser } = useGlobalContext();

  return fetchingUser ? (
    <div className='loading'>
      <h1>Page is loading...</h1>
    </div>
  ) : (
    <Router>
      <Header />

      <Routes>
        <Route exact path='/' element={<AuthBox />} />
        <Route exact path='/register' element={<AuthBox register />} />
      </Routes>
    </Router>
  );
};

export default Layout;
