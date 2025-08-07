import React from "react";
import "./home.css";

export function Home() {
  const photos = [1, 2, 3, 4, 5, 6];

  return (
    <div className="home-container">
      <h1>Welcome to the Home Page</h1>

      {/* Marquee section */}
      <div className="marquee">
        <div className="marquee-track">
          {photos.concat(photos).map((num, index) => (
            <img
              key={index}
              src={`/assets/healthy${num}.jpg`}
              alt={`healthy${num}`}
              className="marquee-img"
            />
          ))}
        </div>
      </div>

      {/* Content section */}
      <div>
        <h1>Nutrients Tracker Homepage</h1>
        <div>
          <div>
            <p>
              Hello, and welcome to your interactive Nutrients Tracker webpage! You are starting your journey
              towards better health and nutrition. Are you tired of months and years with ZERO progress? We are here
              to help you! We want you to live a vital healthy life. At Nutrients Tracker, we can guide you with one-on-one
              coaching and advisement to help you make informed choices about your meals, track your daily intake, and set achievable goals.
              Our easy-to-use tools and expert support are designed to empower you every step of the way.
              Start today and discover how small changes can lead to lasting results!
            </p>
            <p>
              With Nutrients Tracker, you can log your foods, monitor your calories, and visualize your nutrition breakdown in real time.
              Whether you want to lose weight, or simply eat healthier, our platform can adapt to your personal needs.
              Join our supportive community, access personalized meal plans, and receive actionable feedback to keep you motivated.
              Your journey to better health starts here. Let’s make every meal count!
            </p>
            <p>Track your daily nutrient intake and stay healthy!</p>
            <p>Use the navigation menu to explore features.</p>
          </div>

          <div>
            <h2>Food</h2>
            <p>There are loads of delicious healthy options for you to choose from!</p>
            <ul>
              <li>Egg</li>
              <li>Rice</li>
              <li>Chicken Breast</li>
              <li>Apple</li>
              <li>...and so much more!</li>
            </ul>
            <p>Browse our database to find foods that suit your nutrition goals!</p>
          </div>

          <div>
            <h2>Nutrition</h2>
            <p>Understanding your nutrition is key to achieving your health goals.</p>
            <ul>
              <li>Calories: The energy you consume.</li>
              <li>Carbohydrates: Your body's main energy source.</li>
              <li>Fats: Essential for hormone production and nutrient absorption.</li>
              <li>Proteins: Crucial for muscle repair and growth.</li>
            </ul>
            <p>Learn more about how each nutrient affects your body and how to balance them effectively!</p>
          </div>

          <div>
            <h2>Food Logger</h2>
            <p>Keep track of your calories and carbs intake with our food tracker. There is 
              no need to count calories manually, our system does it for you! It can help
              you plan out your meals efficiently and hold you accountable of your daily eating
              habits.</p>

            <img src="diagram.png" alt="Food Logger" className="home-diagram" />

            <p>Use the food logger to:</p>
            <ul>
              <li>Log your meals and snacks.</li>
              <li>Monitor your daily calorie intake.</li>
              <li>Track your macronutrients (carbs, fats, proteins).</li>
              <li>Set and achieve your nutrition goals.</li>
            </ul>
          </div>

          <div>
            <h2>Profile</h2>
            <p>Your profile is your personal hub for managing your nutrition journey. Here, you can:</p>
            <ul>
              <li>View and edit your personal information.</li>
              <li>Set your nutrition goals.</li>
              <li>Track your progress over time.</li>
              <li>Access personalized recommendations.</li>
            </ul>
            <p>Keep your profile updated to get the most out of our platform!</p>
          </div>

          <div>
            <h2>Community</h2>
            <p>Join our community of health enthusiasts on our discussions panel! Share your experiences, ask questions, and get support from others on similar journeys.</p>
            <ul>
              <li>Participate in discussions.</li>
              <li>Share your success stories.</li>
              <li>Get tips and advice from fellow users.</li>
            </ul>
            <p>Together, we can achieve more!</p>
          </div>

          <div>
            <h2>Get Started</h2>
            <p>Ready to take control of your nutrition? Start by creating an account or logging in to your existing profile. 
              Explore our features, set your goals, and begin your journey towards a healthier you! Be sure to contact your
              physician</p>
            <p>Remember, every small step counts. Let’s make your nutrition journey enjoyable and rewarding!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
