const possibleResults = {};
let apiKey = "";
let weatherCodes = [];
let messageResponses = [];

(function(){
    getApiKey();

    loadCountrySelect();

    loadFile('./resources/weather-codes.json', (response) => {
        weatherCodes = JSON.parse(response);
    });
    
    loadFile('./resources/message-responses.json', (response) => {
        messageResponses = JSON.parse(response);
    });
})();


async function loadCountrySelect(){
    const promise = await fetch(`https://restcountries.eu/rest/v2/all`);
    const data = await promise.json();
    const countries = data.map(x => ({name: x.name, code: x.alpha2Code}));
    
    let select = document.getElementById("countries");
    let placeHolder = document.createElement("option");
    placeHolder.id = "empty";
    placeHolder.innerHTML = "...";
    select.appendChild(placeHolder);

    for(let c of countries){
        let option = document.createElement("option");
        option.value = c.code;
        option.innerHTML = c.name;
        select.appendChild(option);
    }
}

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

async function getLocationData(){
    const responseMessage = document.getElementById("response");
    responseMessage.innerHTML = "Loading..."

    let location = document.getElementById("location").value.trim();

    if(location){
    const countryOptions = document.getElementById("countries").options;
    const countryIndex = document.getElementById("countries").selectedIndex;
    const countryValue = countryOptions[countryIndex].value;

    if(countryValue != "empty")
        location += "," + countryValue;
    }

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


document.getElementById("submitBtn").addEventListener("click", async ()  => {
    getLocationData();
});

document.getElementById("location").addEventListener("keyup", (e) => {
    if(e.code == "Enter")
        getLocationData();
});
