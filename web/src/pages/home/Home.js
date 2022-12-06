import React from "react";
import './Home.css'
import BannerSection from "../../components/BannerSection";
import Dashboard from "../../components/Dashboard";
const Home = ({ user }) => {

    return (
        <>
            {/*{user && user.role?.role_name === 'admin' && <AdminManageBar user={user}/>}*/}
            {/*{user && user.role?.role_name === 'user' && <UserManageBar user={user}/>}*/}
            <BannerSection title="Welcome To Variable Oscillations-Inventory MGMT" color='white' />
            {/* {user && <Dashboard user={user} />} */}
        </>
    )
}

export default Home;