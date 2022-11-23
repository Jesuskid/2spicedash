import React, { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import logo from '../../assets/spice.png'
const VerifyRequest = () => {
    const [state, setState] = useState('Verifying...')
    const [failed, setFailed] = useState(false)
    const { Moralis, user } = useMoralis()

    const verify = async () => {
        let link = window.location.href
        const Request = Moralis.Object.extend('VerificationRequests')
        const query = new Moralis.Query(Request)

        query.equalTo('link', link)
        const result = await query.first()

        const now = new Date()


        const nowUTC = new Date(now.toUTCString())
        const exdate = new Date(result.get('expires_at'))



        if (result.get('expired') == false && +exdate > +nowUTC) {
            const params = { 'linkUrl': link, 'env': 'live' }
            await Moralis.Cloud.run('verifyEmailV2', params).then(async () => {
                await Moralis.User.current()?.fetch()
                alert('email successfully verified')
                window.location.assign(window.location.origin)
            }).catch((err) => {
                console.log(err)
            })
        } else {
            alert('Invalid Request Link')
            setState('Invalid Request Link')
            setFailed(true)
        }
    }

    const req = async () => {
        const Request = Moralis.Object.extend('VerificationRequests')
        const query = new Moralis.Query(Request)
        query.addDescending('createdAt')
        const result = await query.first()
        const now = new Date()


        const nowUTC = new Date(now.toUTCString())
        const exdate = new Date(result.get('expires_at'))

        if (result.get('expired') == false && +exdate < +nowUTC) {
            await Moralis.Cloud.run('requestEmailVerify').then(() => {
            })
        } else {
            alert('Please check your email/spam folder for a verification link')
        }
        // alert(`new link sent to ${user.get('email')}`)
        setFailed(false)
    }


    useEffect(() => {
        verify()
    }, [])

    return (
        <div className='verifying' style={{ background: 'white' }}>
            <div className='my-5'>
                <img width='120px' src={logo} alt='spice Logo' />
                <h2>{state}</h2>
                {failed && <div><a onClick={req} href='#'>Request New Link</a><br /></div>}
            </div>
        </div>
    )
}

export default VerifyRequest