import React from 'react'
import styles from '../css/Menu.module.css'
import { Link } from 'react-router-dom';

function Menu(props) {
  function sendOut(lnk) {
    window.location = lnk;
  }
  return (
    <>
      <div className={styles[props.bg]}>
        <Link to='/' className={styles.logo}></Link>
        <ul className={styles.menuCont}>
          <li className={styles.menuopn}></li>
          <li className={styles.menuHold}>
            <ul>
              <li><Link to="#"> Earn <span></span></Link></li>
              {/* <li className={styles.subMenu}><Link to="#" onClick={() => sendOut('https://2spice.link/')}>2spice Blog</Link></li> */}
              <li className={styles.subMenu}><Link to="#" onClick={() => sendOut('https://art.2spice.link/')}>2spice Art</Link></li>
              <li className={styles.subMenu}><Link to="#" onClick={() => sendOut('https://forum.2spice.link/')}>2spice Forum</Link></li>
              <li className={styles.subMenu}><Link to="#" onClick={() => sendOut('https://liftme.2spice.link/')}>2spice Fundraiser</Link></li>
              <li className={styles.subMenu}><Link to="#" onClick={() => sendOut('https://shopdigital.2spice.link/')}>2spice Shop</Link></li>
              <li className={styles.subMenu}><Link to="#" onClick={() => sendOut('https://earn.2spice.link/')}>Watch to earn</Link></li>
              <li className={styles.subMenu}><Link to="#" onClick={() => sendOut('https://art.2spice.link/')}>2spice Art</Link></li>
            </ul>
          </li>
          <li className={styles.menuHold}><Link to="#" onClick={() => sendOut('https://2spice.link/whitepaper/index.html')}>Whitepaper</Link></li>
          <li className={styles.menuHold}><Link to="#" onClick={() => sendOut('https://contractwolf.io/projects/2spice')}>Audit</Link></li>
        </ul>
      </div>
    </>
  )
}

export default Menu
