import React, { useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import { Link, Navigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import logo from '../../assets/spice.png'

const Verify = () => {

    const { user, Moralis } = useMoralis()

    const logout = async () => {
        await Moralis.User.logOut()
    }

    const logout1 = async () => {
        await Moralis.User.logOut()
        window.location.assign(`${window.location.origin}/auth`)
    }

    const req = async () => {
        await Moralis.Cloud.run('requestEmailVerify').then(() => {
            console.log('verified')
        })
    }


    useEffect(() => {
    }, [])


    return (
        <div className='d-flex justify-content-center verify-message' style={{ background: 'white' }}>

            <div className='p-4 my-5'>
                <img width="150px" src={logo} alt='spice Logo' />
                <h3>Please Verify your email</h3>
                <small>You're just one step away!!!</small>
                <p >Email verification link was sent to <span style={{ color: 'blue' }}>{user.get('email')}</span></p>
                {user?.get('emailVerified')}
                <Link to='/auth' state={true}><a className='py-2' onClick={logout1} href='#'>Wrong email</a></Link>
                <br />
                {/* <Button onClick={req}>REQUEST</Button> */}
            </div>
        </div>
    )
}

export default Verify