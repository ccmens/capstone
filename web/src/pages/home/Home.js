import React from "react";
import './Home.css'
import BannerSection from "../../components/BannerSection";
import { Dashboad } from '../../components/DashBoard';
import contents from './DashBoard';
import { Stacked } from "../../components/Charts/Stacked";
// import { Bar, state } from '../../components/Charts/BarChart';
// import { Linechart } from "../../components/Charts/LineChart";

export default function Home({user}) {
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
                <Stacked width="320px" height="360px" />
            </div>
        </>
    );
}
