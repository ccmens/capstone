
import React from 'react';
import { Navigate } from "react-router-dom";



export default function AuthRoute({children }) {

    if (localStorage.getItem('userinfo') == null) {
      return <Navigate to='/error403' />
    }
    return children;
  }