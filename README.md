# Final Project - TinderTable
#### COMS E6998 Cloud Computing and Big Data

We plan to design a website where users can create a new account and start planning your meal! In the searchbar, you can not only search the restaurants, but also use GPS location to navigate to the restaurants nearby. 

#### Features We Have
 - Restaurant entity with descriptions and reviews
 - Customer account
 - Pool for pick

#### Tools We Used
  - Restaurants & their review data - Yelp API
  - Geosearch Google Maps Geocoding API - Google Map API

### Development

Open your favorite Terminal and run these commands.

To install Pymongo:

```sh
$ pip install -I pymongo -t .
```
To run NodeJS:
```sh
$ npm start
```

Verify the deployment by navigating to your server address in your preferred browser.

```sh
localhost:8080
```

  
#### Some Main Lambda Functions
  1. **Invite**: Invite the person you want to eat with
  2. **Waitlist**: Just add the user to the waitlist if  the user didn't choose their tablemate
  3. **Search**: Search the restaurant by keywords and locations
