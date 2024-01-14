import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY

const titleCase = (str) => {
  return str
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
}

const Weather = (props) => {
  const {lat, lon} = props
  const [weatherData, setWeatherData] = useState(null)
  const [weatherIcon, setWeatherIcon] = useState(null)

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeatherData(response.data)
        const weatherIconURL = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        setWeatherIcon(weatherIconURL)
      })
  }, [])

  if (!weatherData) return <div>Retrieving data...</div>

  return(
    <>
      <div>{titleCase(weatherData.weather[0].description)} {weatherData.main.temp}&deg;C </div>
      <img src={weatherIcon} alt=""/>
      <div>Feels Like: {weatherData.main.feels_like}&deg;C</div>
      <div>Wind: {weatherData.wind.speed}m/s </div>
    </>
  )

}

const Country = (props) => {
  const {country, hasToggler} = props
  const [toggle, setToggle] = useState(false)

  // for rendering a single country from query
  if (!hasToggler){
    return(
      <>
        <h1>{country.name.common}</h1>
        <div>Capital/s: {country.capital.join(', ')}</div>
        <div>Area: {country.area}</div>
        <h3>Languages:</h3>
        <ul>
          {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} />
        <h3>Current Weather</h3>
        <Weather lat={country.latlng[0]} lon={country.latlng[1]}></Weather>
      </>
    )
  }

  // handle no toggle
  if(!toggle){
    return (
      <>
        <div>
          <strong>{country.name.common}</strong>
          <button onClick={() => setToggle(!toggle)}>Show</button>
        </div>
      </>
    )
  }

  // show clicked
  return(
    <>
      <h1>
        {country.name.common} 
        <button onClick={() => setToggle(!toggle)}>Hide</button>
      </h1>
      <div>Capital/s: {country.capital.join(', ')}</div>
      <div>Area: {country.area}</div>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      <h3>Current Weather</h3>
      <Weather lat={country.latlng[0]} lon={country.latlng[1]}></Weather>

    </>
  )



}

const CountryList = (props) => {
  const {countries, allCountries} = props

  if (countries.length === allCountries.length){
    return <div>Search a country...</div>
  }

  if (countries.length > 10){
    return <div>Too many matches, specify another filter</div>
  } else if (countries.length === 1) {
    return <Country country={countries[0]} hasToggler={false}></Country>
  }

  return(
    <>
      {countries.map(country => <Country key={country.name.common} country={country} hasToggler={true}>{country.name.common}</Country>)}
    </>
  )
}

function App() {

  const baseUrl = `https://studies.cs.helsinki.fi/restcountries/api/name`
  const [searchFilter, setSearchFilter] = useState(null)
  const [countries, setCountries] = useState(null)
  const [countriesToShow, setCountriesToShow] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
        setCountriesToShow(response.data)
        })
  }, [])

  const handleSearchChange = (event) => {
    setCountriesToShow(countries.filter(country => {
      return country.name.common.toLowerCase().includes(event.target.value.toLowerCase())
      || country.name.official.toLowerCase().includes(event.target.value.toLowerCase())
    }))
  }

  if (!countries){
    return (
      <div>
        Loading data, this may take a while for the first time, please wait...
      </div>
    )
  }
  
  return (
    <>
      <div>
        Search: <input type="text" onChange={handleSearchChange}/>
        <CountryList countries={countriesToShow} allCountries={countries}></CountryList>
      </div>
    </>
  )
}

export default App
