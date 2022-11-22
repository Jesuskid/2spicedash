import React from 'react'
import { Button } from 'react-bootstrap'
import { useMoralis } from 'react-moralis'
import { logoutOnMian } from './AuthFunctions'
const Logout = () => {
    const { Moralis } = useMoralis()

    const logout = async () => {
        if (window.confirm('Are you sure you want to logout')) {
            logoutOnMian()
            await Moralis.User.logOut()
            window.location.assign(window.location.origin)
        }

    }
    return (
        <div>
            <div style={{ height: '100vh', background: 'white' }} className='d-flex w-100 align-items-center flex-column justify-content-center'>
                <Button onClick={logout}>Logout From all Sites</Button>
            </div>
        </div>
    )
}

export default Logout