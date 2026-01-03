const locationButton = document.querySelector(".location__button");
const locationInput = document.querySelector(".location__input");
const currentWeatherContainer = document.querySelector(".current-weather");
const forecastContainer = document.querySelector(".forecast");

let currentLocalTime = null;

const getCurrentWeatherByCity = async (city) => {
  const data = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=345927806ef546318c4164648260301&q=${city}&aqi=no`
  );
  const currentWeather = await data.json();
  currentLocalTime = currentWeather.location.localtime.slice(11, 13);
  return currentWeather;
};

const getForecastByCity = async (city) => {
  const data = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=345927806ef546318c4164648260301&q=${city}&days=1&aqi=no&alerts=no`
  );
  const forecast = await data.json();
  return forecast;
};

const renderCurrentWeather = (iconSrc, temperature, status) => {
  currentWeatherContainer.innerHTML = "";

  const currentWeatherIconContainer = document.createElement("div");
  currentWeatherIconContainer.classList.add("current-weather__icon");
  currentWeatherContainer.append(currentWeatherIconContainer);

  const currentWeatherIcon = document.createElement("img");
  currentWeatherIcon.src = iconSrc;
  currentWeatherIconContainer.append(currentWeatherIcon);

  const currentWeatherTemp = document.createElement("p");
  currentWeatherTemp.classList.add("current-weather__temperature");
  currentWeatherTemp.textContent = `${temperature}°С`;
  currentWeatherContainer.append(currentWeatherTemp);

  const currentWeatherStatus = document.createElement("p");
  currentWeatherStatus.classList.add("current-weather__status");
  currentWeatherStatus.textContent = status;
  currentWeatherContainer.append(currentWeatherStatus);
};

const renderForecast = (forecast) => {
  forecastContainer.innerHTML = "";

  forecast.forEach((forecastItem, index) => {
    if (index >= currentLocalTime) {
      const forecastItemElement = createForecastItem(
        forecastItem.condition.icon,
        index == currentLocalTime ? "Сейчас" : forecastItem.time,
        forecastItem.temp_c
      );

      forecastContainer.append(forecastItemElement);
    }
  });
};

const createForecastItem = (iconSrc, time, temperature) => {
  const forecastItemContainer = document.createElement("div");
  forecastItemContainer.classList.add("forecast__item");

  const forecastItemTime = document.createElement("p");
  forecastItemTime.classList.add("forecast__item-time");

  if (time != "Сейчас") {
    forecastItemTime.textContent = time.slice(11);
  } else {
    forecastItemTime.textContent = time;
  }

  forecastItemContainer.append(forecastItemTime);

  const forecastItemIconContainer = document.createElement("div");
  forecastItemIconContainer.classList.add("forecast__item-icon");
  forecastItemContainer.append(forecastItemIconContainer);

  const forecastItemIcon = document.createElement("img");
  forecastItemIcon.src = iconSrc;
  forecastItemIconContainer.append(forecastItemIcon);

  const forecastItemTemp = document.createElement("p");
  forecastItemTemp.classList.add("forecast__item-temperature");
  forecastItemTemp.textContent = `${temperature}°С`;
  forecastItemContainer.append(forecastItemTemp);

  return forecastItemContainer;
};

const handleLocationButtonClick = async () => {
  const locationInputValue = locationInput.value;

  try {
    locationInput.classList.remove("error");
    const currentWeather = await getCurrentWeatherByCity(locationInputValue);
    const forecast = await getForecastByCity(locationInputValue);

    localStorage.setItem("city", locationInputValue);

    const currentWeatherIconSrc = `http:${currentWeather.current.condition.icon}`;
    const currentWeatherTemp = currentWeather.current.temp_c;
    const currentWeatherStatus = currentWeather.current.condition.text;

    renderCurrentWeather(
      currentWeatherIconSrc,
      currentWeatherTemp,
      currentWeatherStatus
    );
    renderForecast(forecast.forecast.forecastday[0].hour);
  } catch (error) {
    locationInput.classList.add("error");
  }
};

locationButton.addEventListener("click", handleLocationButtonClick);
forecastContainer.addEventListener("wheel", (event) => {
  if (event.deltaY !== 0) {
    event.preventDefault();
    forecastContainer.scrollBy({
      left: event.deltaY,
      behavior: "smooth",
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const cityFromLocalStorage = localStorage.getItem("city");

  if (cityFromLocalStorage) {
    locationInput.value = cityFromLocalStorage;
    handleLocationButtonClick();
  }
});
locationInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    handleLocationButtonClick();
    locationInput.blur();
  }
});
