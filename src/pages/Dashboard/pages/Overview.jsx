import React, { useEffect, useState, useContext } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { GemContext } from '../../../GemContext'
import { useMoralisQuery, useMoralis, useMoralisWeb3Api } from 'react-moralis'
import spicelogo from '../../../assets/spice.png'
import bnb from '../../../assets/bnb.png'
import busd from '../../../assets/busd.png'
import { CurrencyDollar, Droplet, GraphUp } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import AES from 'crypto-js/aes'
import enc from 'crypto-js/enc-utf8'
import { ethers } from 'ethers'
import { SPICE_CONTRACT_ADDRESS, NETWORK, BUSD_CONTRACT_ADDRESS } from '../../../Constants'

const Overview = () => {
    const { state, update } = React.useContext(GemContext)

    const { Web3API } = useMoralisWeb3Api()

    const [gem, setGems] = useState({})
    const [earnedToday, setEarnedToday] = useState(0)
    const [payouts, setPayouts] = useState(0)
    const { user, Moralis } = useMoralis()
    const [free, setFree] = useState(0)

    const [bnbBalance, setBnbbalance] = useState(0)
    const [busdBalance, setBusdbalance] = useState(0)
    const [spiceBalance, setSpicebalance] = useState(0)


    const dateObj = new Date()
    const currentDate = dateObj.getDate()
    dateObj.setDate(currentDate - 1)

    const { fetch: fetchGems } = useMoralisQuery(
        "Gems",
        (query) => query.equalTo("email", user.get('email')).greaterThan('createdAt', dateObj),
        [],
        { autoFetch: false }
    );

    const { fetch: fetchWithdrawals } = useMoralisQuery(
        "WithdrawlRequests",
        (query) => query.equalTo("email", user.get('email')).equalTo("status", true).limit(10),
        [],
        { autoFetch: false }
    );

    const { fetch: fetchFreeSpice } = useMoralisQuery(
        "Games",
        (query) => query.equalTo("player", user.get('email')).descending('createdAt').limit(24),
        [],
        { autoFetch: false }
    );

    const fetch_free_spice = async () => {
        const results = await fetchFreeSpice();
        let freeSpice = 0
        for (let i = 0; i < results.length; i++) {
            const object = results ? results[i] : null
            const date = new Date(object.createdAt)
            if (object?.get('game_name') == 'freeSpice') {
                let gem = object?.get('amount_won')
                console.log(`Gem ${gem}`)
                freeSpice += gem
            }




        }
        setFree(freeSpice)
    }

    const fetch_payouts = async () => {
        const results = await fetchWithdrawals();
        let payouts = 0
        for (let i = 0; i < results.length; i++) {
            const object = results ? results[i] : null

            let gem = object?.get('amount')
            console.log(`Gem ${gem}`)
            payouts += gem

        }
        setPayouts(payouts)
    }



    const fetch_gems = async () => {
        const results = await fetchGems()
        let values = []
        let earned = 0;
        let lost = 0;
        let id = 0
        let gotToday = 0;
        let freeSpice = 0;
        for (let i = 0; i < results.length; i++) {
            const object = results ? results[i] : null
            const date = new Date(object.createdAt)
            if (date > dateObj) {
                let gem = object?.get('gems')
                if (gem > 0) { earned += gem }
                if (gem < 0) { lost += gem }
                values.push({
                    'id': id,
                    'date': object?.createdAt.toString().slice(0, 15),
                    'time': object?.createdAt.toString().slice(15, 28),
                    'gems': object?.get('gems'),
                })
                if (date) {
                    gotToday += gem
                }
            }

            id += 1
        }

        console.log(earned)
        setGems({ 'earned': earned, 'lost': lost, 'values': values, 'freeSpice': freeSpice })
        setEarnedToday(gotToday)

    }



    const fetchTokenBalances = async () => {

        const spiceBalance = await Web3API.account.getTokenBalances({
            chain: NETWORK,
            address: user.get('gen_account'),
            token_addresses: SPICE_CONTRACT_ADDRESS
        })
        console.log(spiceBalance)


        if (spiceBalance.length > 0) {
            let sBalance = ethers.utils.formatEther(spiceBalance[0]['balance'])
            setSpicebalance(Math.round(sBalance * 10000) / 10000)
        }

        const busdBalance = await Web3API.account.getTokenBalances({
            chain: NETWORK,
            address: user.get('gen_account'),
            token_addresses: BUSD_CONTRACT_ADDRESS
        })
        if (busdBalance.length > 0) {
            let bBalance = ethers.utils.formatEther(busdBalance[0]['balance'])
            setBusdbalance(Math.round(bBalance * 10000) / 10000)
        }
    }

    const fetchEthBalances = async () => {
        const balance = await Web3API.account.getNativeBalance({
            chain: NETWORK,
            address: user.get('gen_account')
        })
        let bnBalance = ethers.utils.formatEther(balance['balance'])
        setBnbbalance(Math.round(bnBalance * 10000) / 10000)
    }



    useEffect(() => {
        fetch_payouts()
        fetch_gems()
        fetch_free_spice()
        fetchEthBalances()
        fetchTokenBalances()
    }, [])


    return (
        <div>
            <div className='card-o my-4'>
                <p className='py-4 fw-bold'>YOU HAVE:</p>
                <Row className='px-5 pb-4 align-items-start'>
                    <Col sm={6} md={4} className='d-flex mt-2 align-items-center'>
                        <div className='p-0 m-0'>
                            <img src={spicelogo} width='80' />
                        </div>
                        <div className='d-flex flex-column align-items-start'>
                            <p>2SPICE <small>(SPICE)</small></p>
                            <h5>{spiceBalance}</h5>
                        </div>
                    </Col>
                    <Col sm={6} md={4} className='d-flex mt-2 align-items-center'>
                        <div className='p-0 m-0 mx-2'>
                            <img src={busd} width='50' />
                        </div>
                        <div className='d-flex flex-column align-items-start'>
                            <p>BUSD <small>(BUSD)</small></p>
                            <h5>{busdBalance}</h5>
                        </div>
                    </Col>
                    <Col sm={6} md={4} className='d-flex mt-2 align-items-center'>
                        <div className='p-0 mx-2'>
                            <img src={bnb} width='50' />
                        </div>
                        <div className='d-flex flex-column align-items-start'>
                            <p>BNB <small>(bnb)</small></p>
                            <h5>{bnbBalance}</h5>
                        </div>
                    </Col>
                </Row>
            </div>


            <Row>
                <Col md={8}>
                    <div className='card-o my-4'>
                        <p className='py-4 fw-bold'>STATISTICS:</p>
                        <Row className='px-5 pb-4'>
                            <Col className='d-flex my-2 align-items-center'>
                                <div className='p-2 mx-2' style={{ background: '#ADD8E6', fontWeight: 'bold', borderRadius: '5px' }}>
                                    <CurrencyDollar color='white' fontSize='25' />
                                </div>
                                <div className='d-flex flex-column align-items-start'>
                                    <small align='left'>COINS SPENT(24H)</small>
                                    <h5 className='text-grey'>{gem['lost'] && Math.abs(Math.round(gem['lost'] * 1000000) / 1000000)}</h5>
                                </div>
                            </Col>

                            <Col className='d-flex my-2  align-items-center'>
                                <div className='p-2 mx-2' style={{ background: '#Ffd0d7', fontWeight: 'bold', borderRadius: '5px' }}>
                                    <Droplet color='white' fontSize='25' />
                                </div>
                                <div className='d-flex flex-column align-items-start'>
                                    <small align='left' className='d-flex align-items-start'>COINS COLLECTED(24H)</small>
                                    <h5> {gem['earned'] && Math.round(gem['earned'] * 1000000) / 1000000}</h5>
                                </div>
                            </Col>
                            <Col className='d-flex  my-2 align-items-center'>
                                <div className='p-2 mx-2' style={{ background: '#90eea8', fontWeight: 'bold', borderRadius: '5px' }}>
                                    <GraphUp color='white' fontSize='25' />
                                </div>
                                <div className='d-flex flex-column align-items-start'>
                                    <small align='left' style={{ textAlign: 'left', direction: 'ltr' }} className=''>PAYOUTS RECEIVED</small>
                                    <h5>{payouts && (Math.round(payouts * 1000000) / 1000000).toString()}</h5>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col md={4} className='d-flex flex-column justify-content-center'>
                    <h3>{`${Math.round(free * 10000) / 10000}`}</h3>
                    <p>Free spice earned</p>
                    <Link className='w-100 px-5' to='/games/free-spice'> <Button className='w-100'>PLAY NOW</Button></Link>
                </Col>
            </Row>
        </div>
    )
}

export default Overview