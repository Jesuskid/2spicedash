import React, { useEffect, useState } from 'react'
import { Button, Row, Col, Card } from 'react-bootstrap'
import { useWeb3Contract, useMoralisQuery, useMoralis } from 'react-moralis'
import { ethers } from 'ethers'
import { isEmpty } from '../../../Constants'


const Link = () => {

    const { Moralis, web3, user } = useMoralis()
    const [wallets, setWallets] = useState([])
    const [newAccount, setNewAccount] = useState('');


    const link = async () => {
        await Moralis.enableWeb3()
        let signer = web3.getSigner();
        let signature = await signer.signMessage('Connect your wallet address')
        let wallet = await signer.getAddress()
        console.log(wallet)
        await Moralis.link(wallet)
    }

    const manualLink = async () => {
        const User = Moralis.Object.extend('_User')
        const query = new Moralis.Query(User)
        const myDetails = await query.first()
        let wallet = []
        const walletA = myDetails.get('accounts')
        if (walletA) {
            wallet = walletA
        }
        if (ethers.utils.isAddress(newAccount) && !wallets.includes(newAccount)) {
            wallet.push(newAccount)
            myDetails.save('accounts', wallet)
            loadWallets()
            setNewAccount('')
        } else {
            alert('invalid address')
        }

    }

    const manualUnlink = async (address) => {
        const User = Moralis.Object.extend('_User')
        const query = new Moralis.Query(User)
        const myDetails = await query.first()
        const walletA = myDetails.get('accounts')


        if (window.confirm('Are you sure you want to delete this address') == true) {
            if (ethers.utils.isAddress(address) && wallets.includes(address)) {
                var filtered = walletA.filter(function (value, index, arr) {
                    return value != address;
                });
                myDetails.save('accounts', filtered)
                loadWallets()
                setNewAccount('')
            } else {
                alert('invalid address')
            }
        } else {

        }


    }

    const loadWallets = async () => {
        const User = Moralis.Object.extend('_User')
        const query = new Moralis.Query(User)
        const myDetails = await query.first()
        const walletA = myDetails.get('accounts')
        console.log(walletA)
        setWallets(walletA.filter(isEmpty))

    }

    useEffect(() => {
        loadWallets()
    }, [])

    return (
        <div className='d-flex align-items-start flex-column'>
            <h5 className='my-2'>Link Wallets:</h5>
            <Row className='my-2'>
                {/* <Col><input type="text" className='form-control' /></Col> */}
                <Col><input value={newAccount} onChange={(e) => setNewAccount(e.target.value)} type="text" className='form-control' /></Col>
                <Col> <Button onClick={manualLink}>Link Wallet Address</Button> </Col>
                {/* <Col> <Button onClick={link}>Link Wallet Address</Button> </Col> */}
            </Row>

            <Card className='header-body my-4 w-100'>
                <Card.Header className='header-dark rounded-top'>
                    <Row >

                        <Col className='align-items-start fs-4 d-flex'>Linked Address</Col>
                    </Row>
                </Card.Header>
                <Card.Body>



                    {wallets.length > 0 ? wallets.map((e, index) => {
                        return <div key={index} style={{ color: 'blue', fontWeight: '400' }} className='align-items-start d-flex flex-column'>
                            <div className='d-flex justify-content-between py-2 w-100 border-bottom'>
                                <small>{e}</small>
                                <Button onClick={() => manualUnlink(e)} size='sm' className='mx-5 fw-bold'>X</Button>
                            </div>
                        </div>
                    }) : ''
                    }




                </Card.Body>
            </Card>
        </div>


    )
}

export default Link