import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useMoralis } from 'react-moralis'
import { Row, Col, Container } from 'react-bootstrap'
import './Auth.css'
import { ethers } from 'ethers'
import { Wallet } from 'react-bootstrap-icons'
import AES from 'crypto-js/aes'
import enc from 'crypto-js/enc-utf8'
import ResetPassword from './ResetPassword'
import { registerOnMainSite, loginMainWebsite } from './AuthFunctions'

const Auth = () => {


    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [walletpin, setWalletpin] = useState('')
    const [password, setPassword] = useState('')
    const [loginPage, setLoginPage] = useState(true)
    const [resetPage, setResetPage] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const [passwordErrors, setPasswordErrors] = useState(<></>)


    const { authenticate, isInitialized, isAuthenticated, Moralis } = useMoralis();

    const up = async () => {
        if (runPinChecks() == false) {
            return
        }
        if (checkPass(password) == false) {
            setPasswordErrors(
                <div className='d-flex flex-column align-items-start justify-content-start'>
                    <span>Password must be made up of</span>
                    <span>-Eigth characters</span>
                    <span>-One Uppercase letter</span>
                    <span>-One special character</span>
                </div>

            )
            return
        } else {
            setPasswordErrors(<></>)
        }

        if (!isEmail(email)) { setError("Invalid email Address"); return; }

        setLoading(true)
        const new_wallet = ethers.Wallet.createRandom()
        let key = new_wallet.privateKey
        let encrypted = AES.encrypt(key.toString(), walletpin)


        // console.log(kilo2)

        console.log(isInitialized)
        const user = new Moralis.User()
        user.set('username', username)
        user.set('email', email)
        user.set('password', password)
        user.set('gem_balance', 0)
        user.set('gen_account', new_wallet.address)
        user.set('gen_private_key', encrypted.toString())


        try {
            await user.signUp().then(async () => {
                registerOnMainSite(email, username, password);
            }).then(async () => {
                console.log('success')
                // await Moralis.User.requestEmailVerification(email).then(() => {
                //     setLoading(false)
                //     window.location.reload()
                // })
                await Moralis.Cloud.run('requestEmailVerify').then(() => {
                    setLoading(false)
                    window.location.reload()
                })
            })


        } catch (err) {
            console.log(err)
            if (err) {
                setError(err.toString())
            } else {
                setError('Hmm, there seems to be an error signing up')
            }
            setLoading(false)
        }
    }



    const login = async () => {
        if (!isEmail(email)) { setError("Invalid email Address"); return; }

        setLoading(true)
        try {
            await Moralis.User.logIn(email, password).then(async () => {
                const res = await loginMainWebsite(email, password).then(() => {

                })
                //
                // alert(res)
                // if (res) {
                //     window.location.reload()
                // }

            }).catch((err) => {
                console.log(err)
                setError('Wrong username or passowrd')
            })
            setLoading(false)
        } catch (err) {
            setError('Wrong username or passowrd')
            alert('Wrong username or passowrd')
            setLoading(false)
        }
    }

    const logout = async () => {
        Moralis.User.logOut().then(() => {
            const currentUser = Moralis.User.current();  // this will now be null
        });
        console.log('logged out')
    }

    function isEmail(email) {
        var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(String(email).toLowerCase());
    }

    function checkPass(pw) {
        // (?=(?:[^a-z]*[a-z]){1})
        var regx = /^(?=(?:[^A-Z]*[A-Z]){1})(?=(?:\D*\d){0})(?=(?:[^!@#$%^&*)(]*[!@#$%^&*)(]){1}).{8,}$/;
        return regx.test(pw);
    }





    const runPinChecks = () => {
        let regExp = /^\d+$/;
        console.log(walletpin)
        if (walletpin.length != 6) {
            console.log(walletpin.length)
            console.log(regExp.test(walletpin))
            setError("wallet pin must be six digits")
            return false
        }
        else if (regExp.test(walletpin) == false) {
            setError("wallet pin must made up of digits (0  to 9)")
            return false
        } else {
            console.log('passed checks')
            return true
        }

    }
    const isLogin = useLocation()




    useEffect(() => {
        if (isLogin.state != null) {
            setLoginPage(isLogin.state)
        }
    }, [])





    return (
        <div className='main-auth' style={{ height: '100%', minHeight: '100vh' }}>
            <div className='section'>
                <div>
                    <h2 className='py-5 head'>2Spice Ecosystem</h2>
                </div>
                <Container>
                    <Row className=''>

                        <Col md={6}>
                            <div className='d-flex align-items-start justify-content-start flex-column'>
                                <h3 className='text-white'>JOIN AND EARN SPICE!</h3>
                                <div className='d-flex align-items-start justify-content-start mt-4 flex-column px-2'>
                                    <h6 className='py-2 gold-text'>✅ PLAY GAMES</h6>
                                    <h6 className='py-2 gold-text'>✅ MULTIPLY YOUR SPICE</h6>
                                    <h6 className='py-2 gold-text'>✅ PARTICIPATE AND EARN</h6>
                                    <h6 className='py-2 gold-text'>✅ SELL YOUR CREATIVITY</h6>
                                </div>
                                <Button className='red-btn large-btn w-75 my-3'>JOIN NOW</Button>
                            </div>
                        </Col>
                        <Col md={6} className='login justify-content-center py-4 align-items-center flex-column d-flex'>
                            <div className=' w-100' >


                                {loginPage == true && !resetPage && (<form className='w-100 px-3'>
                                    <h3>Login to your Account</h3>
                                    <input placeholder='Email' className='form-control my-3' type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <input placeholder='Password' className='form-control my-3' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />

                                    {loading == false ? <Button className='w-100 red-btn' onClick={login}>Login</Button> :
                                        <Button className='w-100 my-2 red-btn'>
                                            <div class="spinner-border text-light" role="status">
                                                <span className="sr-only"></span></div></Button>
                                    }
                                    <br />
                                    <a className='my-5 a mx-4' onClick={() => { setLoginPage(false); setResetPage(false) }}>Not Yet Registered</a>
                                    <a className='my-5 a' onClick={() => { setLoginPage(false); setResetPage(true) }}>Reset Password</a>
                                </form>)
                                }
                                {
                                    loginPage == false && !resetPage && (
                                        <form className='p-3'>
                                            <h3>Sign Up</h3>
                                            <input className='form-control my-3' type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                                            <input className='form-control my-3' type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                                            <input className='form-control my-3' type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <p style={{ color: 'red' }}>
                                                {passwordErrors}
                                            </p>
                                            <input className='form-control my-3' type='text' placeholder='Wallet Key (Please enter a six digit pin)' value={walletpin} onChange={(e) => setWalletpin(e.target.value)} />
                                            <small>For the safety of your account your Wallet pin is not stored on any server, please keep this Walletpin safe as you would require it to access your account generated wallet</small>
                                            {!loading ? <Button className='w-100 my-2 red-btn' onClick={up}>SignUp</Button> :
                                                <Button className='w-100 my-2 red-btn'>
                                                    <div class="spinner-border text-light" role="status">
                                                        <span className="sr-only"></span></div></Button>}
                                            <a className='my-2 a' onClick={() => { setLoginPage(true); setResetPage(false) }}>Log in</a>
                                        </form>)}
                                {
                                    resetPage && (
                                        <>
                                            <ResetPassword />
                                            <a className='my-2 a' onClick={() => { setLoginPage(false); setResetPage(false) }}>Log in</a>
                                        </>
                                    )
                                }

                            </div>
                            <p style={{ color: 'red' }}>{error}</p>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default Auth