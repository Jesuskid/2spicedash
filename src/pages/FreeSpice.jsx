import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col, Table, Button, Alert } from 'react-bootstrap'
import './FreeSpice.css'
import { useMoralis } from 'react-moralis'
import { GemContext } from '../GemContext'

const FreeSpice = ({ saveGem, saveGame }) => {
    const { state, update } = useContext(GemContext)
    const { Moralis, user } = useMoralis()
    const [numbers, setNumbers] = useState([0, 0, 0, 0])
    const [won, setWon] = useState('')
    const [canPlay, setCanPlay] = useState(false)
    const [deadline, setDeadline] = useState('')
    const [timerValue, setTimerValue] = useState([])

    const [t1, setT1] = useState("")
    const [t2, setT2] = useState("")
    const randomNumber = (min, max) => {
        return parseInt(Math.random() * (max - min) + min);
    }

    const userCanPlay = async () => {
        const User = Moralis.Object.extend('_User')
        const query = new Moralis.Query(User)
        const myDetails = await query.first()
        const time = myDetails.get('next_free_play')
        const currentTime = Date()
        setT1(currentTime)
        setT2(time)
        if (new Date(currentTime) > new Date(time)) {
            setCanPlay(true)
        } else {
            setCanPlay(false)
            setDeadline(time)
        }

    }

    const gems = async (gemsWon) => {
        const User = Moralis.Object.extend('_User')
        const query = new Moralis.Query(User)
        const myDetails = await query.first()
        const prevBalance = myDetails.get('gem_balance')
        saveGem(gemsWon, user?.get('email'), 'freeSpice')
        myDetails.set('gem_balance', (gemsWon + prevBalance))
        myDetails.save()
    }

    const setLimit = async () => {
        let date = new Date()
        var numberOfMlSeconds = date.getTime();
        var addMlSeconds = (1 * 60) * 60 * 1000;
        var newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
        console.log(newDateObj)
        const User = Moralis.Object.extend('_User')
        const query = new Moralis.Query(User)
        const myDetails = await query.first()
        myDetails.set('next_free_play', newDateObj)
        myDetails.save()
    }



    const roll = () => {
        let count = 0

        const interval = setInterval(async () => {
            let r1 = randomNumber(0, 9)
            let r2 = randomNumber(0, 9)
            let r3 = randomNumber(0, 9)
            let r4 = randomNumber(0, 9)
            setNumbers([r1, r2, r3, r4])
            count += 1
            console.log(count)
            if (count >= 50) {
                const num = `${r1}${r2}${r3}${r4}`
                clearInterval(interval)
                const winAmount = checkWin(num)
                gems(winAmount)
                setWon(winAmount)
                update({ gems: winAmount + state.gems })
                console.log('win amount', winAmount)
                setLimit()
                saveGame(
                    'freeSpice',
                    0,
                    winAmount,
                    0
                )
                await userCanPlay()
            }

        }, 40);

    }

    const countTimer = () => {

    }

    const checkWin = (number) => {
        let num = parseInt(number)
        console.log(num)
        if (num == 10000) {
            return 10
        } else if (num >= 9998 && num <= 9999) {
            return 5
        } else if (num >= 9994 && num <= 9997) {
            return 1
        } else if (num >= 9985 && num <= 9993) {
            return 0.8
        } else if (num >= 9886 && num <= 9985) {
            return 0.1
        } else if (num >= 0 && num <= 9885) {
            return 0.02
        }
    }

    useEffect(() => {
        userCanPlay()
    }, [])

    useEffect(() => {
        if (deadline < 0) {
            clearInterval(interval)
        }
        const interval = setInterval(() => {
            var now = new Date().getTime()
            var m_deadline = new Date(deadline).getTime()

            let diff = m_deadline - now
            console.log(diff + ' ' + now)

            var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimerValue([hours, minutes, seconds])

        }, 1000)
        userCanPlay()
        return () => clearInterval(interval);
    }, [timerValue])



    return (
        <div className='py-5'>
            <Container className='main-free-spin'>

                <Table bordered >
                    <thead className='table-head'>
                        <tr>
                            <th className='table-head'>Lucky Number</th>
                            <th className='table-head'>Payout</th>

                        </tr>
                    </thead>
                    <tbody className='free-spice-body'>
                        <tr>
                            <td>0-9885</td>
                            <td>0.02 Spice</td>
                        </tr>
                        <tr>
                            <td>9886-9985</td>
                            <td>0.1 Spice</td>
                        </tr>
                        <tr>
                            <td>9886-9993</td>
                            <td>0.8 Spice</td>
                        </tr>
                        <tr>
                            <td>9994-9997</td>
                            <td>1 Spice</td>
                        </tr>
                        <tr>
                            <td>9998-9999</td>
                            <td>5  Spice</td>
                        </tr>

                        <tr>
                            <td>10000</td>
                            <td>10 Spice</td>
                        </tr>



                    </tbody>
                </Table>

                <div>
                    <Button className='button mx-1'>{numbers[0]}</Button>
                    <Button className='button mx-1'>{numbers[1]}</Button>
                    <Button className='button mx-1'>{numbers[2]}</Button>
                    <Button className='button mx-1'>{numbers[3]}</Button>
                </div>
                {won > 0 && (
                    <Alert key='ao' variant='success' className='mt-4'>
                        You've won {won.toString()} SPICE
                    </Alert>
                )}

            </Container>

            <Container className='my-5'>
                {canPlay == true ? <Button className='btn-large' size='lg' onClick={roll} variant='success'>Roll</Button> :
                    <div>
                        <div>
                            <p>Wait for the next roll (at hourly intervals)</p>
                        </div>
                        <div className='d-flex flex-row align-items-center justify-content-center'>
                            <div className='timer'>{timerValue[0]}h</div>:
                            <div className='timer'>{timerValue[1]}m</div>:
                            <div className='timer'>{timerValue[2]}s</div>
                        </div>
                    </div>}
            </Container>
        </div>
    )
}

export default FreeSpice