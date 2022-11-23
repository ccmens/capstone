import './App.css';
import React, {useEffect, useState,Fragment} from 'react';
import {Route, Routes, useNavigate,Router} from 'react-router-dom';
import Home from './pages/home/Home';
import LoginV2 from './pages/user/LoginV2';
import {message} from 'antd';
import {inactive, login, logout, profile, register, tokenLogin as tokenLoginAPI} from '@services/api.service';
import ErrorPage403 from './ErrorPage403';
import ErrorPage404 from './ErrorPage404';
import ErrorPage500 from './ErrorPage500';
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import UserList from "./pages/user/User";
import Category from "./pages/category/Category";
import Role from "./pages/role/Role";
import Sales from "./pages/sales/Sales";
import Profile from "./pages/user/Profile";
import TitleComponent from "./components/TitleComponent";
import ConfirmComponent from "./components/ConfirmComponent";
import RegisterV2 from "./pages/user/RegisterV2";
import Item from "./pages/item/Item";
import Report from "./pages/Report/Report";
import AuthRoute from './routes/AuthRoute';

function App() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isTokenLogin, setIsTokenLogin] = useState(false);

    const removeUserinfo = () => {
        setUser(null);
        localStorage.removeItem('userinfo');
    }

    const handleAction = async (action, id, params) => {
        try {
            let result = null;
            if (action === 'login') {
                result = await login(params);
                setUser(result.data);
                localStorage.setItem('userinfo', JSON.stringify(result.data));
                navigate('/');
            } else if (action === 'token') {
                result = await tokenLoginAPI(params);
                console.log(result);
                if (result) {
                    setUser(result.data);
                } else {
                    removeUserinfo();
                }
            } else if (action === 'register') {
                result = await register(params);
            } else if (action === 'logout') {
                result = await logout(params);
                removeUserinfo();
                navigate('/');
            } else if (action === 'profile') {
                result = await profile(id, params);
            } else if (action === 'inactive') {
                result = await inactive(id, params);
                message.success('Inactive account success');
                removeUserinfo();
                navigate('/');
            }
            // console.log('handleAction', result);
            return true;
        } catch (error) {
            const text = `handle action is error: ${error?.data?.message || 'please try again'}`;
            console.log(text);
            message.error(text);
            return false;
        }
    }

    useEffect(() => {
        async function tokenLogin() {
            const userinfo = localStorage.getItem('userinfo');
            if (userinfo) {
                await handleAction('token', null, JSON.parse(userinfo));
                setIsTokenLogin(true);
            } else {
                setIsTokenLogin(true);
            }
        }

        tokenLogin();
    }, []);

    const handleLogout = () => {
        ConfirmComponent(async () => {
            await handleAction('logout', user?._id, user)
        }, 'Are you sure logout?', 'Logout Confirm')
    }

    return (
        <>
            <TitleComponent user={user} isTokenLogin={isTokenLogin}/>
            <Navbar user={user} handleLogout={handleLogout}/>

        <Routes>
                 <Route path="/" element={<Home user={user}/>}/>
                <Route path="/login" element={<LoginV2 handleAction={handleAction}/>}/>
                <Route path="/register" element={<RegisterV2 handleAction={handleAction}/>}/>
                <Route exact path="/items" element={<AuthRoute><Item user={user}/></AuthRoute>} />
                <Route path="/userlist" element={<AuthRoute> <UserList user={user}/></AuthRoute>} />
                <Route path="/category" element={<AuthRoute> <Category user={user}/> </AuthRoute>}/>
                <Route path="/sales" element={<AuthRoute><Sales user={user}/></AuthRoute>}/>
                <Route path="/rolelist" element={<AuthRoute><Role user={user}/></AuthRoute>}/>
                <Route path="/report" element={<AuthRoute><Report user={user}/></AuthRoute>}/>
                <Route path="/profile" element={<AuthRoute><Profile user={user} handleAction={handleAction}/></AuthRoute>}/>
                <Route path="/error403" element={<ErrorPage403/>}/>
                <Route path="/error404" element={<ErrorPage404/>}/>
                <Route path="/error500" element={<ErrorPage500/>}/>
            </Routes>
            <Footer/>
        </>
    );
}

export default App;
