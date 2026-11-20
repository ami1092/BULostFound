# BULostFound
 
Helping Binghamton University students get their lost items back.
 
## Table of Contents
 
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
## About The Project
 
BULostFound is a website that helps Binghamton University students find their lost items by connecting the people who find them with the people searching for them.
 
**The problem:** there is no consolidated, accessible way for students to get lost items back. Right now, reports go through campus police or anonymous Yik Yak posts.
 
**Our approach:** a faster system that sits closer to the students who use it.
 
- Sign-in is limited to `@binghamton.edu` Google accounts.
- Finders post items with a photo and description.
- Owners search by item type, location, and time frame, then contact the finder through a social contact.

### Built With
 
- HTML
- TypeScript
- Node.js and Express
- Supabase (PostgreSQL and Google OAuth)

## Getting Started
 
To get a local copy up and running, follow these steps.
 
### Prerequisites
 
- The latest version of [Node.js](https://nodejs.org/) (npm is included)
- Access to the project's Supabase project <!-- TODO: how teammates get access -->
### Installation
 
1. Clone the repo
```sh
git clone git@github.com:ami1092/BULostFound.git
```
2. Install backend packages and create your environment file
```sh
cd backend
npm install
cp .env.example .env
```
