import './Footer.css'
import React from 'react'

export default function Footer() {
    return (
        <footer>
            <div className="footer-one">
                &copy; Copyright 2022 & Capstone Project
            </div>
            <div className="footer-two">
            </div>
            <div className="footer-three">
            </div>
            <div className="footer-four">
                <a href="https://www.etsy.com/shop/VariableOscillations"><img src="/images/etsy.jpg" width={70} /></a>
                <a href="https://www.instagram.com/var.osc/"><img src="/images/insta.png" width={40} /></a>
            </div>
        </footer>
    )
}
