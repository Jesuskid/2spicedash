import React, { useState, useEffect } from 'react'
import busd from '../../../assets/busd.png'
import spice from '../../../assets/spice.png'
import '../../Swap/Swap.css'
import { Row, Modal, Button } from 'react-bootstrap'
import { BINANCE_RPC, SPICE_CONTRACT_ADDRESS, BUSD_CONTRACT_ADDRESS, NETWORK, BUSD_ABI, SPICE_ABI, } from '../../../Constants';
import AES from 'crypto-js/aes'
import enc from 'crypto-js/enc-utf8'
import { useMoralis } from 'react-moralis'
import { ethers } from 'ethers'

window.ethersProvider = new ethers.providers.StaticJsonRpcProvider(BINANCE_RPC)

const Transfer = () => {

    const [showModal, setshowModal] = useState(false)
    const [showModal2, setshowModal2] = useState(false)

    const { Moralis, enableWeb3, isWeb3Enabled, user } = useMoralis()

    const [demoPrice, setDemoPrice] = useState(1); //3 spice is one busd

    const [loading, setLoading] = useState(false);

    const [token1, setToken1] = useState({ id: 'BUSD', img: busd })
    const [token2, setToken2] = useState({ id: 'SPICE', img: spice })

    const [token1Value, setToken1Value] = useState('')
    const [token2Value, setToken2Value] = useState('')

    const [transactionKey, setTransactionKey] = useState('')

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
        if (window.ethereum) {
        }
        await enableWeb3().then((e) => {
        });


    }



    const func = async () => {
        if (!isWeb3Enabled) {
            await Moralis.enableWeb3().then(async () => {
                const price = await Moralis.executeFunction({
                    contractAddress: SPICE_CONTRACT_ADDRESS,
                    functionName: "fetchPCSPrice",
                    abi: SPICE_ABI,

                })
                setDemoPrice(ethers.utils.formatEther(price))
                console.log(price)
            })
        } else {
            const price = await Moralis.executeFunction({
                contractAddress: SPICE_CONTRACT_ADDRESS,
                functionName: "fetchPCSPrice",
                abi: SPICE_ABI,

            })
            setDemoPrice(ethers.utils.formatEther(price))
        }

    }


    const swap = (
        amount, key) => {
        let private_key_hash = AES.decrypt(user.get('gen_private_key'), key)
        let private_key = private_key_hash.toString(enc)


        let wallet = new ethers.Wallet(ethers.utils.hexlify(private_key))
        let walletSigner = wallet.connect(window.ethersProvider)

        window.ethersProvider.getGasPrice().then(async (currentGasPrice) => {
            let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice))
            setLoading(true)
            const busdContract = new ethers.Contract(
                BUSD_CONTRACT_ADDRESS,
                BUSD_ABI,
                walletSigner
            )

            let contract = new ethers.Contract(
                SPICE_CONTRACT_ADDRESS,
                SPICE_ABI,
                walletSigner
            )
            let numberOfTokens = ethers.utils.parseUnits(token1Value.toString(), "ether")

            let approval = ethers.constants.MaxUint256

            console.log(token1.id)
            if (token1.id == 'BUSD') {
                console.log(token1Value)
                console.log(numberOfTokens)






                const allowance = await busdContract.allowance(user.get('gen_account'), SPICE_CONTRACT_ADDRESS)
                console.log(ethers.utils.formatEther(allowance))

                if (allowance < numberOfTokens) {
                    const approve = await busdContract.approve(SPICE_CONTRACT_ADDRESS, approval).then((res) => {
                        console.dir(res)
                    }).catch((err) => {
                        console.log(err)
                    })
                }


                await contract.purchaseFromThis(numberOfTokens).then((transferResult) => {
                    console.dir(transferResult)
                    alert("swap successful")
                    setLoading(false)
                }).catch((err) => {
                    alert("error swapping tokens")
                    console.log(err)
                    setLoading(false)
                })



            } else {
                let allowance = contract.allowance(user.get('gen_account'), SPICE_CONTRACT_ADDRESS)

                if (allowance < numberOfTokens) {
                    contract.approve(SPICE_CONTRACT_ADDRESS, ethers.constants.MaxUint256).then((res) => {
                        console.log(res)
                    }).catch((err) => {
                        console.log(err)
                    })
                }

                contract.sellToThis(numberOfTokens).then((transferResult) => {
                    console.log(transferResult)
                    alert("swap successful")
                    setLoading(false)
                }).catch((err) => {
                    alert("Error swapping tokens")
                    setLoading(false)
                })
            }
        })



    }



    useEffect(() => {
        func()
    }, [token1])

    return (
        <div className=''>
            <div className='d-flex flex-row'>
                <a href={`https://widget.onramper.com/?wallets=BNB:${user.get("gen_account")}`} target="_blank">
                    <Button variant='warning'>Buy Crypto with Fiat</Button>
                </a>
            </div>

            <div className='py-3'>
                <div className='d-flex align-items-center flex-column justify-content-center'>
                    <div className='swap px-4 py-4'>
                        <div className='mb-5 pb-3 swap-title d-flex justify-content-between'>
                            <div>
                                <h5>Exchange</h5>
                                <small>Exchange spice and busd from your internal wallet</small>
                            </div>
                            <div>
                                <small style={{ color: 'rgb(255, 108, 169)', fontWeight: '800' }}>1 SPICE</small> : <small style={{ color: 'gold', fontWeight: '800' }}>{Math.round((1 / demoPrice) * 10000) / 10000} BUSD</small>
                            </div>
                        </div>
                        <div className='d-flex flex-row w-100 info-area py-2 px-3'>
                            <input onChange={(e) => { setValues1(e) }} value={token1Value} className='special-input' placeholder='0.0'></input>
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

                        <div className='d-flex flex-row w-100 info-area my-4 py-2 px-3'>
                            <input style={{ fontSize: '16px' }} type='password' onChange={(e) => setTransactionKey(e.target.value)} className='special-input p-2' placeholder='Enter Your Walltet PIN'></input>
                        </div>

                        <div className='w-100'>
                            {token1Value > 0 ? !loading ? <Button onClick={() => swap(token1Value, transactionKey)} className='w-100 pink-embold-btn'>SWAP</Button> : <Button className='w-100 pink-embold-btn'><div class="spinner-border text-light" role="status">
                                <span className="sr-only"></span>
                            </div></Button> : <Button disabled className='w-100 pink-embold-btn'>Enter Amount</Button>}
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

        </div>
    )
}

export default Transfer