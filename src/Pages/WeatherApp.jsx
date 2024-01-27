import React, { useState } from 'react';
import '../sass/weather.scss';
import { css } from '@emotion/react';
// import { MoonLoader } from 'react-spinners';
import { HashLoader } from 'react-spinners';
import Swal from 'sweetalert2';

const override = css`
  display:block;
  margin: 0 auto;
  height: '50px';
  border-color: red;
`;

const WeatherApp = () => {
    console.log(process.env.REACT_APP_API_KEY);

    let apiKey = process.env.REACT_APP_API_KEY;
    const [searchLocation, setSearchLocation] = useState('');
    const [tempC, setTempC] = useState('');
    const [tempF, setTempF] = useState('');
    const [location, setLocation] = useState('');
    const [humidity, setHumidity] = useState('');
    const [wind, setWind] = useState('');
    const [icon, setIcon] = useState('');
    const [condition, setCondition] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSearch = async () => {
        try {
            setLoading(true);
            await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${searchLocation}&aqi=yes`)
            .then(response => {
                if (!response.ok) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Location is Empty",
                    });
                }
                return response.json();
            })
            .then(data => {
                setTempC(data.current.temp_c);
                setTempF(data.current.temp_f);
                setLocation(data.location.name);
                setHumidity(data.current.humidity);
                setWind(data.current.wind_kph);
                setIcon(data.current.condition.icon);
                setCondition(data.current.condition.text);
                setSearchLocation('');
            });
        } catch (error) {
            /* console.error('There was a problem with the fetch operation:', error); */
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "There was a problem with the fetch operation: "+error,
            });
        }
        setLoading(false);
    };
    
    

    const handleKeyPress = (event) => {
        /* console.log(event.key); */
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className='weather-App'>
            <div className="innerWeather">
                <div className="searchBar">
                    <span onClick={handleSearch} className='searchLogo'>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input type="text" placeholder='location' id="searchLoaction" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} onKeyPress={handleKeyPress}/>
                    {
                        loading ? (<HashLoader css={override} size={15} color={'#FFBB5C'} />)
                        : ("")
                    }
                    
                </div>
                <div className='weatherLogo'>
                    {
                    icon ? (<img src={icon} alt="" />)
                        : (<img src="https://cdn.weatherapi.com/weather/64x64/day/116.png" alt="" />)
                    }
                    {/* <i class="fa-solid fa-cloud"></i> */}
                </div>
                <div className='tempAndFeelsLike'>{tempC? `${tempC}°C` : `0°C`}<span className='condition'>{condition? `${tempF}°F | ${condition}` : "0°F | Condition"}</span></div>
                <div className="loaction">{location? location : `Location`}</div>
                <div className="dataContiner">
                    <div className="element">
                        <div className="logo"><i className="fa-solid fa-water"></i></div>
                        <div className="data">
                            <div className="humidityPer">{humidity? `${humidity}%` : `0%`} </div>
                            <div className="humidityTxt">Humidity</div>
                        </div>
                    </div>
                    <div className="element">
                        <div className="logo"><i className="fa-solid fa-wind"></i></div>
                        <div className="data">
                            <div className="humidityPer">{wind? `${wind} km/h` : `0 km/h`} </div>
                            <div className="humidityTxt">Wind Speed</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeatherApp;
