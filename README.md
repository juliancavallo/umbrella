# umbrella
Created with OpenWeatherMap API

This page shows an advice to take an umbrella, based on weather conditions.

## API key
To run it locally, you need to create a **config.js** file in the root directory, and the content should look like this:

> var config = {
>    apiKey: "your-api-key"
> }

To get an API key, you need to create an account in [Open Weather Map](https://openweathermap.org/) (you can select the free subscription), go to My API keys, and click on Generate on the key that appears in the screen.


## Messages
All the messages shown are in the **resources/message-responses.json** file. You can modify it to add your custom messages
