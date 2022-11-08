import React, { useState, useEffect, useContext } from 'react'
import './Spin.css'
import wheel from '../../assets/wheel.png'
import arrow from '../../assets/arrow.png'
import { Button } from 'react-bootstrap'
import { GemContext } from '../../GemContext'
import { useMoralis } from 'react-moralis'

const Spin = ({ send_gems, deduct_gems, loadGems }) => {

    const { state, update } = useContext(GemContext)
    const { Moralis, user } = useMoralis()

    const [deg, setDeg] = useState(0)
    const [counter, setCounter] = useState(0)
    const [spiner, setSpin] = useState({})
    const [win, setWin] = useState('')
    const [previousWin, setPreviousWin] = useState(0)
    const [inSpin, setInSpin] = useState(false)
    const [canPlay, setCanPlay] = useState(false)
    const [deadline, setDeadline] = useState("")
    const betAmount = 0.01
    const [timerValue, setTimerValue] = useState([])
    const [t1, setT1] = useState("")
    const [t2, setT2] = useState("")


    const userCanPlay = async () => {
        const User = Moralis.Object.extend('_User')
        const query = new Moralis.Query(User)
        const myDetails = await query.first()
        const time = myDetails.get('next_free_spin')
        const currentTime = Date()
        setT1(new Date(currentTime))
        setT2(new Date(time))

        if (new Date(currentTime) > new Date(time)) {
            setCanPlay(true)
        } else {
            setCanPlay(false)
            setDeadline(time)
        }

    }

    const setLimit = async () => {
        let date = new Date()
        var numberOfMlSeconds = date.getTime();
        var addMlSeconds = (1 * 30) * 60 * 1000;
        var newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
        console.log(newDateObj)
        setT1(date)
        setT2(newDateObj)
        const User = Moralis.Object.extend('_User')
        const query = new Moralis.Query(User)
        const myDetails = await query.first()
        myDetails.set('next_free_spin', newDateObj)
        myDetails.save()
    }

    const wins = {
        1: 0.01,
        2: 'try again',
        3: 0.005,
        4: 0.9,
        5: 'try again',
        6: 0.04,
        7: 0.07,
        8: 0.1
    }


    const spin = () => {
        // if (state.gems >= betAmount) {
        setInSpin(true)
        // deduct_gems(betAmount)
        // update({ gems: (state.gems - betAmount) })
        let dego = Math.floor(7000 + Math.random() * 7000)
        let styler = {
            transition: 'all 10s ease-out',
            transform: `rotate(${dego}deg)`,
            filter: 'blur(1.4px)'
        }
        console.log('spins')
        setSpin(styler)
        console.log(spiner)
        setDeg(dego)
        // }


    }

    const handleWin = (actualDegree) => {
        const wining = Math.ceil(actualDegree / 45)
        let amount = wins[wining]
        if (amount != 'try again') {
            send_gems(amount)
            update({ gems: (state.gems + amount) })
        }
        setWin(amount)

    }


    const endT = () => {
        const actualDeg = deg % 360;
        let styler = {
            transition: 'none',
            transform: `rotate(${actualDeg}deg)`,
            filter: 'blur(0)'
        }
        console.log('ended')
        setDeg(actualDeg)
        setSpin(styler)
        handleWin(actualDeg)
        setInSpin(false)
        setLimit()
        userCanPlay()

    }

    useEffect(() => {
        userCanPlay()
    }, [])

    useEffect(() => {

        var now = new Date().getTime()
        var m_deadline = new Date(deadline).getTime()

        let diff = m_deadline - now
        // console.log(diff + ' ' + now)

        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimerValue([hours, minutes, seconds])
        setT1(new Date())

    }, [timerValue])

    return (
        <div className='py-5'>
            <span className='arrow'></span>
            <div className='s'>
                <div className='align-items-center ' style={{ fontSize: '30px', marginBottom: '-30px', color: 'red' }}><p>▼</p></div>
                <img onTransitionEnd={endT} style={spiner} src={wheel} width='400' height='400' />
            </div>
            <div className='align-items-center py-2 justify-content-center d-flex' style={{ position: 'static' }}>
                {parseFloat(win) ?
                    <div className='result w-25 py-2 text-black my-2'>
                        {`You won +${win} SPICE!`}
                    </div> : ''
                }{
                    win == 'try again' ? <div className='result-lost py-2  w-25 text-black my-2'>
                        {`You loose -${win} SPICE!`}
                    </div> : ''
                }
            </div>
            {t1 > t2 ? (inSpin == true ? <Button disabled className='my-3 spin-btn'>SPIN</Button> : <Button onClick={spin} className='my-3 spin-btn'>SPIN</Button>) : (<div>
                <div>
                    <p>Wait for the next roll (30 minute intervals)</p>
                </div>
                <div className='d-flex flex-row align-items-center justify-content-center'>
                    <div className='timer'>{timerValue[0]}h</div>:
                    <div className='timer'>{timerValue[1]}m</div>:
                    <div className='timer'>{timerValue[2]}s</div>
                </div>
            </div>)}
        </div>
    )
}

export default Spin