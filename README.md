# RestauRand



https://developers.google.com/maps/documentation/places/web-service/overview <- maps places api


Randomly selects a restaurant in waterloo for you to go to.
- maybe instead of waterloo it has a 20km radius or whatever (user can choose)
- add filters later



1. find out how to get a list of all restaurants in waterloo
- JSON stuff

2. display them
- yes

3. randomize
- obj["data"][*index*]



main page:
- button: "Find me a restaurant"
- if button click:
   - store random_rest. in localStorage
   - redirect to page with google map

maps page:
- show the restaurant location
- with other info
- another button: find me a differen restaurant.
