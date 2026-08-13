# Thirukkural App

A simple Flask web application that allows users to search and explore Thirukkural verses from 1 to 1330.

## Features

- Search for a Kural using its number
- Fetch Kural data dynamically from the Thirukkural API
- Display the Tamil Kural
- Display Athigaram
- Display Athigaram Number
- Display Kural Meaning
- Random Kural option
- Previous and Next Kural navigation
- Responsive and modern user interface
- API key securely stored in `.env`

## Technologies Used

- Python
- Flask
- HTML
- CSS
- JavaScript
- REST API
- Python-dotenv
- Requests

## How It Works

The user enters a Kural number between 1 and 1330.

The JavaScript sends the Kural number to the Flask backend.

Flask reads the API key from the `.env` file and sends a request to the Thirukkural API.

The API returns the Kural information, which is then displayed on the website.

## Application Flow

User
↓
Enter Kural Number
↓
JavaScript
↓
Flask Backend
↓
Thirukkural API
↓
Kural Data
↓
Website

## Project Structure

Thirukkural_expo/
│
├── app.py
├── README.md
├── requirements.txt
├── .env
├── .gitignore
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js

## API

This project uses the Thirukkural API to fetch Kural information dynamically.

API Documentation:

https://thirukkural.docs.apiary.io/

## API Key Security

The API key is stored in the `.env` file and is accessed only by the Flask backend.

The API key is not included in:

- HTML
- JavaScript
- API responses
- GitHub repository

The `.env` file is added to `.gitignore`.

## Installation

Install the required packages:

```bash
pip install -r requirements.txt