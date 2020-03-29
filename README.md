# SpeedLine Solutions Assignment

Below are the answers for the provided questions 

## Step 1.
This proposed "mushup" sounds very feasible. There are only a few key functionalities that need to be included into this final project. First, I would need to be able to display a map of British Columbia in a web based application. Next, I will need to be able to overlay markers that indicate where the cities of interest are on the map. Lastly, I will need to be able to retrieve weather information and then overlay it on the map as well. For this proof of concept, the front end of the application is simple HTML and CSS, and the more advanced functionality is implemented using Node.js. There are two third party APIs that are called by this web application. The first is the JavaScript Google Maps API, which can be found [here](https://developers.google.com/maps/documentation/javascript/tutorial), that is used to retrieve the map which will be displayed to the users. The second is the OpenWeather API, which can be found [here](https://openweathermap.org/), that is used for retrieving the real time weather conditions. To deploy this web application, I have it running on a small EC2 instance. These tools and technologies are very prevalent in production web applications, but the main limitation would be the deployment platform. The EC2 instance that this service is deployed on is a free tier instance, and it would probably require something that could handle a greater load. In order to evaluate the key functionality described above, the foremost method I could use is manual testing. I can run the web application and ensure that the map loads correctly with the correct markers and displays the information when I interact with the markers. An additional method to test the last key functionality would be to write unit tests that would be able to test if I am able to retrieve data from the OpenWeather API correctly. I believe that I would be able to completely finish this proof of concept in the allotted time

## Step 2.
The source code for the completed proof of concept can be found in this [repository](https://github.com/daniel-levy/SpeedLineSolutionsAssignment) and the web application itself can be found [here](http://ec2-18-222-173-54.us-east-2.compute.amazonaws.com:3000/)

## Step 3.
1. There are several architecture and design changes that I would like when moving this project from prototype to production. First, I believe adding a database instance would benefit in ensuring there is fault prevention and allowing for more features to be added that deal with weather history. The idea would be that data would be retreived and stored in the database so that if there is a fault with the external service, the user could still see some historical information as oppposed to an error message. Additionally, if this project was to move from a prototype to production, there would need to be some secret management that would have to be done in order to protect API keys. 
2. In order to make this code more maintainable, I believe a big step that could be done would be to utilize the database instance that I talked about in the previous step in order to store the NCPC locations. Currently, the locations are stored in a static object that is used to initialize the markers on the map. The markers for each location are also explicitly created and placed individually. If one wanted to add additional locations, they would need to add the information to the object in the source code, and then add the code that would initialize the location's marker explicitly. Ideally, it would be best if we could have a database instance that would have the information about the cities, and then the code could retrieve all of the information from the database and then create and place the markers for any number of cities, which is much more scalable than what we currently have now

