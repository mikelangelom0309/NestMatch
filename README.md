# NestMatch
## NestMatch & Summary
NestMatch is a web application that uses natural language processing (NLP) and vector databases to help users find their ideal homes with simple query searching. It matches your preferences and quickly delivers the best options available, designed to make the house-searching procedure faster, smarter, and more intuitive.

## Target User
Anyone in the market looking for a home. Practical for users that feel overwhelmed by traditional search filters and desire a more interactive, tailored, user-friendly real-estate search.

## Purpose & Problem Statement
Finding a new home is one of the most significant decisions a person makes, but the process is often tedious, with the current tools for it being limiting. Users need to input exact details like square footage, number of bedrooms, or price range. These specific searches and precision required for terms can result in missed opportunities / searches that the user may be satisfied with more instead.
NestMatch solves this by letting users to simplify their preferences through natural language, similar to a conversation / AI agent. This app matters because it makes the search process more intuitive and simple. 

## Core Features
1. **Natural Language Search**: Users can type search queries in simple, natural English. Inputting searches such as "3 bed 2 bath under $400k" or "house with a big backyard and driveway in Gainesville."

2. **Real-time Search Results**: As the user types their query, NestMatch simultaneously filters the listings and provides instant recommendations, ranking them based on similarity to user searches and the updating query.

3. **Interactive Map**: Displays results on an interactive map for easy visualization of property locations.

## Technical Overview
-**Frontend**:The frontend will be built using **React** to provide a dynamic and responsive UI. It communicates to the backend via **GraphQL** to request data and send search queries and output results.

-**Backend**: The backend is powered by **Node.js** and **Express.js**, handling requests from the frontend. It processes the natural language queries.

-**Database**: **MongoDB** is used to store user data, listings, and property details.


