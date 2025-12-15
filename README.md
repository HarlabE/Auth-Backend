# Authentication Server (Node.js + Express)

This repository contains authentication server built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and **bcrypt**.  
It handles **user signup, login, and password reset using OTP**.

---

## Features

- User signup with hashed password  
- User login with password verification  
- Forgot password (OTP generation)  
- Reset password (OTP regeneration)  
- Secure password hashing using bcrypt  
- MongoDB integration with Mongoose  

---

## Tech Stack

- Node.js  
- Express.js  
- MongoDB  
- Mongoose  
- bcrypt  

---

## Project Structure


├── controllers
 ── auth.controller.js

├── models
 ── user.model.js

├── routes
 ── auth.routes.js

├── config
 ── db.js

├── app.js

└── README.md



---

## Installation & Setup

### 1. Clone the repository
git clone https://github.com/HarlabE/Auth-Backend.git

cd Auth-Backend



### 2. Install dependencies
npm install


### 3. Environment Variables

Create a `.env` file in the root directory:

PORT=
MONGO_URI=

### 4. Start the server
npm run dev


---

## Authentication Controllers

### Signup

Creates a new user account.

**Endpoint**
POST /api/users/signup


**Request Body**
{
"name": "John Doe",
"email": "john@example.com",
"password": "password123"
}


**Logic**
- Validates input fields
- Checks if user already exists
- Hashes password using bcrypt
- Generates OTP and expiry
- Saves user to the database

---

### Login

Authenticates an existing user.

**Endpoint**
POST /api/users/login


**Request Body**
{
"email": "john@example.com",
"password": "password123"
}


**Logic**
- Validates email and password
- Checks if user exists
- Compares hashed password

---

### Forget Password

Generates an OTP for password recovery.

**Endpoint**
POST /api/users/forget-password


**Request Body**
{
"email": "john@example.com"
}


**Logic**
- Validates email
- Checks if user exists
- Generates OTP and saves it

> Note: In production, OTPs should be sent via email or SMS.

---

### Reset Password (OTP Generation)

Regenerates OTP and expiry time.

**Endpoint**
POST /api/users/reset-password


**Request Body**
{
"email": "john@example.com"
}


**Logic**
- Validates email
- Generates OTP
- Sets OTP expiry time

---

## Security Notes

- Passwords are hashed using bcrypt
- OTPs have expiration times
- Do not expose OTPs in production
- Use email services like Nodemailer or SendGrid

---

## Possible Improvements

- JWT authentication  
- Email verification  
- OTP verification endpoint  
- Rate limiting  
- Input validation (Joi / Zod)  
- Refresh tokens  

---

## Author

Built by **Ganiyu Olagunju**
