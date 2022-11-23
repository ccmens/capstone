import React, {useEffect} from 'react';
import {useLocation, Navigate,useNavigate} from "react-router-dom";
import {Helmet, HelmetProvider} from 'react-helmet-async';
import {Config} from '../Config'
const TitleComponent = ({
                            user,
                            isTokenLogin
                        }) => {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    useEffect(() => {
        if (!isTokenLogin) {
            return;
        }
        console.log('pathname', pathname);
        if (Config.auth_rules.user.includes(pathname) || Config.auth_rules.admin.includes(pathname)) {
            if (!user) {
                <Navigate to='/error403'/>;
                return;
            }
            var isPass = false;
            if (Config.auth_rules.user.includes(pathname) && user.role.role_name === 'user') {
                isPass = true;
            }
            if (Config.auth_rules.admin.includes(pathname) && user.role.role_name === 'admin') {
                isPass = true;
            }
            if (!isPass) {
                <Navigate to='/error403'/>;
                return;
            }
        }
    }, [pathname]);

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{pathname !== '/' ? `${pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2)} - ${Config.appName}` : Config.appName}</title>
                </Helmet>
            </HelmetProvider>
        </>
    );
}
export default TitleComponent;