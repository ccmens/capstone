import bannerImg from '../asset/banner.jpg';
import React from 'react';
import './BannerSection.css';

export default function BannerSection ({color,title, subTitle})
 { 
    return (
        <section>
            <div style={{ backgroundImage: `url(${bannerImg})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                textAlign: 'center'
                }}>

                <div className="banner-section" style={{minHeight: '500px'}}>
                    <div className="text-center justify-content-center align-self-center">
                        <h1 style={{color: color}}>{title}</h1>
                        <h5>{subTitle}</h5>
                    </div>
                </div>
            </div>
        </section>
    )
}