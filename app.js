const possibleResults = {};
const apiKey = config.apiKey;
let weatherCodes = [];
let messageResponses = [];

(function(){
    loadFile('./resources/weather-codes.json', (response) => {
        weatherCodes = JSON.parse(response);
    });
    
    loadFile('./resources/message-responses.json', (response) => {
        messageResponses = JSON.parse(response);
    });
})();

function loadFile(path, callback){
    var xobj = new XMLHttpRequest();
    xobj.open('GET', path);
    xobj.onload = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send();  
}

document.getElementById("submitBtn").addEventListener("click", async ()  => {
    const responseMessage = document.getElementById("response");
    responseMessage.innerHTML = "Loading..."

    const location = document.getElementById("location").value.trim();
    
    const apiResponse = await getApiInfo(location)

    responseMessage.innerHTML = apiResponse.message;

    if(apiResponse.status == "OK"){
        details.innerHTML = apiResponse.details.city;
        details.appendChild(apiResponse.details.img);
    } else {
        details.innerHTML = "";
    }
});


async function getApiInfo(location){
    const promise = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`);
    const data = await promise.json();

    if(promise.status != 200)
        return {
            status: "ERROR",
            message: data.message
        };
    else
        return formatResponse(data)
}

function formatResponse(data){
    const weather = data.weather[0];
    const iconUrl = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`;
    const img = document.createElement("img");
    img.src = iconUrl;

    const message = getMessageByWeatherId(weather.id);

    return {
            status: "OK",
            message: message,
            details:{
                city: data.name + ", " + data.sys.country,
                img
            }
    };
}

function getMessageByWeatherId(id){
    const match = weatherCodes.find(x => x.ids.includes(id));
    const messages = messageResponses.find(x => x.type == match.type).messages;
    return messages[Math.floor(Math.random() * messages.length)];
}