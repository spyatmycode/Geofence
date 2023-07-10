import React, { useContext, useEffect, useState } from "react";
import Database, { DatabaseContext } from "../contexts/Database";
import girl from "../assets/girl.jpeg";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-hot-toast";
const Messaging = () => {
  const { user, userDb } = useContext(AuthContext);
  const { data } = useContext(DatabaseContext);
  const [geoObject, setGeoObject] = useState({});
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

 /*  useEffect(() => {
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
  }, [latitude, longitude]); */


  const { geolocationHistory } = data;

  useEffect(() => {
    setGeoObject({ ...geolocationHistory });
  }, [data]);

  console.log(data);

  const geoArray =
    data &&
    Object.entries(geoObject).map(([key, value]) => {
      return {
        key,
        ...value,
      };
    });

  geoArray && geoArray.sort((a, b) => b.date - a.date);

  

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
  const firstGeoHistory = (firstTime && geolocationHistory[firstTime].query) ||0;

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
  };console.log(currentLocation);

  const date = new Date().getTime();

  console.log(date);
  const initialMessage = {
    content: `Hello ${userDb.nextofkin} Its me ${userDb.firstname} ${userDb.lastname} I've been kidnapped. Please reach out to the authorities. My last know coordinates are ${"6.5142784, 3.3718272"} at the Bells University of Technology.`,
    phonenumber: userDb.phonenumber,
    time: date,
  }

  console.log(firstGeoHistory,"HAHA");

  console.log(initialMessage, "INIT");
  const [message, setMesssage] = useState(initialMessage);

  console.log(userDb);
  const handleChange = (e) => {
    const { value, name } = e.target;
    setMesssage({ ...message, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      const data = await response
        .json()
        .then(() => toast.success("Success: Message sent successfully"));
      console.log(data);
    } catch (error) {
      toast.error(err.message);
    }
  };

  console.log(message);
  return (
    <>
      <div className="w-full h-full flex justify-center items-center flex-col bg-[#5B5AC5]">
        <div className="w-32 h-32 rounded-full border-2 border-blue-500 overflow-hidden">
          <img
            src={girl}
            alt="Profile Image"
            className="w-full h-full object-cover"
          />
        </div>

        <h4 className="my-4 font-bold text-2xl text-white">Create an Alert</h4>

        <form
          className="mx-4 lg:w-[400px] shadow-lg flex flex-col items-center bg-white rounded-lg"
          onSubmit={handleSubmit}
        >
          <span className="mx-5">
            <label htmlFor="">Next of Kin Phone number</label>
            <input
              type="text"
              defaultValue={message.phonenumber}
              name="phonenumber"
              onChange={handleChange}
              className="w-full px-4 border-4 border-blue-700"
            />
          </span>
          <span className="mx-5">
            <label htmlFor="">Message</label>
            <textarea
              className="w-full border-4 border-blue-700  px-4"
              name="content"
              onChange={handleChange}
              defaultValue={message.content}
              id=""
              cols="30"
              rows="10"
            ></textarea>
          </span>
          <span></span>
          <span className="w-full">
            <button className="w-full bg-blue-700 text-white p-2" type="submit">
              Send Message
            </button>
          </span>
        </form>
      </div>
    </>
  );
};

export default Messaging;
