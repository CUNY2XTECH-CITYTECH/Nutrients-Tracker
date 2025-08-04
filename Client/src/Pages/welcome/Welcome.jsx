import { Header } from "../../Components/Header"
import { Link } from "react-router-dom"
import "./welcome.css"

export function Welcome () {
    return(
        <div className="welcome-page-parent">
            <Header/>
            <div className="welcome-page-body">
                <div className="welcome-section-one">
                    <h1 className="title">Welcome to Nutrient Tracker – Your Ultimate Nutrition Companion</h1>
                    <h1 className="sub-title">Take Control of Your Health, One Bite at a Time</h1>
                    <div className="body">
                    <h2 className="text">Struggling to keep track of what you eat? Want to make smarter food choices 
                        but don’t know where to start? Nutrient Tracker is here to help! Our easy-to-use 
                        web application empowers you to log your meals, track nutrients, and stay on top 
                        of your health goals—whether you’re looking to lose weight, build muscle, or simply 
                        eat a more balanced diet.</h2>
                        <img src="welcome-section-one-img.avif" alt="food stock photo" className="img"></img>
                    </div>
                </div>
                <div className="welcome-section-two">
                    <h1 className="sub-title">Why Join Nutrient Tracker?</h1>
                    <div className="body">
                        <div className="reason-one reason">
                            <h2 className="reason-title">Effortless Food Logging</h2>
                            <p>Quickly add foods to your breakfast, lunch, or dinner with just a few clicks.</p>
                        </div>
                        <div className="reason-two reason">
                            <h2 className="reason-title">Comprehensive Nutrient Tracking</h2>
                            <p className="reason-detail">Monitor not just calories but also macros (carbs, protein, fats) 
                                and essential vitamins and minerals.</p>
                        </div>
                        <div className="reason-three reason">
                            <h2 className="reason-title">Personalized Insights</h2>
                            <p className="reason-detail">See which nutrients you’re missing and discover foods that fit your diet.</p>
                        </div>
                        <div className="reason-four reason">
                            <h2 className="reason-title">Progress Visualization</h2>
                            <p className="reason-detail">Track your eating habits over time with intuitive graphs and reports.</p>
                        </div>
                        <div className="reason-five reason">
                            <h2 className="reason-title">Flexible & User-Friendly</h2>
                            <p className="reason-detail">Log meals for today or previous days, edit entries, and customize your profile.</p>
                        </div>
                    </div>
                </div>
                <div className="welcome-section-three">
                    <h1 className="title">Key Features</h1>
                    <div className="body">
                        <div className="info info-1">
                            <h1 className="title">🍎 Food Database with Detailed Nutrition Info</h1>
                            <p>Access a vast library of foods, each with a full nutritional breakdown—from 
                                calories and protein to vitamins like B12, C, D, and minerals like iron and 
                                calcium.</p>
                        </div>

                        <div className="info info-2">
                            <h1>👤 Personalized User Profiles</h1>
                            <p>Set up your profile with age, weight, height, and gender to get tailored 
                                recommendations and track progress that matters to you.</p>
                        </div>

                        <div className="info info-3">
                            <h1>📅 Daily & Historical Logging</h1>
                            <p>Log meals for today or go back to previous days to maintain a complete 
                                diet history. Never miss a meal again!</p>
                        </div>

                        <div className="info info-4">
                            <h1>📊 Smart Analytics & Trends</h1>
                            <p>View weekly and monthly reports to spot patterns, celebrate progress, and 
                                adjust your diet for better results.</p>
                        </div>

                        <div className="info info-5">
                            <h1>🔄 Edit & Refine Your Entries</h1>
                            <p>Made a mistake? No problem! Easily edit or delete logged foods to keep your records accurate.</p>
                        </div>

                        <div className="info info-6">
                            <h1>🚫 No Guesswork, Just Facts</h1>
                            <h3>Our platform ensures you log foods correctly:</h3>
                            <ul>
                                <li>Serving sizes must be greater than 0.</li>
                                <li>No future-dated entries—just realistic, actionable data.</li>
                                <li>All mandatory nutrition info is included for every food.</li>
                            </ul>
                        </div>
                    </div>   
                </div>
                <div className="welcome-section-four">
                    <div className="content">
                    <div className="type">    
                        <h1 className="title">Who Is This For?</h1>
                        <p className="type-one">-Health Enthusiasts: Optimize your diet for peak performance.</p>
                        <p className="type-two">-Weight Managers: Stay accountable with precise calorie tracking.</p>
                        <p className="type-three">-Fitness Buffs: Hit your protein goals and monitor macros.</p>
                        <p className="type-four">-Anyone Seeking Balance: Ensure you're getting enough vitamins and minerals daily.</p>
                    </div>
                    <div className="sign-up">
                        <h1>Ready to Transform Your Eating Habits?</h1>
                        <p>Sign up now—it's free! Take the first step toward a healthier, more informed you.</p>
                        <p>👉 <Link to="/signup">Get Started Today</Link> 👈</p>
                        <p>Already have an account? <Link to="/login">Log In</Link> to continue your journey.</p>
                    </div>
                    </div>
                    <img className="img" src="stock photo 3.jpg" alt="stock photo 3"></img>
                </div>
                <footer>
                    <p>(Note: Nutrient Tracker does not provide medical advice. Consult a healthcare professional before making significant dietary changes.)</p>
                    <p>© 2024 Nutrient Tracker. All rights reserved.</p>
                </footer>
            </div>

        </div>
    )
}