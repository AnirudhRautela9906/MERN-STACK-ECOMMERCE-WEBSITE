import React from 'react'
import playStore from '../../../images/Google-Play.png'
import appStore from '../../../images/App-Store.png'
import './Footer.css'


const footer = () => {
  return (
<footer id='footer'>
<div className="leftFooter">
    <h4>DOWNLOAD OUR APP</h4>
    <p>Download App for Android and IOS mobile phone</p>
    <img src={playStore} alt="playStore" />
    <img src={appStore} alt="appStore" />
</div>
<div className="midFooter">
    <h1>ECOMMERCE WEBSITE</h1>
    <p>High Quality is our first priority</p>
    <p>Copyright 2023 &copy; Anirudh Rautela</p>
</div>
<div className="rightFooter">
    <h4>Follow Us</h4>
    <a href="#0">Instagram</a>
    <a href="#0">Youtube</a>
    <a href="#0">Facebook</a>
</div>
</footer>
    )
}

export default footer