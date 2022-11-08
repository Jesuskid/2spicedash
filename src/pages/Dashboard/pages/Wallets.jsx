import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Modal, Spinner } from 'react-bootstrap'
import { useMoralisQuery, useMoralis, useMoralisWeb3Api } from 'react-moralis'
import { ethers } from "ethers";
import erc20Abi from '../../../ABIs/busd_abi.json'
import { BINANCE_RPC, SPICE_CONTRACT_ADDRESS, NETWORK, BUSD_CONTRACT_ADDRESS } from '../../../Constants';
import AES from 'crypto-js/aes'
import enc from 'crypto-js/enc-utf8'

window.ethersProvider = new ethers.providers.StaticJsonRpcProvider(BINANCE_RPC)

const Column = ({ sendToken, showAddress, balance, token, address }) => {
    return (
        <Col className='card-o mx-3 my-4 p-3'>
            <div className='d-flex justify-content-between'>
                <h5>{token}</h5>
                <small>BALANCE: </small>
            </div>

            <div className='d-flex flex-column mt-4 align-items-start'>
                <p className='my-0'>Current Balance</p>
                <h4 className='py-0'>{`${balance} ${token}`} </h4>
            </div>

            <div className='d-flex mt-4 justify-content-between'>
                <Button onClick={sendToken} variant='outline-primary' className='mr-2 w-50'>Send</Button>
                <Button onClick={showAddress} variant='outline-primary' className='mx-2 w-50'>Receive</Button>
            </div>
        </Col>
    )
}

const Wallets = () => {

    const { Moralis, user } = useMoralis()

    const { Web3API } = useMoralisWeb3Api()
    const [address, showAddress] = useState(false)
    const [revealKeyModal, showRevealKeyModal] = useState(false)
    const [send, sendToken] = useState(false)

    const [pair, sendPair] = useState('')

    const [loading, setLoading] = useState(false)

    const [currentTokenAddress, setCurrentTokenAddress] = useState('')
    const [currentToken, setCurrentToken] = useState('')

    const [currentRecTokenAddress, setCurrentRecTokenAddress] = useState('')
    const [currentRecToken, setCurrentRecToken] = useState('')



    const [bnbBalance, setBnbbalance] = useState(0)
    const [busdBalance, setBusdbalance] = useState(0)
    const [spiceBalance, setSpicebalance] = useState(0)

    //token transfers
    const [toWallet, setToWallet] = useState("")
    const [predecodedKey, setPredecodedKey] = useState("")
    const [cipher, setCipher] = useState("")
    const [sendingAmount, setSendingAmount] = useState(0)
    const [sendtokenAddress, setSendTokenAddress] = useState("")
    const [sendtokenName, setSendTokenName] = useState("")
    const [showPrivateKey, setShowPrivateKey] = useState("")
    const [pin, setPin] = useState("")

    const receive = (address, name) => {
        showAddress(true)
        setCurrentRecTokenAddress(address)
        setCurrentRecToken(name)
    }

    const revealKey = (pin) => {
        let private_key_hash = AES.decrypt(user.get("gen_private_key"), pin)
        let private_key = private_key_hash.toString(enc)
        setShowPrivateKey(private_key)
    }

    const transferToken = (
        contract_address,
        send_token_amount,
        to_address,
        send_account,
        p_key,
        key
    ) => {

        let private_key_hash = AES.decrypt(p_key, key)
        let private_key = private_key_hash.toString(enc)

        let wallet = new ethers.Wallet(ethers.utils.hexlify(private_key))
        let walletSigner = wallet.connect(window.ethersProvider)

        window.ethersProvider.getGasPrice().then((currentGasPrice) => {

            let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice))
            let gasFees = ethers.utils.hexlify(210000)

            console.log(`gas_price: ${gas_price}`)
            setLoading(true)


            if (contract_address.length >= 40) {
                // general token send

                let contract = new ethers.Contract(
                    contract_address,
                    erc20Abi['abi'],
                    walletSigner
                )

                // Numbert many tokens?
                let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 18)
                console.log(`numberOfTokens: ${numberOfTokens}`)

                alert((gas_price + numberOfTokens))



                // Send tokens
                contract.transfer(to_address, numberOfTokens).then((transferResult) => {
                    console.dir(transferResult)
                    alert(`Sent!. Transfered ${send_token_amount} to ${to_address}`)
                    sendToken(false)
                    fetchTokenBalances()
                    setLoading(false)
                }).catch((err) => {
                    alert("Token transfer Failed")
                    sendToken(false)
                    setLoading(false)
                })

            } // ether send
            else {
                if (send_token_amount > bnbBalance) {
                    setLoading(false)
                    sendToken(false)
                    throw alert("insufficient funds for gas")

                }
                const tx = {
                    from: send_account,
                    to: to_address,
                    value: ethers.utils.parseEther(send_token_amount),
                    nonce: window.ethersProvider.getTransactionCount(
                        send_account,
                        "latest"
                    ),
                    gasLimit: ethers.utils.hexlify(210000), // 100000
                    gasPrice: gas_price,
                }
                console.dir(tx)
                try {
                    walletSigner.sendTransaction(tx).then((transaction) => {
                        console.dir(transaction)
                        alert(`Send finished!. Transfered ${send_token_amount} BNB to ${to_address}`)
                        sendToken(false)
                        setLoading(false)
                        fetchEthBalances()
                    })

                } catch (error) {
                    alert("failed to send!!")
                    sendToken(false)
                    setLoading(false)
                }

            }
        })

    }

    const fetchTokenBalances = async () => {

        const spiceBalance = await Web3API.account.getTokenBalances({
            chain: NETWORK,
            address: user.get('gen_account'),
            token_addresses: SPICE_CONTRACT_ADDRESS
        })
        console.log(spiceBalance)
        if (spiceBalance.length > 0) {
            let amtSpice = ethers.utils.formatEther(spiceBalance[0]['balance'])
            setSpicebalance(Math.round(amtSpice * 1000) / 1000)
        }

        const busdBalance = await Web3API.account.getTokenBalances({
            chain: NETWORK,
            address: user.get('gen_account'),
            token_addresses: BUSD_CONTRACT_ADDRESS
        })
        if (busdBalance.length > 0) {
            let amtBusd = ethers.utils.formatEther(busdBalance[0]['balance'])
            setBusdbalance(Math.round(amtBusd * 1000) / 1000)
        }
    }

    const fetchEthBalances = async () => {
        const balance = await Web3API.account.getNativeBalance({
            chain: NETWORK,
            address: user.get('gen_account')
        })
        let bnb = ethers.utils.formatEther(balance['balance'])
        setBnbbalance(Math.round(bnb * 1000) / 1000)
    }

    const sendTokenAl = (tokenAddress, name) => {
        sendToken(true)
        setSendTokenAddress(tokenAddress)
        setSendTokenName(name)
    }

    useEffect(() => {
        setCurrentRecTokenAddress(user.get('gen_account'))
        fetchEthBalances()
        fetchTokenBalances()
    }, [])

    return (
        <div className='main-section'>
            <div className='d-flex'>
                <Button onClick={() => showRevealKeyModal(true)}>Account Details</Button>
            </div>
            <div className='my-3'>
                {/* <p>BNB would be use to pay transaction fees</p> */}
                <Row>
                    <Column sendToken={() => sendTokenAl(SPICE_CONTRACT_ADDRESS, 'SPICE')} showAddress={() => receive(SPICE_CONTRACT_ADDRESS, '2Spice(SPICE)')} balance={spiceBalance} token='SPICE' />
                    <Column sendToken={() => sendTokenAl(BUSD_CONTRACT_ADDRESS, 'BUSD')} showAddress={() => receive(BUSD_CONTRACT_ADDRESS, 'Binance USD(BUSD)')} balance={busdBalance} token='BUSD' />
                    <Column sendToken={() => sendTokenAl('', 'BNB')} showAddress={() => receive('', 'BNB')} balance={bnbBalance} token='BNB' />
                </Row>
            </div>

            <div>
                <Modal
                    size="md"
                    show={address}
                    onHide={() => showAddress(false)}
                    aria-labelledby="example-modal-sizes-title-sm"
                >

                    <Modal.Header closeButton>
                        <Modal.Title className=''>
                            <h6>Receive x</h6>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='px-0 d-flex flex-column justify-content-between pb-0'>

                        <div className='justify-content-center px-4 align-items-start d-flex flex-column'>
                            <h3>Your BEP-20 address</h3>
                            <p>Use this address to deposit {currentRecToken}:</p>
                            <p style={{ fontWeight: 'bold' }}>{user.get('gen_account')}</p>
                        </div>

                        <div className='py-5 mt-3' style={{ background: '#F3EFE7', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' }}>
                            <p className='px-4'>
                                Only send {currentRecToken} in the following network(s): BEP-20. You could lose funds from other currencies or networks.
                            </p>
                        </div>

                    </Modal.Body>

                </Modal>

                <Modal
                    size="md"
                    show={send}
                    onHide={() => sendToken(false)}
                    aria-labelledby="example-modal-sizes-title-sm"
                >
                    <Modal.Header closeButton>
                        <Modal.Title className=''>
                            <h6>Send</h6>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='d-flex flex-column justify-content-between' style={{ background: '#F5F5F5' }}>

                        <div className='card-o p-3 d-flex justify-content-between'>
                            <h5>Sending</h5>
                            <div>{sendtokenName}</div>
                        </div>

                        <div className='card-o my-3 p-3 d-flex flex-column justify-content-between'>
                            <h5>Send To</h5>
                            <div>
                                <input onChange={(e) => setToWallet(e.target.value)} style={{ border: 'none' }} className='form-control p-3' placeholder='Paste wallet address here'></input>
                            </div>
                        </div>

                        <div className='card-o my-3 d-flex flex-column justify-content-between'>
                            <div>
                                <input onChange={(e) => setSendingAmount(e.target.value)} style={{ border: 'none' }} className='form-control p-4' placeholder='Amount to Send'></input>
                            </div>
                        </div>

                        <div className='card-o my-3 d-flex flex-column justify-content-between'>
                            <div>
                                <input onChange={(e) => setCipher(e.target.value)} style={{ border: 'none' }} type='password' className='form-control p-4' placeholder='Enter Your Wallet PIN'></input>
                            </div>
                        </div>

                        <div>
                            {
                                loading == false ? <Button onClick={() => { setLoading(true); transferToken(sendtokenAddress, sendingAmount, toWallet, user.get('gen_account'), user.get('gen_private_key'), cipher) }} className='w-100 p-3'>SEND</Button> : <Button disabled className='w-100 p-3'><Spinner animation='grow' variant='light' /></Button>
                            }
                        </div>
                    </Modal.Body>

                </Modal>


                <Modal
                    size="md"
                    show={revealKeyModal}
                    onHide={() => { showRevealKeyModal(false); setShowPrivateKey("") }}
                    aria-labelledby="example-modal-sizes-title-sm"
                >

                    <Modal.Header closeButton>
                        <Modal.Title className=''>
                            <h6>Account details</h6>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='px-0 d-flex flex-column justify-content-between pb-0'>

                        <div className='justify-content-center px-4 align-items-start d-flex flex-column'>
                            <input onChange={(e) => { setPin(e.target.value) }} className='form-control' placeholder='Enter your wallet Key' />
                            <Button onClick={() => revealKey(pin)} className='w-100 my-2'>Export Account Private Key</Button>

                            <div className='my-3  p-3 warning'>
                                <p>
                                    Warning: Never disclose this key. Anyone with your private keys can steal any assets held in your account.
                                </p>
                            </div>
                        </div>




                        {showPrivateKey.length > 0 && (
                            <div className='px-3 py-2 mt-3' style={{ background: '#F3EFE7', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' }}>
                                <h6>Your private key</h6>
                                <p style={{ fontSize: '13px' }}>
                                    {showPrivateKey}
                                </p>
                            </div>

                        )}
                    </Modal.Body>

                </Modal>

            </div>
        </div>
    )
}

export default Wallets