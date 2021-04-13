const possibleResults = {};
let apiKey = "";
let weatherCodes = [];
let messageResponses = [];

(function(){
    getApiKey();

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

async function getApiKey(){
    const promise = await fetch(`https://apikey-server.herokuapp.com/key?name=openweather`);
    const data = await promise.json();
    apiKey = data.key;
}

async function getApiInfo(location){
    const promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
    const data = await promise.json();

    if(promise.status != 200)
        return {
            status: "ERROR",
            message: data.message
        };
    else
        return jsonResponse(data)
}

function jsonResponse(data){
    const weather = data.weather[0];
    const temp = data.main.temp.toFixed(1) + ' °C';

    const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
    const img = document.createElement("img");
    img.src = iconUrl;

    const message = getMessageByWeatherId(weather.id);

    return {
            status: "OK",
            message: message,
            details:{
                city: data.name + ", " + data.sys.country,
                img,
                temp
            }
    };
}

function getMessageByWeatherId(id){
    const match = weatherCodes.find(x => x.ids.includes(id));
    const messages = messageResponses.find(x => x.type == match.type).messages;
    return messages[Math.floor(Math.random() * messages.length)];
}


document.getElementById("submitBtn").addEventListener("click", async ()  => {
    getLocationData();
});

document.getElementById("location").addEventListener("keyup", (e) => {
    if(e.code == "Enter")
        getLocationData();
});

async function getLocationData(){
    const responseMessage = document.getElementById("response");
    responseMessage.innerHTML = "Loading..."

    const location = document.getElementById("location").value.trim();
    
    const apiResponse = await getApiInfo(location)

    responseMessage.innerHTML = apiResponse.message;

    if(apiResponse.status == "OK"){
        details.innerHTML = apiResponse.details.city;
        details.appendChild(apiResponse.details.img);
        details.innerHTML += apiResponse.details.temp;
    } else {
        details.innerHTML = "";
    }

    document.getElementById("location").value = "";
}
