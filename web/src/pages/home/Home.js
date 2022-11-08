import React from "react";
import './Home.css'
import BannerSection from "../../components/BannerSection";
import { Dashboad } from '../../components/DashBoard';
import contents from './DashBoard';

const Home = ({user}) => {

    return (
        <>
            {/*{user && user.role?.role_name === 'admin' && <AdminManageBar user={user}/>}*/}
            {/*{user && user.role?.role_name === 'user' && <UserManageBar user={user}/>}*/}
            <BannerSection title="Welcome To Variable Oscillations-Inventory MGMT" color='white' />
            
            <div className='App'>
                {contents.map(contents => (
                    <Dashboad 
                    key={contents.id}
                    name={contents.name}
                    unitLeft={contents.unitLeft}
                    />
                ))}
            </div>
            <div>
                test Chart here
                
            </div>
        </>
    )
}

export default Home;