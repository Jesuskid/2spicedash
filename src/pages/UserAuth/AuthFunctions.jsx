import { generate_random_string } from "../../Constants";
import axios from 'axios';
import Cookies from "js-cookie";

export async function registerOnMainSite(email, name, password, newUserBlogId) {
    let formdata = new FormData();
    formdata.append('email', email.toLowerCase());
    formdata.append('userID', newUserBlogId);
    formdata.append('name', name);
    formdata.append('password', password);
    try {
        await axios({
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
                else if (res.data === newUserBlogId) {
                    let dt = new Date();
                    // Cookies.remove('data')
                    // Cookies.set('data', newUserBlogId, { expires: 365, domain: 'localhost' })
                    // Cookies.set('data', newUserBlogId, { expires: 365, domain: '.2spice.link' })
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
    } catch (err) {
        alert(err)
    }

}


export const loginMainWebsite = async (email, password) => {
    let formdata = new FormData();
    formdata.append('email', email.toLowerCase());
    formdata.append('password', password);
    try {
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
                    console.log('loggedIn')
                }

            })
            .catch(function (err) {
                console.log(err);
            })

    } catch (err) {
        alert(err)
    }


}


const setLoginCookie = (username) => {
    let expireAfter = new Date();
    //setting up  cookie expire date after a year
    expireAfter.setDate(expireAfter.getDate() + 365);
    //now setup cookie
    let baseDomain = '.2spice.link';
    document.cookie = "data=" + username + "; domain=" + 'localhost' + "; expires=" + expireAfter + "; path=/";
    document.cookie = "data=" + username + "; domain=" + baseDomain + "; expires=" + expireAfter + "; path=/";


}

export const logoutOnMian = async (email, password) => {
    let expireAfter = new Date();
    localStorage.removeItem('username');
    document.cookie = "data=" + null + "; domain=" + 'localhost' + "; expires=" + expireAfter + "; path=/";
    let baseDomain = '.2spice.link';
    document.cookie = "data=" + null + "; domain=" + baseDomain + "; expires=" + expireAfter + "; path=/";
    Cookies.remove('data')

}

export const changePass = async (email, newPassword) => {
    let formdata = new FormData();
    formdata.append('email', email.toLowerCase());
    formdata.append('password', newPassword);

    axios({
        url: `https://2spice.link/app/backend/changePassword.php`,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: formdata
    })
        .then(function (res) {
            if (res.data === 'Success') {
                // alert('Password changed');
                if (localStorage.getItem('username') !== null) {
                    localStorage.removeItem('username');
                    Cookies.remove('data')
                    alert('password reset successfully')
                }
            }
            else {
                alert(res.data);
            }
        })
        .catch(function (err) {
            console.log(err);
            alert(err)
        })

}

