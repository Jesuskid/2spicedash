import React, { useState } from 'react'
import Menu from './Menu'
import { Link } from 'react-router-dom';
import styles from '../css/Landing.module.css';

function Landing() {
    const [back, setBack] = useState('navBar-trans')

    function some() {
        document.addEventListener('scroll', handleScroll);
        function handleScroll() {
            const box = document.querySelector('#roll');
            let x = box.getBoundingClientRect().top;
            if (x === 0) {
                setBack('navBar-trans');
            }
            else {
                setBack('navBar-white');
            }
        }
    }

    function sendOut(lnk) {
        window.location = lnk;
    }
    return (
        // some(),
        <>
            <Menu bg={back} />
            <div className={styles.bodyDiv} id="roll">
                <div className={styles.lead}>
                    <div className={styles.leadCont}>
                        <h1>
                            Investment Growth
                        </h1>
                        <p>
                            When good investment yield matters, choose 2spice token. <br />
                            A BSC token with classic algorithm that ensures consistent growth while also preventing the
                            token from crashing even if whales dump it. This places it among the leading investment
                            windows in the crypto world.
                        </p>
                        <Link to="/auth" state={true} className={styles.signup}><span>Sign Up</span></Link>
                        <Link to="/auth" state={false} className={styles.signin}><span>Sign In</span></Link>
                        <div className={styles.socialCont}>
                            <Link to="#" id={styles.discord}>
                                <svg viewBox="0 0 598 455" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M506.32 38.4278C506.154 38.1062 505.879 37.8541 505.544 37.7169C466.826 
                            19.9522 425.966 7.28459 383.988 0.0310717C383.607 -0.03983 383.213 0.0113193 382.862 
                            0.177245C382.512 0.343171 382.222 0.615426 382.035 0.95529C376.472 11.0535 371.421 
                            21.4261 366.902 32.0334C321.653 25.1646 275.626 25.1646 230.376 32.0334C225.828 
                            21.3992 220.696 11.024 215.005 0.95529C214.809 0.622812 214.519 0.356827 214.17 
                            0.191979C213.822 0.0271311 213.431 -0.0289399 213.051 0.0310717C171.068 7.26936 
                            130.206 19.9379 91.4924 37.7179C91.161 37.8584 90.8814 38.0983 90.6921 38.4044C13.272 
                            154.021 -7.93624 266.795 2.46783 378.173C2.4971 378.446 2.58096 378.71 2.71443 
                            378.95C2.84791 379.19 3.02827 379.4 3.24478 379.569C48.3258 412.948 98.7494 438.427 
                            152.364 454.917C152.741 455.031 153.145 455.025 153.519 454.903C153.894 454.78 154.222 
                            454.545 154.459 454.231C165.974 438.563 176.178 421.971 184.965 404.626C185.086 
                            404.388 185.155 404.127 185.168 403.86C185.18 403.593 185.136 403.327 185.039 
                            403.079C184.941 402.831 184.791 402.606 184.6 402.419C184.41 402.233 184.181 402.089 
                            183.931 401.997C167.841 395.841 152.264 388.419 137.346 379.803C137.075 379.643 
                            136.847 379.42 136.683 379.152C136.519 378.884 136.424 378.579 136.405 378.265C136.386 
                            377.952 136.445 377.638 136.577 377.352C136.708 377.067 136.908 376.818 137.158 
                            376.628C140.288 374.283 143.42 371.843 146.409 369.379C146.675 369.161 146.996 369.02 
                            147.337 368.974C147.678 368.929 148.025 368.979 148.339 369.119C246.072 413.723 351.88 
                            413.723 448.456 369.119C448.771 368.97 449.122 368.913 449.467 368.954C449.813 368.996 
                            450.14 369.136 450.41 369.356C453.4 371.82 456.531 374.283 459.685 376.628C459.937 
                            376.816 460.138 377.063 460.271 377.348C460.405 377.632 460.466 377.945 460.45 
                            378.259C460.434 378.573 460.34 378.878 460.178 379.147C460.016 379.416 459.79 379.642 
                            459.52 379.803C444.637 388.492 429.045 395.909 412.913 401.974C412.663 402.069 412.435 
                            402.216 412.246 402.406C412.056 402.595 411.908 402.822 411.812 403.072C411.716 403.323 
                            411.674 403.591 411.689 403.858C411.704 404.126 411.775 404.387 411.898 404.626C420.833 
                            421.875 431.021 438.445 442.381 454.203C442.611 454.527 442.938 454.769 443.314 
                            454.897C443.69 455.024 444.096 455.03 444.476 454.914C498.187 438.48 548.698 412.999 
                            593.836 379.569C594.056 379.409 594.239 379.203 594.373 378.966C594.507 378.73 594.588 
                            378.467 594.613 378.196C607.068 249.432 573.76 137.582 506.32 38.4278ZM199.561 
                            310.355C170.136 310.355 145.891 283.353 145.891 250.191C145.891 217.028 169.666 190.024 
                            199.561 190.024C229.69 190.024 253.7 217.263 253.23 250.189C253.23 283.353 229.454 
                            310.355 199.561 310.355ZM397.994 310.355C368.57 310.355 344.325 283.353 344.325 
                            250.191C344.325 217.028 368.1 190.024 397.994 190.024C428.124 190.024 452.134 217.263 
                            451.664 250.189C451.664 283.353 428.124 310.355 397.994 310.355Z"
                                        fill="white" />
                                </svg>

                            </Link>
                            <Link to="#" id={styles.telegram}>
                                <svg viewBox="0 0 569 477" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M567.079 43.4187L481.259 448.145C474.784 476.71 457.899 483.819 433.905 470.362L303.143 374.005L240.048 434.688C233.065 441.671 227.225 447.511 213.768 447.511L223.163 314.337L465.516 95.3426C476.054 85.948 463.231 80.7429 449.139 90.1375L149.53 278.79L20.5457 238.419C-7.51097 229.659 -8.01878 210.362 26.3855 196.905L530.897 2.53982C554.257 -6.21994 574.696 7.7449 567.079 43.4187V43.4187Z" fill="white" />
                                </svg>
                            </Link>
                            <Link to="#" id={styles.twitter}>
                                <svg viewBox="0 0 565 459" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M564.813 54.3339C544.05 63.5634 521.704 69.789 498.257 72.5751C522.197 58.2435 540.553 35.5423 549.209 8.46136C526.817 21.7496 502.029 31.3919 475.625 36.5971C454.494 14.0793 424.375 0 391.046 0C327.058 0 275.178 51.8803 275.178 115.879C275.178 124.948 276.198 133.788 278.182 142.284C181.873 137.446 96.4802 91.3208 39.3258 21.2107C29.3511 38.3169 23.6414 58.2206 23.6414 79.4772C23.6414 119.674 44.0954 155.148 75.1892 175.923C56.2027 175.315 38.3284 170.099 22.7012 161.419C22.6897 161.901 22.6897 162.394 22.6897 162.887C22.6897 219.021 62.6347 265.845 115.65 276.508C105.928 279.145 95.6891 280.566 85.1181 280.566C77.6427 280.566 70.3852 279.844 63.3112 278.48C78.0669 324.513 120.855 358.026 171.555 358.954C131.896 390.037 81.9422 408.565 27.6427 408.565C18.2986 408.565 9.06902 408.014 0 406.936C51.2956 439.83 112.199 459 177.631 459C390.782 459 507.326 282.435 507.326 129.305C507.326 124.283 507.223 119.273 507.005 114.297C529.638 97.9936 549.289 77.5739 564.813 54.3339Z" fill="white" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                    <div className={styles.leadmedia}>
                        <div></div>
                    </div>
                </div>
                <div className={styles.punchDiv}>
                    <p>
                        Play games, entertain yourself, and share ideas and creativity in the form of music, art, and
                        more, and get rewarded with spice coins. Much fun awaits you!
                    </p>
                    <div className={styles.anime}>
                        <div className={styles.circle}></div>
                    </div>
                </div>
                <div className={styles.service}>
                    <h1>Ways to Earn 2spice token </h1>
                    <div className={styles.serviceCont}>
                        <div className={styles.serviceHold}>
                            <div className={styles.blog}></div>
                            <h3>
                                Earn more <br />
                                from blogging
                            </h3>
                            <p>
                                Blogging has never been easier and more gainful. Make money while sharing contents of
                                your choice on 2spice.link and engaging your readers in discussion.
                            </p>
                        </div>
                        <div className={styles.serviceHold}>
                            <div className={styles.help}></div>
                            <h3>
                                Get help
                            </h3>
                            <p>
                                We don't look away when someone needs a financial support to be up again. If you are that someone
                                right now, just tell your story and it might just be a lucky try.
                            </p>
                        </div>
                        <div className={styles.serviceHold}>
                            <div className={styles.promo}></div>
                            <h3>
                                2spice art <br />
                                promotions
                            </h3>
                            <p>
                                Your first lesson to 'Sell' is to be very good at 'Buying'. Showcase your music, paintings, creativity,
                                ideas, and talent with 2Spice to those that matter and earn. Instead of asking upcoming artists to pay for
                                publicity, we pay them through the community's reward system.
                            </p>
                        </div>
                        <div className={styles.serviceHold}>
                            <div className={styles.money}></div>
                            <h3>
                                Offerwall
                            </h3>
                            <p>
                                You can earn 60 mins/ every hour, 24 hours/every week. No more free tasks. Check out offers, surveys,
                                and tasks you will like, customized to your interests, and complete them to earn 2spice token
                            </p>
                        </div>
                        <div className={styles.serviceHold}>
                            <div className={styles.cart}></div>
                            <h3>
                                Shop digital
                            </h3>
                            <p>
                                Finally, a way for digital content creators to sell their products digitally, build an online portfolio or
                                showcase their work. Shop digital allows you to sell your products in a convenient and efficient way.
                            </p>
                        </div>
                        <div className={styles.serviceHold}>
                            <div className={styles.game}></div>
                            <h3>
                                Play game, catch <br />
                                fun, and earn
                            </h3>
                            <p>
                                A game lover? <br />
                                It just became better than ever, with the possibility of earning some cool cash while catching fun.
                            </p>
                        </div>
                        <div className={styles.serviceHold}>
                            <div className={styles.affiliate}></div>
                            <h3>
                                Reward Affliliate <br />
                                programme
                            </h3>
                            <p>
                                We have an affiliate program that pays a (***%) commission o Earn more money by simply
                                referring friends and family to our website
                            </p>
                        </div>
                        <div className={styles.serviceHold}>
                            <div className={styles.swap}></div>
                            <h3>
                                Swap
                            </h3>
                            <p>
                                Enjoy the value of using coins for everyday purposes. You can collect, trade, and swap
                                your coins for another on our site.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Landing
