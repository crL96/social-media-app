# Social Media App 

## Description
This project is the final project of the TOP curriculum! As the last project we will build something that covers multiple areas, a fullstack social media app!

This project will test knowledge of fullstack capabilities such as REST API, React, Prisma ORM, authentication, JWT, password handling, node, express, SQL/postgres, HTML, css, server-side and client side programming and debugging.

Link to project instructions: https://www.theodinproject.com/lessons/node-path-nodejs-odin-book

The main focus of this project is on tie together alot of the knowledge collected during the curriculum and to tie together a REST API backend with a frontend application (in this case a React app). The task is to build a social media app. In this specific one users can create accounts, follow each other, make posts, comment, like, update their profiles and more.

Passwords are hashed using Bcrypt, authentication is handeled with PassportJS and JWTs. All data is stored in a PostgreSQL server, handled with Prisma ORM.

## Getting Started
Live build: **https://postit-crl96.netlify.app/**

#### Run locally

##### Backend Server Installation

1. Clone the repository

2. Navigate to the backend directory: 
```terminal
cd social-media-app/backend
```

3. Run build command to install packages and init prisma client:
```terminal
npm run init-install
```

4. Setup a PostgreSQL database and add it's credentials to the .env in the next step.

5. Create a .env file in the backend directory, look at the .env.sample for clarification.

6. Run init db command to sync your postgres db with prisma schema: 
```terminal
npm run init-db
```

7. Run the server:
```terminal
npm run start
```

8. If you wish to populate the database with some dummy content for dev purposes, run the following command:
```
npx prisma db seed
```

##### Frontend React Installation

1. Clone the repository (if you haven't already)

2. Navigate to the frontend directory : 
```terminal
cd social-media-app/frontend
```

3. Install packages and dependencies:
```terminal
npm install
```

4. Create a .env file in the current directory, look at the .env.sample for clarification.

5. Run React app in dev server:
```terminal
npm run dev
```

6. Navigate to **http://localhost:5173**

## Technologies Used
Programming Languages: Javascript, HTML/JSX, CSS, SQL

Server-side Tools: NodeJS, Express, JWT, PassportJS, BcryptJS, Prisma ORM, PostgreSQL

Frontend Tools: React, Vite, CSS, HTML/JSX