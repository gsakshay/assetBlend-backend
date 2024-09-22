# AssetBlend API Endpoints

This document provides an overview of the available API endpoints in the AssetBlend backend.

## Authentication Routes (`/auth`)

- `POST /register`: Register a new user
- `POST /login`: User login
- `POST /refreshToken`: Refresh access token
- `POST /logout`: User logout
- `POST /forgotPassword`: Request password reset
- `POST /resetPassword`: Reset user password

## User Routes (`/user`)

- `POST /assets`: Add a new asset to user portfolio
- `GET /assets`: Fetch user's assets
- `POST /assets/:assetId`: Sell/remove an asset
- `POST /addAdvisor/:advisorId`: Add an advisor to user account
- `POST /removeAdvisor`: Remove advisor from user account
- `GET /dashboard`: Fetch user dashboard data

## Admin Routes (`/admin`)

- `POST /news`: Update news for crypto and stock tickers
- `GET /dashboard`: Fetch admin dashboard data
- `GET /requests`: Fetch pending advisor requests
- `POST /approve/:userId`: Approve an advisor request
- `DELETE /reject/:userId`: Reject an advisor request

## Advisor Routes (`/advisors`)

- `GET /`: Fetch list of advisors
- `GET /dashboard`: Fetch advisor dashboard data
- `GET /advisee`: Fetch list of advisees
- `GET /assets/:userId`: Fetch assets for a specific user
- `POST /sell/assets/:assetId`: Sell an asset for a user
- `POST /buy/:userId/assets`: Buy an asset for a user

## Account Routes (`/account`)

- `GET /`: Fetch current user details
- `GET /:userId`: Fetch user details by ID
- `POST /editDetails`: Update user account details

## Stock Routes (`/stocks`)

- `GET /`: Fetch list of stocks (with optional name filter)
- `GET /:stockId`: Fetch details of a specific stock

## Crypto Routes (`/crypto`)

- `GET /`: Fetch list of cryptocurrencies (with optional name filter)
- `GET /:cryptoId`: Fetch details of a specific cryptocurrency

## Role Routes (`/roles`)

- `GET /`: Fetch all roles
- `GET /permitted`: Fetch all permitted roles (excluding admin)
- `GET /:roleID`: Fetch details of a specific role

## Home Routes (`/guest`)

- `GET /`: Fetch home page data
- `POST /evaluate`: Evaluate asset worth

## Ticker Routes (`/ticker`)

- `GET /:assetId`: Fetch ticker data for a specific asset

Note: All routes (except authentication and some guest routes) require user authentication. Some routes also have role-based access control.
