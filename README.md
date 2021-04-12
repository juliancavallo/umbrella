# umbrella
Created with OpenWeatherMap API

This page shows an advice to take an umbrella, based on weather conditions.

## API key
To run it locally, I reccomend you to get and API key from the weather API provider. I use a key retrieved from my own Node.js server hosted in Heroku, but it will only work if you run the project with an SSL certificate. If you use Live Server with VS Code, it will run without this certificate.
<<<<<<< HEAD

Also, my server provides the key only if you make the api call from my portfolio domain, so it will not work from any local environment
=======
>>>>>>> a745a1d (Update README.md)

To get an API key, you need to create an account in [Open Weather Map](https://openweathermap.org/) (you can select the free subscription), go to My API keys, and click on Generate on the key that appears in the screen.

Then, copy the key and paste it at the beginning of the app.js file, in the declaration of the apiKey const. The line of code should look like this:
`let apiKey = "your-api-key";`

Also, you must comment or delete the line where we call the getApiKey() function, in the app.js file, so it doesn't get the api key from the server. Otherwise, the app will throw an error because it will going to make an api call without the proper certificate.

`(function(){
    //getApiKey();
    ...
`

## Messages
All the messages shown are in the **resources/message-responses.json** file. You can modify it to add your custom messages
