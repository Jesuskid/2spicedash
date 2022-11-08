import { generate_random_string } from "../../Constants";
import axios from 'axios';

export function registerOnMainSite(email, name, password) {
    const newUserId = generate_random_string(20)
    let formdata = new FormData();
    formdata.append('email', email);
    formdata.append('userID', newUserId);
    formdata.append('name', name);
    formdata.append('password', password);
    axios({
        url: `https://2spice.link/app/backend/newaccount.php`,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: formdata
    })
        .then(function (res) {
            if (res.data === 'Account already exist') {
                console.log('exists')
                alert(res.data);
            }
            else if (res.data === newUserId) {
                let dt = new Date();
                localStorage.setItem('username', res.data);
                localStorage.setItem('lastLog', dt);
                console.log('detail')
            }
            else {
                console.log(res);
            }
        })
        .catch(function (err) {
            console.log(err);
        })
}


export const loginMainWebsite = async (email, password) => {
    let formdata = new FormData();
    formdata.append('email', email);
    formdata.append('password', password);
    axios({
        url: `https://2spice.link/app/backend/accessaccount.php`,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: formdata
    })
        .then(async function (res) {
            if (res.data === 'Wrong Details') {

            }
            else {
                let dt = new Date();
                localStorage.setItem('username', res.data);
                localStorage.setItem('lastLog', dt);
                window.location.reload()
                window.location.replace(window.location.origin)
            }

        })
        .catch(function (err) {
            console.log(err);
        })

}

export const logoutOnMian = async (email, password) => {
    localStorage.removeItem('username');
}