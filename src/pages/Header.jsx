import React, { useEffect, useState, useContext } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap'
import FreeSpice from './FreeSpice';
import Spin from './Spin/Spin';
import Roll from './Spiceroll/Roll';
import { Outlet, Link } from "react-router-dom";
import { useMoralis } from 'react-moralis';
import { GemContext } from '../GemContext';
import { logoutOnMian } from './UserAuth/AuthFunctions';
import spiceLogo from '../assets/spice.png'

const Header = () => {
    const { Moralis, user, authenticate } = useMoralis();
    const [gemBalance, setGemBalance] = useState('')
    const { state, update } = useContext(GemContext)

    const gems = async () => {
        const User = Moralis.Object.extend('_User')
        const query = new Moralis.Query(User)
        const myDetails = await query.first()
        const prevBalance = myDetails.get('gem_balance')
        update({ gems: prevBalance })
    }

    const logout = async () => {
        if (window.confirm('Are you sure you want to logout')) {
            logoutOnMian()
            await Moralis.User.logOut()
            window.location.reload()
        }
    }


    useEffect(() => {
        gems()
    }, [])
    return (
        <>
            <Navbar collapseOnSelect expand="lg" className='nav-sec' bg="dark" variant="dark">
                <Container className='nav-sec'>
                    <Navbar.Brand className='px-2' style={{ fontFamily: '', fontSize: '15px', color: '#FF6666' }}>
                        <img width='35' src={spiceLogo} /> 2spice
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse>
                        <Nav className="me-auto">
                            <Nav.Link className='text-white border-side' as={Link} to="/">DASHBOARD</Nav.Link>
                            <Nav.Link className='text-white border-side' as={Link} to="/swap">SWAP</Nav.Link>

                            <NavDropdown className='black-bg' title="Games" id="basic-nav-dropdown">
                                <NavDropdown.Item>
                                    <Nav.Link className='text-black' as={Link} to="/games/free-spice">FREE SPICE</Nav.Link>
                                </NavDropdown.Item>
                                <NavDropdown.Item>
                                    <Nav.Link className='text-black' as={Link} to="/games/roll">MULTIPLY SPICE</Nav.Link>
                                </NavDropdown.Item>
                                <NavDropdown.Item>
                                    <Nav.Link className='text-black' as={Link} to="/games/spin">SPIN</Nav.Link>
                                </NavDropdown.Item>


                            </NavDropdown>

                            {/* earn */}

                            <NavDropdown className='black-bg border-side' title="Earn" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => window.open("https://blog.2spice.link", "_blank")}>
                                    <Nav.Link className='text-black'>Blog</Nav.Link>
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => window.open("https://art.2spice.link", "_blank")}>
                                    <Nav.Link className='text-black'>Art</Nav.Link>
                                </NavDropdown.Item>

                            </NavDropdown>




                        </Nav>
                        <Nav>
                            <Nav.Link className='gold-text border-side'>💰 {Math.round(state.gems * 10000) / 10000}</Nav.Link>
                            <Nav.Link className='gold-text border-side' onClick={logout}>Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>


        </>
    )
}

export default Header