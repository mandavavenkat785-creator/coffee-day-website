Coffee Day Web App
Welcome to the Coffee Day web application! This project is a full-stack coffee shop ordering and review system developed using Node.js, Express, MongoDB, and vanilla JS. It supports user registration, login, menu browsing, cart, order management, and user reviews.

Features
User Registration & Login: Secure authentication with password hashing using bcrypt.

Menu Browsing & Cart: Add coffee items to your cart, adjust quantities, and confirm orders.

Order History: View previous orders (persists per user in localStorage).

Review System: Submit reviews for the coffee shop and display them dynamically.

Responsive Design: User-friendly UI built with HTML, CSS, and JavaScript.

Technologies Used
Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express, MongoDB

Dependencies: express, mongoose, bcryptjs, body-parser, cors

Getting Started
Prerequisites
Install Node.js

Install MongoDB

Installation
Clone the repository and install dependencies:

bash
git clone https://github.com/yourusername/coffee-day.git
cd coffee-day
npm install
Running the App
Start MongoDB locally then run the backend server:

bash
npm start
The default server runs on port 5000.

Open login.html or main.html in your browser to use the app.

Project Structure
server.js — Express server, MongoDB connection, user & review schemas, API endpoints (/register, /login, /review)

login.html — Login & registration page

main.html — Main app loader (routes to login or index)

script.js — Handles menu UI, cart logic, orders, logout, and review form interaction

package.json — Lists project dependencies

Usage Example
Sign up, log in, add items to your cart, confirm your order, and submit a review.

Order history and reviews are displayed in the app.

Contributing
Contributions are welcome! Please submit a pull request or open an issue for suggestions.

note: node server.js
