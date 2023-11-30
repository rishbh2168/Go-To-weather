const cityName = document.getElementById('cityName');
const submitBtn = document.getElementById('submitBtn');
const city_name = document.getElementById('city_name');
const temp_real_val = document.getElementById('temp_real_val');
const temp_status = document.getElementById('temp_status');
const datahide = document.querySelector('.middle_layer');
const dayElement = document.getElementById('day');
const dateElement = document.getElementById('today_date');
const timeElement = document.getElementById('current_time');

// Function to get the current day, date, and time
const getCurrentDateTime = () => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[now.getDay()];
    const options = { day: 'numeric', month: 'short' };
    const date = now.toLocaleDateString('en-US', options);
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const time = now.toLocaleTimeString('en-US', timeOptions);

    // Update the HTML elements
    dayElement.innerText = day;
    dateElement.innerText = date;
    timeElement.innerText = time;
};

// Function to get the AQI rating text
const getAqiRatingText = (aqi) => {
    if (aqi >= 1 && aqi <= 2) {
        return 'Good';
    } else if (aqi >= 3 && aqi <= 4) {
        return 'Moderate';
    } else if (aqi === 5) {
        return 'Poor';
    } else if (aqi === 6) {
        return 'Very Poor';
    } else {
        return 'Worst';
    }
};

const getInfo = async (event) => {
    event.preventDefault();

    let cityVal = cityName.value;

    if (cityVal === "") {
        city_name.innerText = `Please write the name before search`;
        datahide.classList.add("data_hide");
    } else {
        try {
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=metric&appid=2eb51fec7060cc5aa721315868c6693f`;
            const response = await fetch(url);

            if (response.status !== 200) {
                cityName.value = "";
                datahide.classList.add("data_hide");
                document.querySelector('.aqiInformation').classList.add('data_hide'); // Hide AQI container
                city_name.innerText = `City not found. Please enter a valid city name.`;
                return;
            }

            const data = await response.json();
            const arrData = [data];

            city_name.innerText = `${arrData[0].name}, ${arrData[0].sys.country}`;
            temp_real_val.innerText = arrData[0].main.temp;
            const tempMood = arrData[0].weather[0].main;

            if (tempMood == "Clear") {
                temp_status.innerHTML = "<i class='fas  fa-sun' style='color: #eccc68;'></i>";
            } else if (tempMood == "Clouds") {
                temp_status.innerHTML = "<i class='fas  fa-cloud' style='color: #f1f2f6;'></i>";
            } else if (tempMood == "Rain") {
                temp_status.innerHTML = "<i class='fas  fa-cloud-rain' style='color: #a4b0be;'></i>";
            } else {
                temp_status.innerHTML = "<i class='fas  fa-cloud' style='color:#f1f2f6;'></i>";
            }

            datahide.classList.remove('data_hide');
            cityName.value = "";

            // Fetch AQI data
            const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${arrData[0].coord.lat}&lon=${arrData[0].coord.lon}&appid=2eb51fec7060cc5aa721315868c6693f`;
            const aqiResponse = await fetch(aqiUrl);

            if (aqiResponse.status !== 200) {
                console.log('Error fetching AQI data:', aqiResponse.status);
                return;
            }

            const aqiData = await aqiResponse.json();
            const aqiValue = aqiData.list[0].main.aqi;

            // Display AQI information
            document.getElementById('aqi_value').innerText = aqiValue;

            // Display AQI rating
            const aqiRatingText = getAqiRatingText(aqiValue);
            document.getElementById('aqi_rating_text').innerText = aqiRatingText;

            // Show the AQI section
            document.querySelector('.aqiInformation').classList.remove('data_hide');

            // Update time, day, and date
            getCurrentDateTime();

        } catch (error) {
            cityName.value = "";
            datahide.classList.add("data_hide");
            document.querySelector('.aqiInformation').classList.add('data_hide'); // Hide AQI container
            city_name.innerText = `Please enter the proper city name`;
            console.log('Error fetching weather data:', error);
        }
    }
};

submitBtn.addEventListener('click', getInfo);
