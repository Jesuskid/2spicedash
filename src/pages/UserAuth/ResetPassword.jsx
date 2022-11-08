import React, { useState } from 'react'
import { useMoralis } from 'react-moralis'
import { Button } from 'react-bootstrap'

const ResetPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const { user, Moralis } = useMoralis()

    const resetPassword = async () => {
        if (email) {
            await Moralis.User.requestPasswordReset(email)
                .then(() => {
                    // Password reset request was sent successfully
                    setMessage('Password reset email has been sent to your email')
                }).catch((error) => {
                    // Show the error message somewhere
                    setMessage(`Error: ${error.code} ${error.message}`)
                    alert("Error: " + error.code + " " + error.message);
                });
        } else {
            setMessage("Invalid email")
        }

    }

    return (
        <div className=''>
            <div className=''>
                <form className=''>
                    <h3>Reset Password</h3>
                    <input className='form-control my-3' type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    {!loading ? <Button className='w-100 my-2 red-btn' onClick={() => resetPassword()}>Reset</Button> :
                        <Button className='w-100 my-2 red-btn'>
                            <div class="spinner-border text-light" role="status">
                                <span className="sr-only"></span></div></Button>}

                </form>
                <div>{message}</div>
            </div>
        </div>
    )
}

export default ResetPassword