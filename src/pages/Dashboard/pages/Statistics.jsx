import React, { useState } from 'react'
import { Row, Col, Button, Card } from 'react-bootstrap'
import spiceLogo from '../../../assets/spice.png'
import '../Dashboard.css'
import { useMoralis, useMoralisQuery } from 'react-moralis'
import { round } from '../../../Constants'
const Statistics = () => {

    const { Moralis, user } = useMoralis()

    const [earnings, setEarnings] = useState({})

    const oneMonthBack = ''
    const oneWeekAgo = ''
    const last24Hours = ''

    const ONE_MONTH = new Date()
    const currentM = ONE_MONTH.getMonth()
    const sixM = ONE_MONTH.setMonth(currentM - 1);

    const dateObj = new Date()
    const currentDate = dateObj.getDate()
    dateObj.setDate(currentDate - 1)

    const date30 = new Date()
    const currentDate30 = date30.getDate()
    date30.setDate(currentDate30 - 31)

    const weekDateObj = new Date()
    const currentWeekDate = weekDateObj.getDate()
    weekDateObj.setDate(currentDate - 7)

    const { fetch: fetchGems } = useMoralisQuery(
        "Gems",
        (query) => query.equalTo("email", user.get('email')).greaterThanOrEqualTo('createdAt', date30).limit(10000),
        [],
        { autoFetch: false }
    );


    const fetch_games = async () => {
        const results = await fetchGems()
        let values = []
        let day = 0;
        let month = 0;
        let week = 0;
        let id = 0
        for (let i = 0; i < results.length; i++) {
            const object = results ? results[i] : null
            const date = new Date(object.createdAt)
            let mDate = new Date(sixM)
            let gem = object?.get('gems')
            if (date > dateObj) {
                if (gem > 0) { day += gem }
            }
            if (date > date30) {
                console.log(gem)
                if (gem > 0) { month += gem }
            }
            if (date > weekDateObj) {
                console.log(gem)
                if (gem > 0) { week += gem }
            }

            id += 1
        }

        setEarnings({ 'day': round(day, 5), 'month': round(month, 3), 'week': round(week, 3) })
    }



    const loadGems = async (date) => {
        const User = Moralis.Object.extend('_User')
        const query = new Moralis.Query(User)
        const myDetails = query.lessThan('createdAt', date)
        const prevBalance = myDetails?.get('gem_balance')
        console.log(prevBalance)
        return prevBalance
    }

    React.useEffect(() => {
        fetch_games()
    }, [])

    return (
        <div style={{ height: '100vh' }}>
            <div className='py-4'>
                <h5 className='mb-4 d-flex align-items-start'>Your earnings:</h5>
                <Row>
                    <Col className='my-3' sm={6} md={4}>
                        <div className='card-o p-4 d-flex align-items-start flex-column'>
                            <h4>Today</h4>
                            <small className='text-blue'>{earnings['day']}</small>
                            <small className='text-sm pt-1'>Last 24 hours</small>
                        </div>
                    </Col>
                    <Col className='my-3' sm={6} md={4}>
                        <div className='card-o p-4 d-flex align-items-start flex-column'>
                            <h4>Past Week</h4>
                            <small className='text-blue'>{earnings['week']}</small>
                            <small className='text-sm pt-1'>From {weekDateObj.toString().slice(4, 15)} to {Date().toString().slice(4, 15)}</small>
                        </div>
                    </Col>
                    <Col className='my-3' sm={6} md={4}>
                        <div className='card-o p-4 d-flex align-items-start flex-column'>
                            <h4>Past month</h4>
                            <small className='text-blue'>{earnings['month']}</small>
                            <small className='text-sm pt-1'>From {ONE_MONTH.toString().slice(4, 15)} to {Date().toString().slice(4, 15)}</small>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Statistics