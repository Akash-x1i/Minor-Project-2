const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector("#hourlyforecast");
const forecastCardsDiv = document.querySelector("#dailyforecast");
let cityName;

const API_KEY = "2b121bcd852c911591ed907765576054"; 

const createWeatherCard = (weatherItem, index) => {
    if(index === 0) {
        response = `<div class="inline-block px-3">
        <div class="w-36 h-40 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <div class="p-2">Now</div>`;
    }else {
        response = `<div class="inline-block px-3">
          <div class="w-36 h-40 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <div class="p-2">${Number(weatherItem.dt_txt.split(" ")[1].split(":")[0])}:00</div>`;
    }
    return response += `<div class="w-full h-20">
        <img class="mx-auto w-24 -mt-4" src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="${weatherItem.weather[0].description}"></div>
        <div class="p-2">${weatherItem.main.temp.toFixed(1)}℃</div>
        </div>
        </div>`;
}

const createdailyCard = (day, temp_min, temp_max, icon) => {
    return response = `
        <div class="inline-block px-3">
        <div class="w-36 h-48 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div class="p-2">${day}</div>    <div class="w-full h-20">
        <img class="mx-auto w-24 -mt-" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt=""></div>
        <div class="p-2 pb-0 text-lg">▴ ${temp_max} ℃</div>
        <div class="py-0 text-base">▾ ${temp_min} ℃</div>
        </div>
        </div>`;
}

const editCurrentDetails = (city, currTemp, currHT, currLT, currHumidity, feelsLike, icon) => {
    document.querySelector("#currTemp").innerHTML = `${currTemp}`;
    document.querySelector("#currHT").innerHTML = `${currHT}`;
    document.querySelector("#currLT").innerHTML = `${currLT}`;
    document.querySelector("#humidity").innerHTML = `${currHumidity}`;
    document.querySelector("#feelslike").innerHTML = `${feelsLike}`;
    document.querySelector("title").innerHTML = `${city}'s Weather Forecast`;
    document.querySelector("#title").innerHTML = `${city}'s Weather Forecast`;
    document.querySelector("#main-icon").innerHTML = `<img class="mx-auto" src="https://openweathermap.org/img/wn/${icon}@4x.png" width="400" alt="weather-icon">`;
}

const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${"2b121bcd852c911591ed907765576054"}&units=metric`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        
        // Create an array containing only the first forecast of the first day
        const firstForecastDate = new Date(data.list[0].dt_txt).getDate();

        // Find the first forecast that matches the first date
        const firstDayFirstForecast = data.list.find(forecast => {
            return new Date(forecast.dt_txt).getDate() === firstForecastDate;
        });
        console.log(firstDayFirstForecast.main.temp);
        const currTemp = [firstDayFirstForecast.main.temp.toFixed(1)];
        const currHT = [firstDayFirstForecast.main.temp_max.toFixed(1)]
        const currLT = [firstDayFirstForecast.main.temp_min.toFixed(1)]
        const currHumidity = [firstDayFirstForecast.main.humidity]
        const feelsLike = [firstDayFirstForecast.main.feels_like.toFixed(1)]
        const city = cityName;
        const icon = [firstDayFirstForecast.weather[0].icon]
        editCurrentDetails(city, currTemp, currHT, currLT, currHumidity, feelsLike, icon);


        // 5 day forecast

        const dailyTemperatures = {};

        // Iterate through the list
        data.list.forEach(entry => {
            const date = entry.dt_txt.split(" ")[0];
            const tempMin = entry.main.temp_min;
            const tempMax = entry.main.temp_max;

            if (!dailyTemperatures[date]) {
                dailyTemperatures[date] = {
                    min: tempMin,
                    max: tempMax
                };
            } else {
                dailyTemperatures[date].min = Math.min(dailyTemperatures[date].min, tempMin);
                dailyTemperatures[date].max = Math.max(dailyTemperatures[date].max, tempMax);
            }
        });
        
        forecastCardsDiv.innerHTML = "";

        function getDayName(date, today) {
            const dateObj = new Date(date);
            const todayObj = new Date(today);
        
            if (date.split("-")[2] == today) {
                return dayName = "Today";
            }else{
                const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                const dayName = dayNames[dateObj.getDay()];
                console.log(today, date);
                return dayName;
            }
        
            
        }

        for (const date in dailyTemperatures) {
            temp_min = dailyTemperatures[date].min.toFixed(1);
            temp_max = dailyTemperatures[date].max.toFixed(1);
            day = getDayName(date, firstForecastDate)
            html = createdailyCard(day, temp_min, temp_max, icon);
            forecastCardsDiv.insertAdjacentHTML("beforeend", html);
        }

            

        
        

        const hourlyForecast = data.list.slice(0, 9);
        // .filter(forecast => {
        //     const forecastDate = new Date(forecast.dt_txt).getDate();
        //     if (!uniqueForecastDays.includes(forecastDate)) {
        //         return uniqueForecastDays.push(forecastDate);
        //     }
        // });

        // Clearing previous weather data
        cityInput.value = "";
        weatherCardsDiv.innerHTML = "";

        // Creating weather cards and adding them to the DOM
        hourlyForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(weatherItem, index);
            weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            console.log(weatherItem.main.temp);
            
        });        
        // }).catch(() => {
        //     alert("An error occurred while fetching the weather forecast!");
    });
}

const getCityCoordinates = (cityName) => {
    city = cityInput.value.trim()
    cityName = city.charAt(0).toUpperCase() + city.slice(1)
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${"2b121bcd852c911591ed907765576054"}`;
    
    // Get entered city coordinates (latitude, longitude, and name) from the API response
    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { lat, lon, name } = data[0];
        console.log(lat, lon, name, cityName);
        getWeatherDetails(cityName, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords; // Get coordinates of user location
            // Get city name from coordinates using reverse geocoding API
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occurred while fetching the city name!");
            });
        },
        error => { // Show alert if user denied the location permission
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());