import React, { useState, useContext, useEffect } from 'react'
import { Row, Col, Button, Table } from 'react-bootstrap'
import './Roll.css'
import { GemContext } from '../../GemContext'
import { useMoralis, useMoralisQuery } from 'react-moralis'



const Tab = (props) => {
    return (
        <tr className='dark-background-full my-5'>
            <td className='border-left'><input onChange={props.handleChange} type='radio' name='m-check' /></td>
            <td className='t-small'>{props.prize}</td>
            <td className='t-small'>{props.cost}</td>
        </tr>
    )
}


const Roll = ({ send_gems, deduct_gems, loadGems }) => {
    const { state, update } = useContext(GemContext)

    const { Moralis, user } = useMoralis()
    const [choice, setChoice] = useState('')
    const [isAuto, setAuto] = useState(false)
    const [numbers, setNumbers] = useState([0, 0, 0, 0])
    const [manWin, setManWin] = useState(false)
    const [hasPlayed, setHasPlayed] = useState(false)
    const [jackpot, sethasWonJackPot] = useState(false)
    const [isRolling, setIsRolling] = useState(false)
    const [jackpotChoice, setJackPotChoice] = useState({
        prize: 0,
        cost: 0,
    })
    const [page, setPage] = useState(0);
    const recordsPerPage = 10
    const numberOfRecordsVistited = page * recordsPerPage;

    const [games, setGames] = useState([])
    const [recentBet, setRecentBet] = useState('')
    const [betAmount, setBetAmount] = useState(0.1)
    const maxAmount = 40

    // automodes
    const [autoChoice, setAutoChoice] = useState(0)
    const [autoLossEnd, setAutoLossEnd] = useState(0.01)
    const [autoProfitEnd, setAutoProfitEnd] = useState(0.01)
    const [numberOfRolls, setNumberOfRolls] = useState(20)

    const [autoLosses, setAutoLosses] = useState(0)
    const [autoProfits, setAutoProfits] = useState(0)

    const [currentAutoProfit, setCurrentAutoProfit] = useState(0)

    const [profitLimit, setProfitLimit] = useState(false)
    const [lossLimit, setLossLimit] = useState(false)

    const [baseBet, setBaseBet] = useState(1)
    const [betStatus, setBetStatus] = useState("")
    const [isInautoMode, setIsInAutoMode] = useState(false)
    const [autoJackpot, setAutoJackpotChoice] = useState({})

    const [maxBet, setMaxBet] = useState(20)

    const jackpotChoices = {
        '1': {
            prize: 1,
            cost: 0.00012500,
        },
        '2': {
            prize: 0.1,
            cost: 0.00001250,
        },
        '3': {
            prize: 0.01,
            cost: 0.00000125,
        },
        '4': {
            prize: 0.001,
            cost: 0.00000013,
        },
        '5': {
            prize: 0.0001,
            cost: 0.00000002,
        },
    }





    const handleChangeAction = (key) => {
        let chosen = jackpotChoices[key]
        setJackPotChoice({
            prize: chosen.prize,
            cost: chosen.cost
        })

    }

    const randomNumber = (min, max) => {
        return parseInt(Math.random() * (max - min) + min);
    }
    const roll = async (choicee) => {

        let num = ''
        let count = 0
        let gemBalance = state.gems

        if (gemBalance >= betAmount) {
            setIsRolling(true)
            setChoice(choicee)
            const interval = setInterval(() => {
                let r1 = randomNumber(0, 9)
                let r2 = randomNumber(0, 9)
                let r3 = randomNumber(0, 9)
                let r4 = randomNumber(0, 9)
                setNumbers([r1, r2, r3, r4])
                count += 1
                console.log(count)
                if (count >= 50) {
                    setRecentBet(choice)
                    clearInterval(interval)
                    num = `${r1}${r2}${r3}${r4}`
                    let wining = parseInt(num)
                    console.log(wining)
                    const hasWon = check(num, choice)
                    setManWin(hasWon)
                    console.log(choice)
                    setHasPlayed(true)
                    const jackpotWin = jackpotChoice['prize']
                    const jackpotCost = jackpotChoice['cost']

                    if (jackpot == true && jackpotChoice['cost'] > 0) {
                        //transfer jackpot gems
                        send_gems(jackpotWin)
                        update({ gems: state.gems + jackpotWin })
                        alert('won')
                    } else if (jackpot == false && jackpotChoice['cost'] > 0) {
                        deduct_gems(jackpotCost)
                        update({ gems: state.gems - jackpotCost })
                    }

                    if (hasWon == true) {
                        //transfer gems
                        let amt_won = betAmount * 0.5
                        send_gems(amt_won)
                        update({ gems: state.gems + (amt_won) })
                        saveGame(amt_won, amt_won, choice, 0, jackpotWin, wining)
                        setIsRolling(false)
                        return { 'won': amt_won + jackpotWin }
                    } else if (hasWon == false) {
                        //deduct gems

                        deduct_gems(betAmount)
                        update({ gems: state.gems - betAmount })
                        saveGame(0, 0, choice, betAmount, jackpotWin, wining)
                        setIsRolling(false)
                        return { 'lost': betAmount }

                    }




                    // loadGems().then((data: any) => {
                    //     update({ gems: data })
                    // })


                }


            }, 40);

        } else {
            alert('Your bet amount is greater than your gem balance')
        }



    }


    const autoRoll = async (choicee) => {

        let num = ''
        let count = 0
        let gemBalance = state.gems

        if (gemBalance >= baseBet) {
            setIsRolling(true)

            const interval = setInterval(async () => {
                let r1 = randomNumber(0, 9)
                let r2 = randomNumber(0, 9)
                let r3 = randomNumber(0, 9)
                let r4 = randomNumber(0, 9)
                setNumbers([r1, r2, r3, r4])
                count += 1
                if (count >= 50) {



                    clearInterval(interval)
                    num = `${r1}${r2}${r3}${r4}`
                    let wining = parseInt(num)

                    var currentGems = state.gems

                    const hasWon = check(wining, choicee)
                    console.log(hasWon)
                    setBetStatus(hasWon)

                    console.log(choicee)
                    const jackpotWin = autoJackpot['prize']
                    const jackpotCost = autoJackpot['cost']

                    if (jackpot == true && autoJackpot['cost'] > 0) {
                        //transfer jackpot gems
                        send_gems(jackpotWin)
                        await update({ gems: state.gems + jackpotWin })
                    } else if (jackpot == false && autoJackpot['cost'] > 0) {
                        deduct_gems(jackpotCost)
                        await update({ gems: state.gems - jackpotCost })
                    }

                    if (hasWon == true) {
                        //transfer gems
                        let amt_won = baseBet * 0.5
                        send_gems(amt_won).then(async () => {

                            update({ gems: currentGems + amt_won })
                            saveGame(amt_won, amt_won, choicee, 0, jackpotWin, wining)
                            setIsRolling(false)
                            setAutoProfits((profit) => {
                                return profit + amt_won
                            })
                            return { 'won': amt_won + jackpotWin, 'lost': 0, 'status': 'win' }
                        }).catch((err) => {
                            alert(err)
                        })
                    } else if (hasWon == false) {
                        //deduct gems
                        deduct_gems(baseBet).then(async () => {
                            await update({ gems: currentGems - baseBet })
                            saveGame(0, 0, choicee, baseBet, jackpotWin, wining)
                            setIsRolling(false)
                            setAutoLosses((loss) => {
                                return loss + baseBet
                            })
                        }).catch((err) => { throw alert(err) });

                        return { 'lost': baseBet, 'won': 0, 'status': false }

                    }
                    await loadGems()

                }


            }, 40);
        } else {
            alert('Your bet amount is greater than your gem balance')
        }



    }


    const saveGame = (amountWon, _profit, choicMade, amountLost, jackpot, roll) => {
        console.log(choicMade)
        const Game = Moralis.Object.extend('Games')
        const game = new Game()
        game.set('game_name', 'DICE')
        game.set('bet_roll', 'roll')
        game.set('roll', roll)
        game.set('choice', choicMade)
        game.set('multiplier', 1.5)
        game.set('player', user?.get('email'))
        game.set('amount_won', amountWon)
        game.set('amount_lost', amountLost)
        game.set('bet_amount', betAmount)
        game.set('profit', _profit)
        game.set('jackpot', jackpot)
        game.save()
    }

    const { fetch } = useMoralisQuery(
        "Games",
        (query) => query.equalTo("player", user?.get('email')).descending('createdAt').limit(100),
        [],
        { autoFetch: false }
    );

    const fetch_games = async () => {
        const results = await fetch()
        // alert("Successfully retrieved " + results?.length + " monsters.")
        // Do something with the returned Moralis.Object values
        let values = []
        let id = 0
        for (let i = 0; i < results.length; i++) {
            const object = results ? results[i] : null
            if (object?.get('game_name') == 'DICE') {
                values.push({
                    'id': id,
                    'date': object?.createdAt.toString().slice(0, 15),
                    'time': object?.createdAt.toString().slice(15, 28),
                    'game': object?.get('game_name'),
                    'bet': object?.get('choice'),
                    'roll': object?.get('roll'),
                    'stake': object?.get('bet_amount'),
                    'mult': object?.get('multiplier'),
                    'profit': object?.get('profit'),
                    'jackpot': object?.get('jackpot'),



                })
                id += 1
            }
        }
        console.log(values)
        setGames(values)

    }

    const play_roll = (chosen) => {
        if (betAmount <= maxAmount && betAmount >= 0.1) {
            setChoice(chosen)
        } else {
            alert('Your bet is out of range')
        }
    }

    const playAutoRoll = async () => {
        setAutoJackpotChoice({})
        setAutoLosses(0)
        setAutoProfits(0)
        if (baseBet <= maxAmount && baseBet >= 0.01 && baseBet < state.gems) {
            let prevChoice = '';
            let profit = 0
            let loss = 0
            let max_bet = 0
            let numberORolls = 0
            setIsInAutoMode(true)
            const rollInterval = setInterval(async () => {
                if (baseBet <= maxAmount && baseBet >= 0.01 && baseBet < state.gems) {
                    let chosenVar = autoBetChoice(prevChoice)
                    console.log(chosenVar)
                    prevChoice = chosenVar
                    numberORolls += 1
                    max_bet += baseBet



                    if (numberORolls >= numberOfRolls) {
                        clearInterval(rollInterval)
                        setIsInAutoMode(false)
                    }

                    if (profitLimit == true && autoProfits >= autoProfitEnd) {
                        clearInterval(rollInterval)
                        setIsInAutoMode(false)
                    }

                    if (lossLimit == true && autoLosses >= autoLossEnd) {
                        clearInterval(rollInterval)
                        setIsInAutoMode(false)
                    }

                    if (max_bet >= maxBet || autoProfits >= maxBet) {
                        clearInterval(rollInterval)
                        setIsInAutoMode(false)
                    }

                    await autoRoll(chosenVar)
                    await loadGems()

                }

            }, 3000)
        } else {
            alert('Your bet is out of range')
        }

    }

    const autoBetChoice = (prevChoice) => {
        if (autoChoice == 1) {
            return 'LO'
        } else if (autoChoice == 0) {
            return 'HI'
        } else if (autoChoice == 2) {
            if (prevChoice == 'HI') {
                return 'LO'
            } else {
                return 'HI'
            }
        }
    }


    const setMinMax = (min) => {
        if (min == true) {
            setBetAmount(0.1)
        } else if (min == false) {
            setBetAmount(maxAmount)
        }
    }

    const halveDouble = (halve) => {
        if (halve == true && betAmount > 0.1) {
            setBetAmount(betAmount / 2)
        } else if (halve == false) {
            if (betAmount * 2 < maxAmount) {
                setBetAmount(betAmount * 2)
            } else {
                setBetAmount(maxAmount)
            }
        }
    }

    const changePage = (isNext) => {
        if (isNext) {
            if (page < (Math.ceil(games.length / recordsPerPage) - 1)) {
                setPage(page + 1)
            }
        } else {
            if (page > 0) {
                setPage(page - 1)
            }
        }
    };


    const deductPlayGems = () => {

    }


    const check = (num, choice) => {
        if (num == 8888) {
            sethasWonJackPot(true)
            return true
        }
        else if (num > 5250 && choice == 'HI') {
            return true
        } else if (num < 4750 && choice == 'LO') {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        fetch_games()

    }, [])

    useEffect(() => {
        setBetStatus("")
        loadGems()
        if (state.gems > 0 && choice.length > 0) {
            roll(choice)
            setChoice('')
        }
    }, [choice])




    return (
        <div className=' main '>
            <div className='inner'>
                <div className='d-flex flex-row w-100 align-items-center justify-content-center'>
                    <div onClick={() => { setAuto(false); setNumbers([0, 0, 0, 0]); setBetStatus(""); }} className={isAuto == false ? 'mx-2 indicator-bar modified-selected' : 'mx-2 indicator-bar modified'}>Manual BET</div>
                    <div onClick={() => { setAuto(true); setNumbers([0, 0, 0, 0]); }} className={isAuto == true ? 'mx-2 indicator-bar modified-selected' : 'mx-2 indicator-bar modified'}>Auto BET</div>
                </div>
                {!isAuto ? <Row className='px-2 bar py-3'>
                    <Col className='border-right px-2 py-3' md={4}>
                        <div>
                            <div className='indicator-bar'>Max Profit per bet</div>
                            <div className='invert-indicator-bar'>{maxAmount * 1.5} Spice</div>

                        </div>

                        <div>
                            <div className='pt-3 d-flex flex-row flex-boxer flex-2 w-100 justify-content-between'>
                                <div className='indicator-bar full-border w-50'>Bet Amount</div>
                                <div onClick={() => halveDouble(false)} className='invert-indicator-bar full-border cursor-area'>x2</div>
                                <div onClick={() => halveDouble(true)} className='invert-indicator-bar full-border cursor-area'>/2</div>
                                <div onClick={() => setMinMax(true)} className='invert-indicator-bar full-border cursor-area'>Min</div>
                                <div onClick={() => setMinMax(false)} className='invert-indicator-bar full-border cursor-area'>Max</div>
                            </div>
                            <div className='invert-indicator-bar'>{betAmount} Spice</div>
                        </div>

                        <div className='d-flex flex-row pt-3'>
                            <div className='indicator-bar-right'>Win Profit</div>
                            <div className='invert-indicator-bar right-only-border w-50'>{Math.round((betAmount * 1.5) * 100) / 100} Spice</div>
                        </div>

                        <Row className='py-4'>
                            <Col>
                                <div>
                                    <div className='indicator-bar-right'>Bet Odds ?</div>
                                    <div className='dark-background p-2'>
                                        <div className='invert-indicator-bar right-only-border'>2.00</div>
                                    </div>
                                </div></Col>
                            <Col>
                                <div>
                                    <div className='indicator-bar-right'>Win Chance ?</div>
                                    <div className='dark-background p-2'>
                                        <div className='invert-indicator-bar right-only-border'>2.00</div>
                                    </div>
                                </div></Col>
                        </Row>

                        <div>
                            <div className='d-flex flex-row align-items-center justify-content-center'>
                                <input type='checkbox' />
                                <span className='gold-text px-1'>Enable Sounds</span>
                            </div>
                        </div>
                    </Col>
                    {/* second */}
                    <Col className='border-right py-3' md={4}>
                        <div>
                            <Button className='button-large btn-lg mx-1'>{numbers[0]}</Button>
                            <Button className='button-large btn-lg mx-1'>{numbers[1]}</Button>
                            <Button className='button-large btn-lg mx-1'>{numbers[2]}</Button>
                            <Button className='button-large btn-lg mx-1'>{numbers[3]}</Button>

                        </div>
                        {isRolling ? <div className='justify-content-between px-3  py-4 w-100 d-flex flex-row'

                        >
                            <button disabled onClick={() => play_roll('HI')} className='yellow-btn'>BET HI</button>
                            <button disabled onClick={() => play_roll('LO')} className='yellow-btn'>BET LO</button>
                        </div> : <div className='justify-content-between px-3  py-4 w-100 d-flex flex-row'>
                            <button onClick={() => play_roll('HI')} className='yellow-btn'>BET HI</button>
                            <button onClick={() => play_roll('LO')} className='yellow-btn'>BET LO</button>
                        </div>}
                        {manWin == true && hasPlayed == true ? <div className='result text-black my-2'>
                            {`You BET ${recentBet} so you win ${jackpot ? (betAmount * 1.5) + jackpotChoice['prize'] : (betAmount * 1.5)} GEMS!`}
                        </div> : ''
                        }
                        {manWin == false && hasPlayed == true ? <div className='result-lost text-black my-2'>
                            {`You BET ${recentBet} so you loose ${jackpot ? betAmount + jackpotChoice['cost'] : betAmount} GEMS!`}
                        </div> : ''
                        }
                        <div className='text-white'>
                            To win, BET HI and get a number higher than <span className='gold-text'>5250</span> or BET LO and get a number lower than <span className='gold-text'>4750</span>
                        </div>
                    </Col>
                    <Col md={4}>
                        <h5 className='text-white'>PLAY FOR JACKPOTS

                        </h5>
                        <h5 className='text-white'>
                            Roll number  <span className='gold-text'>8888</span> to win the jackpots!
                        </h5>
                        <div className='py-2'>
                            <table>
                                <thead>
                                    <tr>
                                        <th className='indicator-bar-right px-1 py-2'>Select</th>
                                        <th className='indicator-bar-full px-1 py-2'>Prize (SPICE)</th>
                                        <th className='indicator-bar-full px-1 py-2'>Cost (SPICE)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <Tab handleChange={() => handleChangeAction('1')} prize={'1.00000000'} cost={'0.00012500'} />
                                    <Tab handleChange={() => handleChangeAction('2')} prize={'0.10000000'} cost={'0.00001250'} />
                                    <Tab handleChange={() => handleChangeAction('3')} prize={'0.01000000'} cost={'0.00000125'} />
                                    <Tab handleChange={() => handleChangeAction('4')} prize={'0.00100000'} cost={'0.00000013'} />
                                    <Tab handleChange={() => handleChangeAction('5')} prize={'0.00010000'} cost={'0.00000002'} />
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row> :
                    <Row className='px-2 bar py-3'>
                        <Col className='border-right px-2 py-3' md={4}>



                            <div className='d-flex flex-row  w-100 pt-3'>
                                <div className='indicator-bar-right w-50 center-vertical'>BASE BET</div>
                                <div className='invert-indicator-bar right-only-border w-50'>
                                    <input onChange={(e) => parseFloat(setBaseBet(e.target.value))} value={baseBet} className='inner-input w-100' />
                                </div>
                            </div>

                            <div className='d-flex flex-row w-100 pt-3'>
                                <div className='indicator-bar-right w-50 center-vertical'>MAX BET/WIN</div>
                                <div className='invert-indicator-bar right-only-border w-50'>
                                    <input value={maxBet} onChange={((e) => setMaxBet(e.target.value))} className='inner-input w-100' />
                                </div>
                            </div>

                            <Row className='py-4'>
                                <Col>
                                    <div>
                                        <div className='indicator-bar-right'>Bet Odds ?</div>
                                        <div className='dark-background p-2'>
                                            <input disabled value='20' className='inner-input w-100' />
                                        </div>
                                    </div></Col>
                                <Col>
                                    <div>
                                        <div className='indicator-bar-right'>No of Rolls ?</div>
                                        <div className='dark-background p-2'>
                                            <input value={numberOfRolls} onChange={(e) => setNumberOfRolls(e.target.value)} className='inner-input w-100' />
                                        </div>
                                    </div></Col>
                            </Row>

                            <div>
                                <div className='indicator-bar'>Bet on</div>
                                <div className='invert-indicator-bar d-flex flex-row justify-content-center'>

                                    <input defaultChecked onClick={() => setAutoChoice(0)} className='mx-2' type='radio' name='game-option' />
                                    <div>Hi</div>
                                    <input onClick={() => setAutoChoice(1)} className='mx-2' type='radio' name='game-option' />
                                    <div>LO</div>
                                    <input onClick={() => setAutoChoice(2)} className='mx-2' type='radio' name='game-option' />
                                    <div>ALTERNATE</div>
                                </div>
                            </div>

                            <div>

                                <div className='indicator-bar mt-4 px-1 py-2'>STOP BETTING AFTER</div>
                                <table>

                                    <tbody>
                                        <tr className='dark-background-full my-5'>
                                            <td className='border-left'><input onClick={() => setProfitLimit(!profitLimit)} type='checkbox' /></td>
                                            <td className='gold-text'>{'Profit >='}</td>
                                            <td className='w-50'>
                                                <input onChange={(e) => setAutoProfitEnd(e.target.value)} value={autoProfitEnd} className='inner-input  w-100' />
                                            </td>
                                        </tr>
                                        <tr className='dark-background-full my-5'>
                                            <td className='border-left'><input onChange={() => setLossLimit(!lossLimit)} type='checkbox' /></td>
                                            <td className='gold-text'>{'Loss >='}</td>
                                            <td className='w-50'>
                                                <input onChange={(e) => setAutoLossEnd(e.target.value)} value={autoLossEnd} className='inner-input w-100' />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </Col>

                        {/* second */}
                        <Col className='border-right py-3' md={4}>
                            <div>
                                <Button className='button-large btn-lg mx-1'>{numbers[0]}</Button>
                                <Button className='button-large btn-lg mx-1'>{numbers[1]}</Button>
                                <Button className='button-large btn-lg mx-1'>{numbers[2]}</Button>
                                <Button className='button-large btn-lg mx-1'>{numbers[3]}</Button>

                            </div>
                            <div className='py-4'>
                                {isInautoMode == true ? <button disabled className='yellow-btn btn-fade'>START AUTO BET</button> : <button onClick={() => playAutoRoll()} className='yellow-btn'>START AUTO BET</button>}

                            </div>
                            {
                                betStatus === true && (<div className='result text-black my-2'>
                                    Won {Math.round((baseBet * 1.5) * 100) / 100} spice
                                </div>)
                            }
                            {
                                betStatus === false && (<div className='result-lost  text-white my-2'>
                                    Lost {baseBet} spice
                                </div>)
                            }
                            <h6 className='text-white'>
                                Play for Jackpots
                            </h6>
                            <div className='text-white'>
                                Roll number <span className='gold-text'>8888</span> to win the jackpots!
                            </div>
                            <div className='py-2'>
                                <table>
                                    <thead>
                                        <th className='indicator-bar-right px-1 py-2'>Select</th>
                                        <th className='indicator-bar-full px-1 py-2'>Prize (SPICE)</th>
                                        <th className='indicator-bar-full px-1 py-2'>Cost (SPICE)</th>
                                    </thead>
                                    <tbody>
                                        <Tab onClick={() => setAutoJackpotChoice({ 'prize': 1, 'cost': 0.000125 })} prize={'1.00000000'} cost={'0.00012500'} />
                                        <Tab onClick={() => setAutoJackpotChoice({ 'prize': 0.1, 'cost': 0.0000125 })} prize={'0.10000000'} cost={'0.0000125'} />
                                        <Tab onClick={() => setAutoJackpotChoice({ 'prize': 0.01, 'cost': 0.00000125 })} prize={'0.01000000'} cost={'0.00000125'} />
                                        <Tab onClick={() => setAutoJackpotChoice({ 'prize': 0.001, 'cost': 0.00000013 })} prize={'0.00100000'} cost={'0.00000013'} />
                                        <Tab onClick={() => setAutoJackpotChoice({ 'prize': 0.001, 'cost': 0.0000002 })} prize={'0.00010000'} cost={'0.0000002'} />
                                    </tbody>
                                </table>
                            </div>
                        </Col>

                        {/* third column */}
                        <Col md={4} className='py-3'>
                            <div className='  d-flex w-100 flex-row'>
                                <div className='indicator-bar-right w-50'>On win</div>
                                <div className='indicator-bar indicator-bar-left w-50'>On loose</div>
                            </div>
                            <div className='dark-background  align-items-start px-2'>

                                <div className='align-items-start d-flex flex-row py-1'>
                                    <div>
                                        <input type='checkbox' />
                                    </div>
                                    <p className='gold-text fs-6 px-2'>RETURN TO BASE BET</p>
                                </div>
                                <div className='align-items-start flex-row  d-flex  py-1'>
                                    <div>
                                        <input type='checkbox' />
                                    </div>
                                    <p className='gold-text fs-6 px-2'>INCREASE BET BY</p>
                                    <input value='2' className='invert-indicator-bar w-25 right-only-border' style={{ textAlign: 'center' }} />
                                </div>
                                {/* <div className='align-items-start  d-flex  py-1'>
                                    <div> <input type='checkbox' /></div>
                                    <span className='gold-text fs-6 px-2'>CHANGE ODDS TO</span>
                                    <input value='2' className='invert-indicator-bar w-25 right-only-border' style={{ textAlign: 'center' }} />
                                </div> */}
                            </div>




                            <div className=' my-4'>
                                <div className='indicator-bar fs-6'>ON HITTING MAX BET/WIN</div>
                                <div className='dark-background border-all align-items-start px-2'>
                                    <div className='align-items-start d-flex flex-row py-1'>
                                        <div>
                                            <input type='checkbox' />
                                        </div>
                                        <p className='gold-text fs-6 px-2'>RETURN TO BASE BET</p>
                                    </div>
                                    <div className='align-items-start d-flex flex-row py-1'>
                                        <div>
                                            <input type='checkbox' />
                                        </div>
                                        <p className='gold-text fs-6 px-2'>  STOP BETTING</p>
                                    </div>
                                </div>
                            </div>

                        </Col>
                    </Row>

                }
                <div className='py-3'>
                    TIP: Click the icon at the left of each individual roll to audit your balance before and after each roll to ensure that bets were fair.
                </div>

                <div className='rolls'>
                    <div className='indicator-bar mt-4 py-2'><Button onClick={() => changePage(false)} className='pagi-buttons'>PREV</Button>Roll History<Button onClick={() => changePage(true)} className='pagi-buttons'>Next</Button></div>
                    <Table bordered>
                        <thead className='t-head'>
                            <tr>
                                <th>DATE</th>
                                <th>TIME</th>
                                <th>GAME</th>
                                <th>BET</th>
                                <th>ROLL</th>
                                <th>STAKE</th>
                                <th>MULT</th>
                                <th>PROFIT</th>
                                <th>JPOT</th>
                            </tr>
                        </thead>

                        <tbody className='t-body'>
                            {
                                games.length > 0 ? games.slice(numberOfRecordsVistited, numberOfRecordsVistited + recordsPerPage).map((item) => {
                                    return <tr>
                                        <td className='row-item'>{item['date']}</td>
                                        <td className='row-item'>{item['time']}</td>
                                        <td className='row-item'>{item['game']}</td>
                                        <td className='row-item'>{item['bet']}</td>
                                        <td className='row-item'>{item['roll']}</td>
                                        <td className='row-item'>{item['stake']}</td>
                                        <td className='row-item'>{item['mult']}</td>
                                        <td className='row-item'>{item['profit']}</td>
                                        <td className='row-item'>{item['jackpot']}</td>

                                    </tr>
                                }) : <tr></tr>
                            }
                        </tbody>
                    </Table>

                </div>
            </div >
        </div >
    )
}

export default Roll