function getWeather(location = document.getElementById('location').value) {
    if (location === '') {
        alert('Please enter a location');
        return;
    }
    
    const apiKey = '7d92efca66f24f1cb20134912252002';
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=5&aqi=yes`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('weather-result').innerHTML = '<p class="error">Location not found</p>';
            } else {
                const { temp_c, condition, humidity, wind_kph } = data.current;
                const icon = condition.icon.replace("64x64", "128x128");
                
                document.getElementById('weather-result').innerHTML = `
                    <div class="weather-info">
                        <img src="${icon}" alt="Weather icon">
                        <p><strong>Location:</strong> ${data.location.name}, ${data.location.country}</p>
                        <p><strong>Temperature:</strong> ${temp_c}°C</p>
                        <p><strong>Condition:</strong> ${condition.text}</p>
                        <p><strong>Humidity:</strong> ${humidity}%</p>
                        <p><strong>Wind Speed:</strong> ${wind_kph} kph</p>
                    </div>
                `;
                
                let forecastHtml = '';
                data.forecast.forecastday.forEach(day => {
                    forecastHtml += `
                        <div class="forecast">
                            <p><strong>${day.date}</strong></p>
                            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
                            <p>${day.day.condition.text}</p>
                            <p>Max: ${day.day.maxtemp_c}°C | Min: ${day.day.mintemp_c}°C</p>
                        </div>
                    `;
                });
                document.getElementById('forecast-result').innerHTML = forecastHtml;
            }
        })
        .catch(error => {
            document.getElementById('weather-result').innerHTML = '<p class="error">Error fetching weather data</p>';
            console.error('Error:', error);
        });
}

function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            getWeather(`${latitude},${longitude}`);
        }, error => {
            alert('Unable to retrieve your location');
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
}