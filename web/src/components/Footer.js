import './Footer.css'
import React from 'react'

export default function Footer() {
    return (
        <footer>
            <div className="footer-one">
                &copy; Copyright 2022 & Capstone Project
            </div>
            <div className="footer-two">
                <a href="http://varosc.net/"><img src="/images/logo.jpg" width={40} /></a>
                <a href="https://www.etsy.com/shop/VariableOscillations"><img src="/images/etsy.jpg" width={70} /></a>
                <a href="https://www.instagram.com/var.osc/"><img src="/images/insta.png" width={35} /></a>
            </div>
        </footer>
    )
}
