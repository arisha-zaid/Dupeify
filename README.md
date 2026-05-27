# Dupeify-Browser Extension for Finding Product Alternatives
is a browser extension that helps users discover affordable perfume dupes while browsing ecommerce websites.

The extension detects perfume products directly from webpages, extracts product information, and recommends similar fragrances using semantic similarity and vector search.

## Features
Detects perfume products from ecommerce websites
Extracts product title, image, brand, and description
Finds affordable perfume dupes using AI embeddings
Lightweight browser extension UI
Real-time recommendation workflow
Supports semantic similarity matching

## Tech Stack
### Frontend
React
JavaScript
Plasmo Framework
### Backend
Node.js
Express.js
AI / Search
Vector Embeddings
Pinecone Vector Database
Semantic Similarity Search

## How It Works
User opens a perfume product page.
Extension captures product information from the webpage.
Product text is converted into embeddings.
Vector similarity search is performed.
Matching perfume dupes are displayed to the user.

## Folder Structure
src/
 ├── components/
 ├── popup/
 ├── content/
 ├── background/
 ├── services/
 └── utils/

## Future Improvements
Multi-category support beyond perfumes
Price comparison integration
Influencer recommendation scoring
User reviews and ratings
Personalized recommendations
Chrome Web Store deployment
Installation

## Clone repository
git clone <repo-url>


## Install dependencies
npm install


## Start development
npm run dev

###images 
src/img

## Learning Outcomes
Browser extension development
DOM scraping and webpage parsing
Vector embeddings and semantic search
React-based extension UI development
API integration and recommendation systems
