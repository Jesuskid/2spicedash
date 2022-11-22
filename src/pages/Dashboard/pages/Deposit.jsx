import React, { useState, useContext } from 'react'
import '../Dashboard.css'
import { Row, Col, Button, Table, Card, Modal, Form, InputGroup, Spinner } from 'react-bootstrap'
import Icon from './meta'
import spiceLogo from '../../../assets/spice.png'
import metamaskLogo from '../../../assets/metamask.png'
import { useWeb3Contract, useMoralisQuery, useMoralis } from 'react-moralis'
import { REWARD_CONTRACT_ABI, REWARD_CONTRACT_ADDRESS, SPICE_ABI, BINANCE_RPC, SPICE_CONTRACT_ADDRESS } from '../../../Constants'
import { GemContext } from '../../../GemContext'
import { ethers } from 'ethers'
import AES from 'crypto-js/aes'
import enc from 'crypto-js/enc-utf8'

window.ethersProvider = new ethers.providers.StaticJsonRpcProvider(BINANCE_RPC)

const TableItem = ({ coin, tID, amt, date, status }) => {

    return (
        <Row>
            <Col>{coin}</Col>
            <Col>{tID}</Col>
            <Col>{amt}</Col>
            <Col>{date}</Col>
            <Col>{status}</Col>

        </Row>
    )
}



const Deposit = () => {
    const [depositAmt, setDepositAmt] = useState(0)
    const [deposits, setDeposits] = useState([])
    const [showDeposit, setShowDeposit] = useState(false)
    const [showDepositInternal, setShowDepositInternal] = useState(false)
    const [loading, setLoading] = useState(false);
    const { state, update } = useContext(GemContext)
    const { Moralis, authenticate, enableWeb3, isWeb3Enabled, user, account, web3EnableError } = useMoralis()
    const [key, setKey] = useState('')




    const send_gems = async (gemsWon) => {
        try {
            const User = Moralis.Object.extend('_User')
            const query = new Moralis.Query(User)
            const myDetails = await query.first()
            const prevBalance = myDetails?.get('gem_balance')
            let balance = gemsWon + parseFloat(prevBalance)
            myDetails?.set('gem_balance', balance)
            myDetails?.save()
            update({ gems: (state.gems + gemsWon) })
            return gemsWon + prevBalance
        } catch (err) {
            return
        }
    }


    const depositSpice = async () => {
        await auth()

        setLoading(true)
        let amount = ethers.utils.parseUnits(depositAmt, "ether")
        let maxUint = ethers.constants.MaxInt256


        const allowanceFunc = {
            abi: SPICE_ABI,
            contractAddress: SPICE_CONTRACT_ADDRESS,
            functionName: 'allowance',
            params: {
                owner: account,
                spender: REWARD_CONTRACT_ADDRESS,

            }
        }


        let email = user.get('email')

        const approveSpice = {
            abi: SPICE_ABI,
            contractAddress: SPICE_CONTRACT_ADDRESS,
            functionName: 'approve',
            params: {
                spender: REWARD_CONTRACT_ADDRESS,
                amount: maxUint
            }
        }


        const options = {
            abi: REWARD_CONTRACT_ABI,
            contractAddress: REWARD_CONTRACT_ADDRESS,
            functionName: 'deposit',
            params: {
                _spice: amount,
                email: email
            }

        }

        const tokenValue = await Moralis.executeFunction(allowanceFunc)
        console.log(tokenValue)

        if (amount > tokenValue) {
            const approveTransfer = await Moralis.executeFunction(approveSpice)
            await approveTransfer.wait()
        }


        try {
            const deposit = await Moralis.executeFunction(options)
            alert(`Deposit successful: ${depositAmt} Spice has been added to your coin balance`)
            send_gems(parseFloat(depositAmt))
            setLoading(false)
            setShowDeposit(false)
            setDepositAmt(0)
            setKey('')
        } catch (err) {
            alert(`Deposit Faield: ${err.data.message}`)
            setLoading(false)
        }



    }

    const depositSpiceInternal = async (key) => {
        let amount = ethers.utils.parseUnits(depositAmt, "ether")
        let approval = ethers.utils.parseUnits('10000000', "ether")


        let email = user.get('email')

        console.log('started')
        //get amount
        //deposit

        let private_key_hash = AES.decrypt(user.get('gen_private_key'), key)
        let private_key = private_key_hash.toString(enc)

        let wallet = new ethers.Wallet(ethers.utils.hexlify(private_key))
        let walletSigner = wallet.connect(window.ethersProvider)

        window.ethersProvider.getGasPrice().then(async () => {
            setLoading(true)
            //define th contract
            const contract = new ethers.Contract(SPICE_CONTRACT_ADDRESS, SPICE_ABI, walletSigner)
            const rewardContract = new ethers.Contract(REWARD_CONTRACT_ADDRESS, REWARD_CONTRACT_ABI, walletSigner)

            let allowance = contract.allowance(user.get('gen_account'), SPICE_CONTRACT_ADDRESS)

            let balance = await contract.balanceOf(user.get('gen_account'))
            let data = ethers.utils.formatEther(balance)
            console.log(balance)
            if (balance < amount) {
                alert(`Error: deposit amount of ${depositAmt} exceeds balance of ${ethers.utils.formatEther(balance)}`)
                setLoading(false)
                setShowDepositInternal(false)
                return

            }

            if (allowance < amount) {
                const approve = await contract.approve(REWARD_CONTRACT_ADDRESS, ethers.constants.MaxUint256).then((res) => {
                    console.dir(res)
                }).catch((err) => {
                    setLoading(false)
                })
            }

            const deposit = await rewardContract.deposit(amount, email).then((e) => {
                alert(`Deposit successful: ${depositAmt} Spice has been added to your coin balance`)
                send_gems(parseFloat(depositAmt))
                setLoading(false)
            }).catch((err) => {
                console.log(err.message.slice(0, 41))
                alert(`Error: Deposit failed ${err.message.slice(0, 41)}`)
                setLoading(false)
            })
            setShowDepositInternal(false)
            setDepositAmt(0)
            setKey('')

        })

        // setShowDepositInternal(false)

    }



    const auth = async () => {
        if (isWeb3Enabled) {
            setShowDeposit(true)
        } else {
            const isInstalled = await Moralis.isMetaMaskInstalled()
            if (isInstalled) {
                console.log(isInstalled)
                await enableWeb3()
                setShowDeposit(true)
            } else {
                await Moralis.enableWeb3({ provider: "walletconnect" });
                setShowDeposit(true)
            }
        }
    }


    return (
        <div className='w-100 py-4'>
            <div className='d-flex justify-content-start align-items-start flex-column'>
                <h4>Deposit:</h4>
            </div>
            <Row className='my-4'>
                <Col md={6} className='px-3 my-2'>
                    <div className='card-o  pb-3'>
                        <p className='py-2 px-3 d-flex justify-content-start align-items-start border-btm'>SPICE</p>
                        <div className='px-3'>
                            <img width='150' src={metamaskLogo} />
                            <Button onClick={() => { auth() }} className='w-100'>Deposit with Metamask</Button>
                        </div>
                    </div>
                </Col>
                <Col md={6} className='my-2'>
                    <div className='card-o  pb-3'>
                        <p className='py-2 px-3 d-flex justify-content-start align-items-start border-btm'>
                            2Spice <span className='fs-6'> (SPICE)</span></p>
                        <div className='px-3 d-flex justify-content-center align-items-center flex-column'>
                            <img width='150' src={spiceLogo} />
                            <Button onClick={() => setShowDepositInternal(true)} className='w-100'>Deposit with wallet</Button>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* deposit modal */}
            <Modal
                size="md"
                show={showDeposit}
                onHide={() => setShowDeposit(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >

                <Modal.Header closeButton>
                    <Modal.Title className=''>Deposit Spice</Modal.Title>
                </Modal.Header>
                <Modal.Body >

                    <div className='justify-content-center align-items-center d-flex flex-column'>


                        <InputGroup className='justify-content-center align-items-center'>
                            <InputGroup.Text >amount</InputGroup.Text>
                            <Form.Control
                                placeholder="0.01"
                                aria-label="0.01"
                                aria-describedby="basic-addon1"
                                type='number'
                                onChange={(e) => setDepositAmt(e.target.value)}
                            />

                        </InputGroup>

                        <div className='d-flex align-items-start w-100 flex-row my-4'>
                            {depositAmt > 0 ? !loading ? <Button onClick={depositSpice} className='mx-1 w-100'>Deposit Spice</Button> : <Button onClick={depositSpice} className='mx-1 w-100'><div className="spinner-border text-light" role="status">
                                <span className="sr-only"></span>
                            </div></Button>
                                : <Button disabled onClick={depositSpice} className='mx-1 w-100'>Deposit Spice</Button>}

                        </div>

                    </div>

                </Modal.Body>

            </Modal>

            {/* deposit modal */}
            <Modal
                size="md"
                show={showDepositInternal}
                onHide={() => setShowDepositInternal(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >

                <Modal.Header closeButton>
                    <Modal.Title className=''>Deposit Spice</Modal.Title>
                </Modal.Header>
                <Modal.Body >

                    <div className='justify-content-center align-items-center d-flex flex-column'>


                        <InputGroup className='justify-content-center align-items-center'>
                            <InputGroup.Text >amount</InputGroup.Text>
                            <Form.Control
                                placeholder="0.01"
                                aria-label="0.01"
                                aria-describedby=""
                                type='number'
                                onChange={(e) => setDepositAmt(e.target.value)}
                            />

                        </InputGroup>

                        <InputGroup className='mt-3'>
                            <Form.Control
                                placeholder="Enter your Wallet PIN'"
                                aria-label=""
                                type='password'
                                onChange={(e) => setKey(e.target.value)}
                            />
                        </InputGroup>

                        <div className='d-flex align-items-start w-100 flex-row my-4'>
                            {depositAmt > 0 ? loading == true ? <Button className='mx-1 w-100'><div className="spinner-border text-light" role="status">
                                <span className="sr-only"></span>
                            </div></Button> : <Button onClick={() => depositSpiceInternal(key)} className='mx-1 w-100'>Deposit Spice</Button>
                                : <Button disabled className='mx-1 w-100'>Deposit Spice</Button>}

                        </div>

                    </div>

                </Modal.Body>

            </Modal>


            <div className='my-5'>
                <h4 className='d-flex align-items-start py-2'>Deposits Made:</h4>
                <Card className='header-body'>
                    <Card.Header className='header-dark rounded-top'>
                        <Row>
                            <Col>Coin</Col>
                            <Col>Transaction ID</Col>
                            <Col>Amount</Col>
                            <Col>Datetime</Col>
                            <Col>Status</Col>

                        </Row>
                    </Card.Header>
                    <Card.Body>
                        {deposits.length > 0 ? deposits.map((item) => {

                        }) : 'No deposits have been made yet'}
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default Deposit