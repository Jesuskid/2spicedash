import React, { useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import { Link } from 'react-router-dom'

const Verify = () => {

    const { user, Moralis } = useMoralis()

    const logout = async () => {
        await Moralis.User.logOut()
        window.location.reload()
    }


    return (
        <div className='d-flex justify-content-center' style={{ background: 'white' }}>
            <div className='card-o p-4 my-5'>
                <h3>Please Verify your email</h3>
                <small>You're just one step away!!!</small>
                <p >Email verification link was sent to <span style={{ color: 'blue' }}>{user.get('email')}</span></p>
                {user?.get('emailVerified')}
                <a href={window.location.origin} onClick={() => window.location.replace(window.location.origin)}>I have verified my email</a><br />
                <a className='py-2' onClick={logout} href='#'>Wrong email</a>
            </div>
        </div>
    )
}

export default Verify