import React, { useState, useContext } from 'react'
import { Button, Row, Col, Modal, InputGroup, Form } from 'react-bootstrap'
import { useWeb3Contract, useMoralisQuery, useMoralis } from 'react-moralis'
import { REWARD_CONTRACT_ABI, REWARD_CONTRACT_ADDRESS, } from '../../Constants'
import { GemContext } from '../../GemContext'

const Desposit = () => {
    const [showDeposit, setShowDeposit] = useState(false)
    const [showWithdraw, setShowWithdraw] = useState(false)
    const [depositAmt, setDepositAmt] = useState(0)
    const [withdrawAmt, setWithdrawAmt] = useState(0)
    const MAX_WITHDRAW_AMOUNT = 300
    const { Moralis } = useMoralis()

    const { state, update } = useContext(GemContext)

    const { runContractFunction: deposit } = useWeb3Contract({
        REWARD_CONTRACT_ABI,
        contractAddress: REWARD_CONTRACT_ADDRESS,
        functionName: 'deposit',
        params: {
            depositAmt
        }


    })

    const { runContractFunction: withdraw } = useWeb3Contract({
        REWARD_CONTRACT_ABI,
        contractAddress: REWARD_CONTRACT_ADDRESS,
        functionName: 'withdraw',
        params: {
            withdrawAmt
        }

    })


    const gems = async () => {
        const User = Moralis.Object.extend('_User')
        const query = new Moralis.Query(User)
        const myDetails = await query.first()
        const prevBalance = myDetails.get('gem_balance')
        update({ gems: prevBalance })
        return prevBalance
    }

    const deduct_gems = async (gemsUsed) => {
        const User = Moralis.Object.extend('_User')
        const query = new Moralis.Query(User)
        const myDetails = await query.first()
        const prevBalance = myDetails?.get('gem_balance')
        myDetails?.set('gem_balance', (prevBalance - gemsUsed))
        myDetails?.save()
        update({ gems: state.gems - gemsUsed })

    }

    const send_gems = async (gemsWon) => {
        try {
            const User = Moralis.Object.extend('_User')
            const query = new Moralis.Query(User)
            const myDetails = await query.first()
            const prevBalance = myDetails?.get('gem_balance')
            myDetails?.set('gem_balance', (gemsWon + prevBalance))
            myDetails?.save()
            return gemsWon + prevBalance
        } catch (err) {
            return
        }
    }

    const withdrawSpice = async () => {
        const myBalance = await gems()
        if (withdrawAmt < MAX_WITHDRAW_AMOUNT && withdrawAmt <= myBalance) {
            withdraw()
            deduct_gems(withdrawAmt)
        }
    }

    const depositSpice = () => {
        deposit()
        send_gems(depositAmt)
    }


    return (
        <div className='py-4'>
            <button onClick={() => setShowDeposit(true)} className='mx-2 my-4 green-btn'>Deposit</button>
            <button onClick={() => setShowWithdraw(true)} className='mx-2 my-4 green-btn'>Withdraw</button>

            {/* deposit modal */}
            <Modal
                size="md"
                show={showDeposit}
                onHide={() => setShowDeposit(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>

                </Modal.Header>
                <Modal.Body >

                    <div className='justify-content-center align-items-center d-flex flex-column'>
                        <Modal.Title className='mb-3'>Deposit Spice</Modal.Title>
                        <p>Verify that you're depositing to this address</p>
                        <p style={{ color: 'blue' }}>0x1032a3611DFF46cA46e744A064291cBb3dD65a0d</p>

                        <InputGroup className='justify-content-center align-items-center'>
                            <InputGroup.Text >amount</InputGroup.Text>
                            <Form.Control
                                placeholder="0.01"
                                aria-label="0.01"
                                aria-describedby="basic-addon1"
                                type='number'
                            />

                        </InputGroup>

                        <div className='d-flex flex-row my-4'>
                            <Button className='mx-1'>Deposit Spice</Button>
                            <Button className=' mx-1'>Buy Spice</Button>
                        </div>

                    </div>

                </Modal.Body>

            </Modal>

            {/* withdrawal modal */}
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
                        <Modal.Title className='mb-3'>Withdraw Spice</Modal.Title>

                        <InputGroup className='justify-content-center align-items-center'>
                            <InputGroup.Text >amount</InputGroup.Text>
                            <Form.Control
                                placeholder="0.01"
                                aria-label="0.01"
                                aria-describedby="basic-addon1"
                                type='number'
                            />

                        </InputGroup>

                        <div className='d-flex flex-row my-4'>
                            <Button className='mx-1 btn-large'>Withdraw Spice</Button>

                        </div>

                    </div>

                </Modal.Body>

            </Modal>
        </div >
    )
}

export default Desposit