import React, { useEffect, useState, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { FaInfo } from 'react-icons/fa'
import "mapbox-gl/dist/mapbox-gl.css";


mapboxgl.accessToken = "pk.eyJ1IjoibmlmZW1pYWtlanUiLCJhIjoiY2xmZ2oyNnByMjY4NjN4bXVqdTFhMTJwdyJ9.4KIcco40zj3xvngYzWNmjg";







const Map = ({ coords, city, locationname }) => {

   
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(72.5244);
    const [lat, setLat] = useState(20.3792);
    const [zoom, setZoom] = useState(0);
    const [weatherData, setWeatherData] = useState(null)

 /*    const fetchWeather = async(city) =>{
        // const {longitude, latitude,name} = city

        try {
            const fetchData = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${"Lagos"}?unitGroup=metric&key=J94W2YPBPD3WT87E3E848GHYT&contentType=json`)

            const data = await fetchData.json()
            console.log(data);

            setWeatherData(await data)

            
            
        } catch (error) {
            console.log(error);
        }
    } */


    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: coords ? coords: [0,0],
            zoom: zoom
        });
    },[]);

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.flyTo({
            center: coords? coords: [0,0],
            zoom: 10,
            speed: 2,
            curve: 1.5
        });

       



            
            

        
    },[coords]);

    useEffect(()=>{

        const markerHeight = 10000;
        const markerRadius = 10;
        const linearOffset = 25;
        const popupOffsets = {
            'top': [0, 0],
            'top-left': [0, 0],
            'top-right': [0, 0],
            'bottom': [0, -markerHeight],
            'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
            'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
            'left': [markerRadius, (markerHeight - markerRadius) * -1],
            'right': [-markerRadius, (markerHeight - markerRadius) * -1]
        };

        const popup = new mapboxgl.Popup({ offset: popupOffsets, className: 'my-class',closeOnClick: true  })
            .setLngLat(coords ? coords: [0,0])
            .setHTML(`<div>${locationname}</div>`)
            .setMaxWidth("300px")
            .addTo(map.current);

            


            const log = ()=>{
                console.log("hello world");
                console.log(weatherData?.timezone);
            }

            const info = document.querySelectorAll("#info").forEach((icon)=>{
                icon.addEventListener('click',()=>{
                    document.querySelectorAll("#infoData").forEach((data)=>{
                        data.classList.toggle('visible')
                    })
                })
            })


            
    },[coords])

    const addCircleLayer = useCallback(() => {
        // Add Circle Radius
        const center = coords;
        const radius = Number(10);
    
        const options = {
          steps: 0,
          units: "kilometers",
        };
    
        let circle = turf.circle(coords, radius, options);
    
        map.current.addSource("circleData", {
          type: "geojson",
          data: circle,
        });
    
        map.current.addLayer({
          id: "circle-fill",
          type: "fill",
          source: "circleData",
          paint: {
            "fill-color": "red",
            "fill-opacity": 0.2,
          },
        });
      }, [coords, 10]);
    
      useEffect(() => {
        if (!map.current) return;
    
        if (!map.current.getSource("circleData")) {
          // If the circle layer doesn't exist, add it
          map.current.on("load", addCircleLayer);
        } else {
          // If the circle layer already exists, update the data
          const circleData = turf.circle(coords, Number(geofence.radius), {
            steps: 20,
            units: "kilometers",
          });
          map.current.getSource("circleData").setData(circleData);
        }
      }, [coords, 10, addCircleLayer]);
    
     




    return (
        
        <>
            <div ref={mapContainer} className="lg:h-[400px] lg:w-[400px] w-[400px] h-[400px] shadow-2xl rounded-sm"/>
        </>
        
    );
}

export default Map