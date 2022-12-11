import React, { useState, useEffect } from 'react'
import busd from '../../assets/busd.png'
import spice from '../../assets/spice.png'
import '../Swap/Swap.css'
import { Row, Modal, Button } from 'react-bootstrap'
import { SPICE_CONTRACT_ADDRESS, SPICE_ABI, BUSD_ABI, BUSD_CONTRACT_ADDRESS, BINANCE_RPC } from '../../Constants'
import { useMoralis } from 'react-moralis'
import { ethers } from 'ethers'

window.ethersProvider = new ethers.providers.StaticJsonRpcProvider(BINANCE_RPC)

const Swap = () => {
    const maxUint = ethers.constants.MaxUint256

    const [showModal, setshowModal] = useState(false)
    const [showModal2, setshowModal2] = useState(false)

    const { Moralis, enableWeb3, isWeb3Enabled, account } = useMoralis()

    const [demoPrice, setDemoPrice] = useState(1); //3 spice is one busd

    const [loading, setLoading] = useState(false);

    const [token1, setToken1] = useState({ id: 'BUSD', img: busd })
    const [token2, setToken2] = useState({ id: 'SPICE', img: spice })

    const [token1Value, setToken1Value] = useState('')
    const [token2Value, setToken2Value] = useState('')
    const [notSvailableForSwap, setNotAvailableForSwap] = useState(true)

    const tokens = [{ id: 'BUSD', img: busd }, { id: 'SPICE', img: spice }]

    const otherToken = (selectedToken) => {
        if (tokens.indexOf(selectedToken) == 0) {
            return tokens[1]
        } else if (tokens.indexOf(selectedToken) == 1) {
            return tokens[0]
        }
    }

    const selectToken1 = (tokenSelection) => {
        setToken1(tokenSelection)
        setToken2(otherToken(tokenSelection))
        setToken1Value(0)
        setToken2Value(0)
        setshowModal(false);
    }

    const selectToken2 = (tokenSelection) => {
        setToken2(tokenSelection)
        setToken1(otherToken(tokenSelection))
        setToken1Value(0)
        setToken2Value(0)
        setshowModal2(false);
    }

    const setValues1 = (e) => {
        let val = e.target.value
        setToken1Value(val);
        if (token1.id == 'BUSD') {
            setToken2Value(val * demoPrice);
        } else {
            setToken2Value(val / demoPrice)
        }
    }

    const setValues2 = (e) => {
        let val = e.target.value
        setToken2Value(val);
        if (token2.id == 'BUSD') {
            setToken1Value(val * demoPrice);
        } else {
            setToken1Value(val / demoPrice)
        }
    }

    const auth = async () => {
        if (isWeb3Enabled) {

        } else {
            const isInstalled = await Moralis.isMetaMaskInstalled()
            if (isInstalled) {
                console.log(isInstalled)
                await enableWeb3()
            } else {
                await Moralis.enableWeb3({ provider: "walletconnect" });
                console.log('Wallet connect')
            }
        }

    }

    const swap = async () => {
        setLoading(true)
        const maxAmount = ethers.constants.MaxUint256
        console.log(maxAmount)
        try {
            if (token1.id == 'SPICE') {
                let amount = ethers.utils.parseUnits(token1Value.toString(), "ether")
                //approve
                const approveSpice = {
                    abi: SPICE_ABI,
                    contractAddress: SPICE_CONTRACT_ADDRESS,
                    functionName: 'approve',
                    params: {
                        spender: SPICE_CONTRACT_ADDRESS,
                        amount: maxAmount

                    }
                }

                const allowance = {
                    abi: SPICE_ABI,
                    contractAddress: SPICE_CONTRACT_ADDRESS,
                    functionName: 'allowance',
                    params: {
                        owner: account,
                        spender: SPICE_CONTRACT_ADDRESS
                    }
                }

                const allowanceGet = await Moralis.executeFunction(allowance)

                if (allowanceGet < amount) {
                    const approve = await Moralis.executeFunction(approveSpice)
                    await approve.wait()
                }

                const sell = {
                    abi: SPICE_ABI,
                    contractAddress: SPICE_CONTRACT_ADDRESS,
                    functionName: 'sellToThis',
                    params: {
                        spiceAmount: amount
                    }

                }

                const selling = await Moralis.executeFunction(sell)
                await selling.wait()

                //sell
                setLoading(false)
            } else {
                let amount = ethers.utils.parseUnits(token1Value.toString(), "ether")
                //buy
                const approveBusd = {
                    abi: BUSD_ABI,
                    contractAddress: BUSD_CONTRACT_ADDRESS,
                    functionName: 'approve',
                    params: {
                        spender: SPICE_CONTRACT_ADDRESS,
                        amount: maxAmount
                    }
                }

                const allowance = {
                    abi: BUSD_ABI,
                    contractAddress: BUSD_CONTRACT_ADDRESS,
                    functionName: 'allowance',
                    params: {
                        owner: account,
                        spender: SPICE_CONTRACT_ADDRESS
                    }
                }

                const allowanceGet = await Moralis.executeFunction(allowance)

                if (allowanceGet < amount) {
                    const approve = await Moralis.executeFunction(approveBusd)
                    await approve.wait()
                }

                const buy = {
                    abi: SPICE_ABI,
                    contractAddress: SPICE_CONTRACT_ADDRESS,
                    functionName: 'purchaseFromThis',
                    params: {
                        busdAmount: amount
                    }

                }

                const buying = await Moralis.executeFunction(buy)
                await buying.wait()
                setLoading(false)
            }
            setToken1Value(0)
            setToken2Value(0)
        } catch (err) {
            setLoading(false)
            setToken1Value(0)
            setToken2Value(0)
            alert('transaction failed')
        }

    }

    const getPrice = async () => {
        window.ethersProvider.getGasPrice().then(async (currentGasPrice) => {
            const provider = window.ethersProvider
            let contract = new ethers.Contract(
                SPICE_CONTRACT_ADDRESS,
                SPICE_ABI,
                provider
            )

            const price = await contract.fetchPCSPrice()
            setDemoPrice(ethers.utils.formatEther(price))
            setNotAvailableForSwap(false)

        })
    }



    useEffect(() => {
        getPrice()
    }, [token1])




    return (
        <div style={{ background: 'white', minHeight: "100vh" }}>
            <div>
            </div>
            <div style={{ background: 'white', minHeight: "100vh" }} className='d-flex align-items-center flex-column justify-content-center'>
                <div className='swap px-4 py-4'>
                    <div className='mb-5 pb-3 swap-title d-flex justify-content-between'>
                        <div>
                            <h5>Exchange</h5>
                            <small>Spice and Busd tokens</small>
                        </div>
                        <div>
                            <small style={{ color: 'rgb(255, 108, 169)', fontWeight: '800' }}>1 SPICE</small> : <small style={{ color: 'gold', fontWeight: '800' }}>{Math.round((1 / demoPrice) * 10000) / 10000} BUSD</small>
                        </div>
                    </div>
                    <div className='d-flex flex-row w-100 info-area py-2 px-3'>
                        <input disabled={notSvailableForSwap} onChange={(e) => { setValues1(e) }} value={token1Value} className='special-input' placeholder='0.0'></input>
                        <div onClick={() => setshowModal(true)}>
                            {/* <small>Balance: 0.92782</small> */}
                            <div className='d-flex currency-tab p-2 flex-row justify-content-between'>
                                <img src={token1['img']} width='30' />
                                <div className='mx-3'>{token1['id']}</div>
                            </div>
                        </div>
                    </div>

                    <div className='d-flex flex-row w-100 info-area my-4 py-2 px-3'>
                        <input disabled onChange={(e) => setValues2(e)} value={token2Value} className='special-input' placeholder='0.0'></input>
                        <div onClick={() => setshowModal2(true)}>
                            {/* <small>Balance: 0.92782</small> */}
                            <div className='d-flex currency-tab p-2 flex-row justify-content-between'>
                                <img src={token2['img']} width='30' />
                                <div className='mx-3'>{token2['id']}</div>
                            </div>
                        </div>
                    </div>

                    <div className='w-100'>
                        {isWeb3Enabled ? (token1Value > 0 ? !loading ? <Button onClick={swap} className='w-100 pink-embold-btn'>SWAP</Button> : <Button className='w-100 pink-embold-btn'><div class="spinner-border text-light" role="status">
                            <span className="sr-only"></span>
                        </div></Button> : <Button disabled className='w-100 pink-embold-btn'>Enter Amount</Button>) : (
                            <div>
                                <Button onClick={() => { auth() }} className='w-100 pink-embold-btn'>Connect Wallet</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                size="md"
                show={showModal}
                onHide={() => setshowModal(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title className='mb-3'>Select Token</Modal.Title>
                </Modal.Header>
                <Modal.Body >

                    <div className=''>

                        <div className=' my-4'>
                            {
                                tokens.map((item) => {
                                    return (

                                        <div key={'2' + item.id} onClick={() => selectToken1(item)} className='d-flex select-bar py-3 flex-row justify-content-between w-100'>
                                            <div className='d-flex flex-row'>
                                                <img src={item.img} width='30' />
                                                <div className='mx-3'>{item.id}</div>
                                            </div>
                                            {/* <div className='amt'>1000</div> */}
                                        </div>
                                    )
                                })
                            }

                        </div>

                    </div>

                </Modal.Body>

            </Modal>


            <Modal
                size="md"
                show={showModal2}
                onHide={() => setshowModal2(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title className='mb-3'>Select Token</Modal.Title>
                </Modal.Header>
                <Modal.Body >

                    <div className=''>

                        <div className=' my-4'>
                            {
                                tokens.map((item) => {
                                    return (

                                        <div key={'2' + item.id} onClick={() => selectToken2(item)} className='d-flex select-bar py-3 flex-row justify-content-between w-100'>
                                            <div className='d-flex flex-row'>
                                                <img src={item.img} width='30' />
                                                <div className='mx-3'>{item.id}</div>
                                            </div>
                                            {/* <div className='amt'>1000</div> */}
                                        </div>
                                    )
                                })
                            }

                        </div>

                    </div>

                </Modal.Body>

            </Modal>

        </div>
    )
}

export default Swap