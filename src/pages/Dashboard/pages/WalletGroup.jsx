import React, { useState } from 'react'
import Wallets from './Wallets'
import Transfer from './Transfer'
import BuyCrypto from './BuyCrypto'
const WalletGroup = () => {

    const [toggleWallets, setToggleWallets] = useState(0)

    const toggle = (page) => {
        setToggleWallets(page)
    }
    return (
        <div>
            <div className='d-flex w-100 mt-4'>
                <p className={toggleWallets == 0 ? 'underline-selection' : 'no-underline-selection'} onClick={() => toggle(0)}>Wallets</p>
                <p className={toggleWallets == 1 ? 'px-4 underline-selection' : 'px-4 no-underline-selection'} onClick={() => toggle(1)}>Exchange</p>
                {/* <p className={toggleWallets == 2 ? 'px-4 underline-selection' : 'px-4 no-underline-selection'} onClick={() => toggle(2)}>Buy Crypto<small></small></p> */}
            </div>

            <div>
                {
                    toggleWallets == 0 && <Wallets />
                }
                {
                    toggleWallets == 1 && < Transfer />
                }
                {/* {
                    toggleWallets == 2 && < BuyCrypto />
                } */}
            </div>
        </div>
    )
}

export default WalletGroup