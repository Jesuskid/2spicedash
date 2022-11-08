import React, { useState, useContext, useEffect } from 'react'
import { Row, Col, Button, Card, InputGroup, Form, Modal } from 'react-bootstrap'
import spiceLogo from '../../../assets/spice.png'
import { useWeb3Contract, useMoralisQuery, useMoralis, useMoralisCloudFunction } from 'react-moralis'
import { REWARD_CONTRACT_ABI, REWARD_CONTRACT_ADDRESS, backendUrl, GetFormattedDate } from '../../../Constants'
import { GemContext } from '../../../GemContext'
import OtpInput from 'react-otp-input'
import axios from 'axios'



const Withdraw = ({ deduct_gems }) => {
    const [withdrawals, setWithdrawals] = useState([])
    const [withdrawAmt, setWithdrawAmt] = useState(0)
    const [wallets, setWallets] = useState([])
    const [showWithdraw, setShowWithdraw] = useState(false)
    const [withdrawAccount, setWithdrawAccount] = useState('')
    const [gasFees, setGasFees] = useState(0.15)
    const MAX_WITHDRAW_AMOUNT = 300


    const [otp, setOtp] = useState('');

    const handle = (otp) => setOtp(otp);


    const { Moralis, web3, user } = useMoralis()



    const { state, update } = useContext(GemContext)



    const checkWithdrawalValid = async () => {
        const User = Moralis.Object.extend('_User')
        const query = new Moralis.Query(User)
        const myDetails = await query.first()
        const myAddress = myDetails.get('accounts')
        await Moralis.enableWeb3()
        let signer = web3.getSigner();
        let signature = await signer.signMessage('Sign withdrawal request')

        let wallet = await signer.getAddress()
        console.log(myAddress, wallet)
        if (myAddress.contains(wallet.toLocaleLowerCase())) {

        } else {
            alert('wallet address is not linked to account')

        }
    }

    function isEmpty(value) {
        return value != "";
    }

    const loadWallets = async () => {
        const User = Moralis.Object.extend('_User')
        const query = new Moralis.Query(User)
        const myDetails = await query.first()
        const walletA = myDetails.get('accounts')
        let newWallets = []
        if (walletA) {
            newWallets = walletA.filter(isEmpty)
        }
        newWallets.push(user.get("gen_account"))
        console.log("wallets")
        setWallets(newWallets)
        setWithdrawAccount(newWallets[0])

    }


    // const sendOtp = () => {
    //     let options = {
    //         method: 'POST',
    //         url: `/send_otp`, //update url
    //         params: { 'email': user.get('email') }
    //     }
    //     axios.request(options).then((response) => {
    //         alert('true')
    //         setShowWithdraw(true)
    //     }).catch((err) => {
    //         console.log(err)
    //     })
    // }

    const requestOtp = async () => {
        const request = await Moralis.Cloud.run("requestOtp");
        setShowWithdraw(true)
        console.log(request)
    }

    const { fetch: fetch_withdrawals } = useMoralisQuery(
        "WithdrawRequest",
        (query) => query.equalTo("user_email", user?.get('email')).limit(20),
        [],
        { autoFetch: false }
    );

    const loadWithdrawals = async () => {
        let withdrawalArray = []

        const requests = await fetch_withdrawals()
        for (var i = 0; i < requests.length; i++) {
            let object = requests[i]
            withdrawalArray.push({
                coin: 'SPICE',
                tId: object.id.toString(),
                amt: Math.round(object.get('amount') * 1000) / 1000,
                time: GetFormattedDate(object.createdAt),
                status: object.get('status')
            })
        }
        console.log(withdrawalArray)
        setWithdrawals(withdrawalArray);
    }


    const verifyOtp = async () => {
        const OTP = Moralis.Object.extend('OTP')
        const query = new Moralis.Query('OTP')
        query.equalTo('hash_code', otp)
        const otpVal = await query.first()
        const value = otpVal.get('code')
        const expiry = otpVal.get('expires')
        const sentTo = otpVal.get('sent_to')
        const used = otpVal.get('used')
        const now = new Date()
        // const utcOffset = now.getTimezoneOffset()

        // now.setMinutes(now.getMinutes() + utcOffset)
        const nowUTC = new Date(now.toUTCString())
        const exdate = new Date(expiry)
        const fees = 0.1 + (0.005 * withdrawAmt)
        console.log(value)
        console.log(otpVal)
        if (value && sentTo == user.get('email') && used == false) {

            if (+exdate > +nowUTC) {
                //send withdraw request
                try {
                    const Withdraw = Moralis.Object.extend('WithdrawRequest')
                    const request = new Withdraw()
                    request.set('user_email', user.get('email'))
                    request.set('amount', parseFloat(withdrawAmt))
                    request.set('withdraw_address', withdrawAccount)
                    request.set('fees', fees)
                    request.save()
                    deduct_gems(withdrawAmt)
                    update({ gems: (state.gems - withdrawAmt) })

                    otpVal.set('used', true)
                    otpVal.save()
                    setShowWithdraw(false)
                    alert('Withdraw Request sent successfully')
                } catch (err) {
                    throw alert('Invalid OTP')
                }
            } else {
                throw alert('otp code has expired');
            }
        } else {
            throw alert('invalid otp code');
        }
    }

    useEffect(() => {
        loadWallets()
        loadWithdrawals()
    }, [])



    return (
        <div className='w-100 py-4'>
            <div className='d-flex justify-content-start align-items-start flex-column'>
                <h5>Withdraw:</h5>

                <div className="alert alert-primary w-100 my-2 d-flex align-items-start flex-column" role="alert">
                    <h6>Important Notice</h6>
                    <p align='left'> * Withdraw your coins collected for spice tokens</p>
                    <p align='left'> * Ensure that your wallet allows contract based intractions</p>
                    <p align='left'> * Make sure to check your email for an OTP once withdrawal is initiated to verify your transaction</p>
                </div>
            </div>

            <div>
                <Row>
                    <Col md={6} >
                        <div className='d-flex my-5 align-items-start flex-column'>
                            <h5 className='mb-4'>Withdraw :</h5>

                            <label>Coin</label>
                            <div className='w-100 my-3'>

                                <input disabled className='form-control' value='Spice' />
                            </div>
                            <label>Amount</label>
                            <div className='w-100 my-3 d-flex'>
                                <input onChange={(e) => setWithdrawAmt(e.target.value)} type='number' value={withdrawAmt} className='form-control w-75' />
                                <Button onClick={() => setWithdrawAmt(state.gems)} className='btn-l w-25'>Max</Button>
                            </div>
                            <label>Withdraw to</label>
                            <div className='w-100 my-3'>
                                <select onChange={(e) => setWithdrawAccount(e.target.value)} value={withdrawAccount} className='form-control' name="" id="">
                                    {wallets.map((item, index) => {
                                        return <option key={index} style={{ color: 'black' }} value={item}>{item == user.get('gen_account') ? `${item} (Internal Wallet)` : item}</option>
                                    })

                                    }
                                </select>
                            </div>
                            <label>Estimated Gas Fees</label>
                            <div className='w-100 my-3'>
                                <input disabled className='form-control' value={(0.002 * withdrawAmt) + 0.1} />
                            </div>


                            <div className='w-100 my-3 d-flex'>
                                {withdrawAmt <= MAX_WITHDRAW_AMOUNT && withdrawAmt > 0.11 && withdrawAmt <= state.gems ? <Button onClick={() => requestOtp()} className=' w-100'>Initiate Withdrawal for  {withdrawAmt - ((0.002 * withdrawAmt) + 0.1)} SPICE</Button> : <Button disabled className=' w-100'>{withdrawAmt > MAX_WITHDRAW_AMOUNT ? ("Exceeds maximum withdraw Amount") : withdrawAmt < ((0.002 * withdrawAmt) + 0.1) && ("Below  minimum withdraw Amount")}</Button>}
                            </div>

                        </div>
                    </Col>
                    <Col md={6} >
                        <div className=' my-5 '>
                            <img width='350' src={spiceLogo} />
                        </div>
                    </Col>

                </Row>
            </div>

            <h5 style={{ textAlign: 'left' }} className='py-3'>Withdrawals made:</h5>
            <Card className='header-body'>
                <Card.Header className='header-dark rounded-top'>
                    <Row>
                        <Col md={2}>Coin</Col>
                        <Col md={2}>Transaction ID</Col>
                        <Col md={2}>Amount</Col>
                        <Col md={2}>Datetime</Col>
                        <Col md={2}>Status</Col>

                    </Row>
                </Card.Header>
                <Card.Body>
                    {withdrawals.length > 0 ? withdrawals.map((item, index) => {
                        return <Row key={index} className='border-bottom'>
                            <Col md={2} className='align-items-center' key={index}>{item['coin']}</Col>
                            <Col md={2} key={index}>{item['tId']}</Col>
                            <Col md={2} key={index}>{item['amt']}</Col>
                            <Col md={2} key={index}>{item['time']}</Col>
                            {item['status'] == true ? <Col md={2}><Button className='btn-sm' variant='success'>Completed</Button></Col> : <Col md={2} className='py-2'><Button className='btn-sm' variant='danger'>In review</Button></Col>}
                        </Row>
                    }) : 'No withdrawals have been made yet'}
                </Card.Body>
            </Card>


            <Modal
                size="md"
                show={showWithdraw}
                onHide={() => setShowWithdraw(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>

                </Modal.Header>
                <Modal.Body >

                    <div className='justify-content-center align-items-center d-flex flex-column'>
                        <Modal.Title className='mb-3'>Enter Code</Modal.Title>
                        <div className='align-items-center d-flex'>
                            <p>An otp code has been sent to {user.get('email')} to confirm your withdrawal</p>
                        </div>
                        <InputGroup className='justify-content-center align-items-center'>


                        </InputGroup>

                        <OtpInput
                            value={otp}
                            numInputs={4}
                            onChange={handle}
                            separator={<span className='px-2'> - </span>}
                            shouldAutoFocus={true}
                            inputStyle={{ width: "40px", height: "50px", fontSize: "24px", borderRadius: "5px", border: "1px solid pink" }}
                            focusStyle={{ width: "40px", height: "50px", fontSize: "24px", borderRadius: "5px", border: "1px solid pink" }}

                        />

                        <div className='d-flex flex-row my-4'>
                            <Button onClick={() => verifyOtp()} className='mx-1 btn-large'>Withdraw Spice</Button>

                        </div>

                    </div>

                </Modal.Body>

            </Modal>

        </div >
    )
}

export default Withdraw