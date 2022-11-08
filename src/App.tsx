import React, { useContext, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './pages/Header';
import FreeSpice from './pages/FreeSpice';
import Desposit from './pages/Desposit/Desposit';
import Roll from './pages/Spiceroll/Roll';
import Spin from './pages/Spin/Spin';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useMoralis, useMoralisQuery } from 'react-moralis';
import Auth from './pages/UserAuth/Auth';
import { GemProvider } from './GemContext';
import Dashboard from './pages/Dashboard/Dashboard';
import Overview from './pages/Dashboard/pages/Overview';
import Deposit from './pages/Dashboard/pages/Deposit';
import Withdraw from './pages/Dashboard/pages/Withdraw';
import Statistics from './pages/Dashboard/pages/Statistics';
import Wallets from './pages/Dashboard/pages/Wallets';
import { ArrayContext } from './ArrayContext';
import Swap from './pages/Swap/Swap';
import Link from './pages/Dashboard/pages/Link';
import WalletGroup from './pages/Dashboard/pages/WalletGroup';
import { GemContext } from './GemContext';
import Verify from './pages/UserAuth/Verify';
import ResetPassword from './pages/UserAuth/ResetPassword';
import Logout from './pages/UserAuth/Logout';
import { hostUrl } from './Constants';
import Redirects from './pages/UserAuth/Redirects';
import { MainGuest } from './Constants';
import Landing from './myComponents/Landing';
import { Router } from 'react-bootstrap-icons';
var createHost = require('cross-domain-storage/host');

var storageHost = createHost([
  {
    origin: hostUrl,
    allowedMethods: ['get', 'set', 'remove'],
  },
  {
    origin: MainGuest,
    allowedMethods: ['get'],
  },
]);

function App() {
  const { user, authenticate, isAuthenticated, Moralis } = useMoralis()
  const [isVerifeid, setIsVerified] = useState(false)

  const { state, update } = useContext(GemContext)
  interface gemGems {
    send_gems: (gemsWon: number) => number;
  }


  const gam = () => {
    console.log('build')
  }

  const addToGem = async (gems: any, email: string) => {
    const GEMS = Moralis.Object.extend('Gems')
    const gem = new GEMS()
    gem.set('email', email)
    gem.set('gems', gems)
    gem.save()
  }

  const addToGemGame = async (gems: any, email: string, type: Number) => {
    const GEMS = Moralis.Object.extend('Gems')
    const gem = new GEMS()
    gem.set('email', email)
    gem.set('gems', gems)
    gem.set('type', type)
    gem.save()
  }


  const send_gems = async (gemsWon: any) => {
    //save into gems
    try {
      const User = Moralis.Object.extend('_User')
      const query = new Moralis.Query(User)
      const myDetails = await query.first()
      const prevBalance = myDetails?.get('gem_balance')
      await addToGem(gemsWon, user?.get('email'))
      myDetails?.set('gem_balance', (gemsWon + prevBalance))
      myDetails?.save()
      return gemsWon + prevBalance
    } catch (err) {
      return
    }
  }






  const deduct_gems = async (gemsUsed: number) => {
    const User = Moralis.Object.extend('_User')
    const query = new Moralis.Query(User)
    const myDetails = await query.first()
    const prevBalance = myDetails?.get('gem_balance')
    addToGem(-gemsUsed, user?.get('email'))
    myDetails?.set('gem_balance', (prevBalance - gemsUsed))
    myDetails?.save()

  }

  const loadGems = async () => {
    const User = Moralis.Object.extend('_User')
    const query = new Moralis.Query(User)
    const myDetails = await query.first()
    const prevBalance = myDetails?.get('gem_balance')
    update({ gems: prevBalance })
    return prevBalance
  }

  const saveGame = (gameName: string, amountBet: Number, amountWon: Number, amountLost: Number) => {
    const Game = Moralis.Object.extend('Games')
    const game = new Game()
    game.set('game_name', gameName)
    game.set('player', user?.get('email'))
    game.set('amount_won', amountWon)
    game.set('amount_lost', amountLost)
    game.set('bet_amount', amountBet)
    game.save()
  }

  const [use, setUser] = useState('')

  const gemFunctions = useState([gam])

  const checkIsVerifeid = async () => {
    try {
      const User = Moralis.Object.extend('_User')
      const query = new Moralis.Query(User)
      const myDetails = await query.first()
      const isVer = myDetails?.get('emailVerified')
      setIsVerified(isVer)
      console.log(isVer)
    } catch (err) {

    }
  }

  useEffect(() => {
    checkIsVerifeid()
  }, [])




  return (
    <div className="App">

      <GemProvider>
        <BrowserRouter>

          {isAuthenticated == true && user ?
            <>
              {isVerifeid == true || user.get("emailVerified") == true ?
                <>
                  <Header />
                  <Routes>
                    <Route path="/" element={<Dashboard deduct={deduct_gems} />}>
                      <Route path="/" element={<Overview />}></Route>
                      <Route path="overview" element={<Overview />}></Route>

                      <Route path="deposit" element={<Deposit />}></Route>
                      <Route path="link" element={<Link />}></Route>
                      <Route path="withdraw" element={<Withdraw deduct_gems={deduct_gems} />}></Route>
                      <Route path="statistics" element={<Statistics />}></Route>
                      <Route path="wallets" element={<Wallets />}></Route>
                      <Route path="wallets-group" element={<WalletGroup />}></Route>
                    </Route>
                    <Route path="/logout" element={<Logout />} ></Route>
                    <Route path="/redirect" element={<Redirects />} ></Route>

                  </Routes>

                  <Routes>
                    <Route path="/swap" element={<Swap />} ></Route>
                  </Routes>



                  <div className='contain py-0' style={{ height: '100%' }}>


                    <div style={{ background: 'white' }} >


                      <Routes>
                        <Route path="/games" >
                          <Route path="free-spice" element={<FreeSpice saveGem={addToGemGame} saveGame={saveGame} />}></Route>
                          <Route path="roll" element={<Roll send_gems={send_gems} deduct_gems={deduct_gems} loadGems={loadGems} />}></Route>
                          <Route path="spin" element={<Spin send_gems={send_gems} deduct_gems={deduct_gems} loadGems={loadGems} />} ></Route>
                        </Route>

                      </Routes>



                    </div>

                  </div>
                </>
                : <Verify />
              }
            </>


            : <>
              <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/auth' element={<Auth />}></Route>
              </Routes>
            </>
          }
        </BrowserRouter>

      </GemProvider>

    </div >
  );
}

export default App;
