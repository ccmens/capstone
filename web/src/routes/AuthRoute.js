
import React, {useEffect} from 'react';
import { Navigate,Route,useLocation} from "react-router-dom";



export default function AuthRoute({children }) {
  //const {pathname} = useLocation();
  //console.log('pathname', pathname);
    if (localStorage.getItem('userinfo') == null) {
      return <Navigate to='/error403' />
    }
    return children;
  }