import React from 'react'
import OnramperWidget from "@onramper/widget";
import { useMoralis } from 'react-moralis';

const BuyCrypto = () => {
    const { user } = useMoralis()

    const wallets = {
        BNB: { address: user.get('gen_account'), memo: "cryptoTag" },
    };

    return (
        <div>
            <div className='py-3'>
                <div className='d-flex align-items-center flex-column justify-content-center'>

                    <div><p>Buy crypto with fiat currency (USD, EUR, AUD, CAD, ect..) directly from our app</p></div>

                    <div
                        style={{
                            width: "482px",
                            height: "660px",
                        }}
                    >
                        <OnramperWidget
                            defaultAmount={200}
                            API_KEY="pk_test_ass3gtLSWQpI11IWUZLJdrfyQhj7bTw_3xwLvhEvH6Q0"
                            filters={{
                                onlyCryptos: ["BUSD", "BNB"]
                            }}
                            defaultAddrs={wallets}
                            color='rgb(255, 107, 156)'
                            defaultCrypto={'BUSD'}


                        />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default BuyCrypto