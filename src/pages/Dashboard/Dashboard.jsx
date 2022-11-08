import React, { useContext, useState } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import './Dashboard.css'
import { GemContext } from '../../GemContext'
import { Link, Outlet } from 'react-router-dom'
import { useMoralis } from 'react-moralis'

const Dashboard = (deduct) => {
    const { state, update } = useContext(GemContext)
    const [activeBtn, setActiveBtn] = useState(1)
    const { user } = useMoralis()

    const sendBnb = async () => {

    }

    const sendErc20 = async () => {

    }

    return (
        <div className='w-100 p-5 dash-background'>
            <div className='top d-flex w-100  justify-content-between '>
                <div>
                    <h4 style={{ textTransform: 'capitalize' }}>Hi, {user.get("username")}</h4>
                </div>
                <div className='big-menu'>
                    <Link className='mxy-2' to='/overview'><Button onClick={() => setActiveBtn(1)} variant='outline-danger' className={activeBtn == 1 ? 'black-btn tab-active mx-1' : 'black-btn mx-1'}>overview</Button></Link>
                    <Link className='my-2' to='/statistics'><Button onClick={() => setActiveBtn(2)} variant='outline-danger' className={activeBtn == 2 ? 'black-btn tab-active mx-1' : 'black-btn mx-1'}>statistics</Button></Link>
                    <Link className='my-2' to='/link'><Button onClick={() => setActiveBtn(3)} variant='outline-danger' className={activeBtn == 3 ? 'black-btn tab-active mx-1' : 'black-btn mx-1'}>link address</Button></Link>
                    <Link className='my-2' to='/deposit'><Button onClick={() => setActiveBtn(4)} variant='outline-danger' className={activeBtn == 4 ? 'black-btn tab-active mx-1' : 'black-btn mx-1'}>deposit</Button></Link>
                    <Link className='my-2' to='/withdraw'><Button onClick={() => setActiveBtn(5)} variant='outline-danger' className={activeBtn == 5 ? 'black-btn tab-active mx-1' : 'black-btn mx-1'}>withdraw</Button></Link>
                    <Link className='my-2' to='/wallets-group'><Button onClick={() => setActiveBtn(6)} variant='outline-danger' className={activeBtn == 6 ? 'black-btn tab-active mx-1' : 'black-btn mx-1'}>wallets</Button></Link>

                </div>
            </div>

            <div className='mt-3 small-menu'>
                <div className='align-items-start d-flex w-100' >
                    <Link className='my-2' to='/overview'><Button onClick={() => setActiveBtn(1)} variant='outline-danger' className={activeBtn == 1 ? 'black-btn tab-active mx-1' : 'black-btn mx-1'}>overview</Button></Link>
                    <Link className='my-2' to='/statistics'><Button onClick={() => setActiveBtn(2)} variant='outline-danger' className={activeBtn == 2 ? 'black-btn tab-active mx-1' : 'black-btn mx-1'}>statistics</Button></Link>
                    <Link className='my-2' to='/withdraw'> <Button onClick={() => setActiveBtn(5)} variant='outline-danger' className={activeBtn == 5 ? 'black-btn tab-active mx-1' : 'black-btn mx-1'}>withdraw</Button></Link>
                </div>
                <div className='align-items-start d-flex w-100' >
                    <Link className='my-2' to='/link'><Button onClick={() => setActiveBtn(3)} variant='outline-danger' className={activeBtn == 3 ? 'black-btn tab-active mx-1' : 'black-btn mx-1'}>link address</Button></Link>
                    <Link className='my-2 ' to='/deposit'><Button onClick={() => setActiveBtn(4)} variant='outline-danger' className={activeBtn == 4 ? 'black-btn tab-active mx-1' : 'black-btn mx-1'}>deposit</Button></Link>
                    <Link className='my-2' to='/wallets-group'><Button onClick={() => setActiveBtn(6)} variant='outline-danger' className={activeBtn == 6 ? 'black-btn tab-active mx-1' : 'black-btn mx-1'}>wallets</Button></Link>
                </div>
            </div>


            <Outlet />

        </div>
    )
}

export default Dashboard