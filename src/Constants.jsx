import rewardAbi from './ABIs/reward_abi.json'
import spiceAbi from './ABIs/spabi.json'
import erc20ABI from './ABIs/busd_abi.json'
export const REWARD_CONTRACT_ADDRESS = "0xD67205aEBa9fc348b1271Df0BabcA48d24173aC2"//"0xd9912BE10c45127E9d1CDCd3521D1fc731AB1370"
export const SPICE_CONTRACT_ADDRESS = "0x0E37cc2bdDf52ef3FBBa7D951B2Fc8B2708eB87f" //"0x4ea183D6FFd550fbb6c5107919698901Db14c896"
export const BUSD_CONTRACT_ADDRESS = "0x035a87F017d90e4adD84CE589545D4a8C5B7Ec80"
export const NETWORK = 'bsc testnet'
export const COLOR = ''
export const REWARD_CONTRACT_ABI = rewardAbi['abi']
export const SPICE_ABI = spiceAbi['abi']
export const BUSD_ABI = erc20ABI['abi']
export const BINANCE_RPC = "https://data-seed-prebsc-1-s1.binance.org:8545/"
export const round = (value, places) => {
    return Math.round(value * 10 ** places) / 10 ** places
}
export const GetFormattedDate = (date) => {
    var todayTime = date;
    var month = todayTime.getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    return month + "/" + day + "/" + year;
}

export const backendUrl = 'http://localhost:8000';
//to fix
export const hostUrl = window.location.href

export const testMainGuest = 'http://localhost:3001'
export const MainGuest = 'http://localhost:3001'


export function isEmpty(value) {
    return value != "";
}


export function generate_random_string(string_length) {
    let random_string = '';
    let random_ascii;
    for (let i = 0; i < string_length; i++) {
        random_ascii = Math.floor((Math.random() * 25) + 97);
        random_string += String.fromCharCode(random_ascii)
    }
    return random_string
}
