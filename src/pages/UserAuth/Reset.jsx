import { verify } from 'crypto'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useMoralis } from 'react-moralis'
import logo from '../../assets/spice.png'
import { changePass } from './AuthFunctions'

const Reset = () => {
    const [state, setState] = useState('Reset Password')
    const [failed, setFailed] = useState(false)
    const { Moralis, user } = useMoralis()
    const [newPassword, setNewPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const check = async () => {
        let link = window.location.href
        const Request = Moralis.Object.extend('PasswordResets')
        const query = new Moralis.Query(Request)

        query.equalTo('link', link)
        const result = await query.first()

        const now = new Date()

        const nowUTC = new Date(now.toUTCString())
        const exdate = new Date(result.get('expires_at'))
        //checks if link is valid
        if (result.get('expired') == false && +exdate > +nowUTC) {
            const params = { 'linkUrl': link, 'env': 'live', 'password': newPassword }
            //resets the password if all params are met
            await Moralis.Cloud.run('verifyPasswordReset', params).then(async () => {
                await changePass(result.get('email'), newPassword)
                await Moralis.User.current()?.fetch()
                alert('password reset successfully')
                window.location.assign(`${window.location.origin}/auth`)
            }).catch((err) => {
                console.log(err)
            })
        } else {
            alert('Invalid Request Link')
            setState('Invalid Request Link')
            setFailed(true)
        }
    }





    return (
        <div className='verifying' style={{ background: 'white' }}>
            <div className='my-5'>
                <img width='120px' src={logo} alt='spice Logo' />
                <h2>{state}</h2>
                {failed ? <div><a href='#'></a><br /></div> :
                    <div className='d-flex justify-content-center mt-3'>
                        <div className='w-50'>
                            <input className='form-control' onChange={(e) => { setNewPassword(e.target.value) }} />
                            {!loading ? (newPassword.length > 6 ? <Button className='w-100 my-2 red-btn' onClick={() => check()}>Reset</Button> : <Button disabled className='w-100 my-2 red-btn' >Reset</Button>) :
                                <Button className='w-100 my-2 red-btn'>
                                    <div class="spinner-border text-light" role="status">
                                        <span className="sr-only"></span></div></Button>}
                        </div>
                    </div>}
            </div>
        </div>
    )
}

export default Reset