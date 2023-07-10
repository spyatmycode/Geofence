import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { DatabaseContext } from "../contexts/Database";
import girl from "../assets/girl.jpeg";
import Map from '../components/Map'

const GeolocationComponent = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [locationname, setLocationName] = useState("")

  const { data } = useContext(DatabaseContext);

  console.log(data);
  const { user, userDb } = useContext(AuthContext);


  useEffect(() => {
    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setInterval(() => {
      console.log(12369696);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          setError(`Error: ${error.message}`);
        }
      );

     
    }, 10000);

    // Get the current position
  }, [latitude, longitude]);

  console.log(data, "THissss");

  const [showModal, setShowModal] = useState(false);

  console.log(data);

  const { geolocationHistory } = data;

  console.log(geolocationHistory);

  const [geoObject, setGeoObject] = useState({});

  const [deleteItem, setDeleteItem] = useState({});

  // console.log(geolocationHistory)

  useEffect(() => {
    setGeoObject({ ...geolocationHistory });
  }, [data]);

  const geoArray =
    data &&
    Object.entries(geoObject).map(([key, value]) => {
      return {
        key,
        ...value,
      };
    });

  geoArray && geoArray.sort((a, b) => b.date - a.date);

  let me = [1, 2, 3];

  const radiusArray = geoArray && geoArray.map((each) => Number(each.radius));

  const radiusCircleData = geoArray && geoArray.map((item) => item.radius);
  const locationCircleData =
    geoArray && geoArray.map((item) => item.place_name);

  console.log(radiusCircleData, locationCircleData);

  const mostRecent = geoArray && geoArray.map((item) => Number(item.date));

  const sortedTimes = mostRecent && mostRecent.sort((a, b) => b - a);

  console.log(sortedTimes);

  const firstTime = (sortedTimes && sortedTimes[0]) || 0;
  console.log(firstTime);
  const firstRadius =
    (radiusArray && radiusArray?.sort((a, b) => b - a)[0]) || 0;
  console.log(firstRadius);
  const firstGeoHistory = (firstTime && geolocationHistory[firstTime]) || 0;

  console.log(firstGeoHistory);

  function degToRad(deg) {
    return deg * (Math.PI / 180);
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // in kilometers

    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) *
        Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c;

    return distance;
  }

  const geofenceCenter = {
    lat: 0,
    lon: 0,
  };

  const currentLocation = {
    lat: latitude,
    lon: longitude,
  };

  const radius = 10 / 1000; // in kilometers

  const distance = calculateDistance(
    degToRad(geofenceCenter.lat),
    degToRad(geofenceCenter.lon),
    degToRad(currentLocation.lat),
    degToRad(currentLocation.lon)
  );

  console.log("Distance:", distance.toFixed(2), "km");

  if (distance <= radius) {
    console.log("Inside geofence");
  } else {
    console.log("Outside geofence");
  }

  console.log(distance);
  

useEffect(()=>{
  const getLocationName = async ()=>{
   const fetching = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=6.5142784&lon=3.3718272&limit=10&appid=f69641da28e1611191ff665c76110cbf`)
  const gotten = await fetching.json()

  setLocationName(gotten[0].name)

  console.log(await gotten);

}

getLocationName()

},[latitude, longitude])
  
  // Output: 3933.82 kilometers
  /* http://api.openweathermap.org/geo/1.0/reverse?lat=6.5142784&lon=3.3718272&limit=10&appid=f69641da28e1611191ff665c76110cbf */
  return (
    <>
    <div className="w-full ml-20 text-blue-600 font-bold text-2xl py-5">
      Home
    </div>
      <div className="rounded-lg shadow-md flex items-center flex-row-reverse justify-around  p-4 mx-7 bg-[#FE8071] text-white">
        <div className="w-32 h-32 rounded-full border-[5px] border-black overflow-hidden">
          <img
            src={girl}
            alt="Profile Image"
            className="w-full h-full object-cover"
          />
        </div>

      
        <div className="flex flex-col ">
          <span className="font-bold text-2xl">{userDb && userDb.firstname}</span>
          <span>{userDb && userDb.lastname}</span>
          <span>Current Location:</span>
          <span className="text-black font-bold">{latitude}, {longitude}</span>
        </div>
      </div>

      <div className="my-5 flex flex-col justify-center gap-4 mx-7 place-items-center lg:w-3/4 items-center  lg:grid grid-cols-3">

      <div className="relative my-10 flex items-center justify-center w-full">
          <div className="w-[300px] flex justify-center items-center ">
          <Map coords={[3.4,6.5]} locationname={locationname} />
          </div>
        </div>
        
        <div className="w-[300px] h-[300px] shadow-lg flex flex-col items-center justify-center bg-[#8C8DF7] rounded-lg">

          <span className="font-bold text-xl">
          Current Location Name:
          </span>

        <span className="text-3xl font-bold text-white"> {locationname && locationname}</span>

        </div>

        <div className="w-[300px] rounded-lg h-[300px] shadow-lg flex flex-col items-center justify-center bg-orange-500">

          <span className="font-bold text-xl">Expected Location</span>

         <span className="text-xl font-bold text-gray-50">{firstGeoHistory && firstGeoHistory.query}</span>

        </div>
        <div className="w-[300px] rounded-lg h-[300px] shadow-lg flex flex-col items-center justify-center bg-purple-500">

          <span className="font-bold text-xl">Geofence Radius</span>

         <span className="text-6xl  font-bold text-white ">{firstGeoHistory && firstGeoHistory.radius}m</span>

        </div>
        <div className="w-[300px] rounded-lg h-[300px] shadow-lg flex flex-col items-center justify-center bg-[#29BF8C]">

          <span className="font-bold text-xl">Geofence Status</span>

         <span className="text-2xl font-bold text-white">{distance <= radius ? "Inside Geofence": "Outside Geofence"}</span>

        </div>

        <div>

        </div>
      </div>

      

      

     
    </>
  );
};

export default GeolocationComponent;
