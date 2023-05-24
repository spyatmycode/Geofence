import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useMemo,
  useCallback,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import { countries } from "./countries";
import { toast } from "react-hot-toast";
import { AuthContext } from "../contexts/AuthProvider";
import { set, onValue, ref } from "firebase/database";
import { database } from "../firebase/firebase";
import loader from "../assets/220 (2).gif";
import { v4 } from "uuid";
mapboxgl.accessToken =
  "pk.eyJ1IjoibmlmZW1pYWtlanUiLCJhIjoiY2xmZ2oyNnByMjY4NjN4bXVqdTFhMTJwdyJ9.4KIcco40zj3xvngYzWNmjg";

const GeoModal = ({ location, query, cancel, radius }) => {
  const { user } = useContext(AuthContext);

  const uid = v4();

  const { id, center, place_name } = location;

  const [contactInfo, setContactInfo] = useState("+234");

  const [loading, setLoading] = useState(false);

  console.log(uid);

  const date = new Date();

  console.log("Its meeeeee");

  const timeLine = `${date.getTime()}`;

  const newGeolocation = {
    center: center,
    place_name: place_name,
    contact_info: contactInfo,
    id: location.id,
    date: timeLine,
    radius: Number(radius),
    query: query,
  };

  const geolocationRef = ref(
    database,
    `users/${user.uid}/geolocationHistory/${timeLine}`
  );

  const addGeolocation = async (e) => {
    e.preventDefault();
    setLoading(true);

    set(ref(database, `users/${user.uid}/geolocationHistory/${timeLine}`), {
      ...newGeolocation,
    })
      .then(() => {
        setLoading(false);
        toast.success("Geolocation pushed ");
      })
      .catch((err) => toast.error("Error"));
  };

  return (
    <>
      {location ? (
        <div className="flex flex-col md:flex-row m-5  justify-center items-center px-5 py-7 shadow mt-10 border divide-x bg-white rounded-lg">
          <div className="flex flex-col w-1/2 justify-between gap-4">
            <h1 className="font-bold text-2xl text-red-700">
              {query}

              <span className="font-semibold block">
                ({location && `${center[1]}, ${center[0]}`})
              </span>
            </h1>
            <h2>
              <span className="font-semibold text-xl">Address:</span>{" "}
              {place_name}
            </h2>

            <h2>
              <span className="font-semibold text-xl">Date: </span>{" "}
              {date.toDateString()}
            </h2>
            <h2>
              <span className="font-semibold text-xl">Time: </span>{" "}
              {`${date.getHours()}:${
                date.getMinutes() < 10
                  ? "0" + date.getMinutes()
                  : date.getMinutes()
              }`}
            </h2>
          </div>
          <div className="w-1/2 flex flex-col justify-center items-center ">
            <form className="text-left font-semibold" onSubmit={addGeolocation}>
              <h2 className="my-4">Contact Phone Number:</h2>
              <input
                type="tel"
                defaultValue={"+234"}
                className=" rounded-md px-2 py-2 border-2 border-gray-400"
                onChange={(e) => setContactInfo(e.target.value)}
              />

              <div className="flex gap-6 mt-10">
                <button
                  type="submit"
                  onClick={addGeolocation}
                  className="text-white text-center bg-blue-600 w-20 px-4 py-2 rounded-md hover:bg-gray-500 duration-700 hover:transition-all ease-out hover:duration-700 hover:text-blue-950"
                >
                  Set
                </button>

                <button
                  onClick={() => cancel(false)}
                  className="text-white  bg-red-600 w-20 text-center px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {loading ? (
        <div className="w-full h-full top-0 absolute flex  items-center justify-center backdrop-brightness-50 flex-col gap-5">
          <div className="text-white text-2xl italic">Loading...</div>
          <img src={loader} alt="loader" width={"100px"} />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [geofence, setGeofence] = useState({
    location: "",
    radius: 10,
    country: "NG",
  });

  const { longitude, latitude } = useContext(AuthContext);

  const [coords, setCoords] = useState([6.6859, 3.1711]);
  const [results, setResults] = useState([]);
  const [didSearch, setDidSearch] = useState(false);
  const [chosenSearch, setChosenSearch] = useState({});
  const [didSelect, setDidSelect] = useState(false);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: coords,
        zoom: 0,
      });

      const marker = new mapboxgl.Marker({ color: "#000000" })
        .setLngLat(coords)
        .addTo(map.current);
    } else {
      map.current.flyTo({ center: coords, zoom: 10 });
      const marker = new mapboxgl.Marker({ color: "#000000" })
        .setLngLat(coords)
        .addTo(map.current);
    }
  }, [coords]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${geofence.location}.json?&country=${geofence.country}&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const newCoords = data.features[0].center;

      setCoords(newCoords);
      setResults(data.features);
      setDidSearch(true);
    } catch (error) {
      setDidSearch(false);

      switch (error.message) {
        case "Cannot read properties of undefined (reading 'center')":
          toast.error("Cannot find location");
          break;
      }
    }
  };

  const handleChange = (e) => {
    setDidSearch(false);
    const { name, value } = e.target;
    setGeofence({ ...geofence, [name]: value });
  };

  const addCircleLayer = useCallback(() => {
    // Add Circle Radius
    const center = coords;
    const radius = Number(geofence.radius);

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
  }, [coords, geofence.radius]);

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
  }, [coords, geofence.radius, addCircleLayer]);

  const selectLocation = (center, fullItem) => {
    const newCenter = center;
    setCoords(newCenter);

    setDidSearch(false);
    setChosenSearch(fullItem);
    setDidSelect(true);
  };

  return (
    <>
      <nav className="w-full font-bold text-4xl p-10 text-blue-500">
        
        Geofence Creation

      </nav>
      <div className="flex items-center w-full flex-col relative">
        <div ref={mapContainer} className="h-[400px] w-full" />

        <div className="flex justify-center items-center text-2xl my-5">
          <h1>Create Geofence</h1>
        </div>

        <form onSubmit={handleSubmit} className="my-10 overflow-x-auto">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Location..."
              className="rounded-md px-5 py-3 border-2 border-gray-400"
              value={geofence.location}
              name="location"
              onChange={handleChange}
            />
            <span className="flex items-center overflow-x-auto w-full">
              <input
                type="text"
                placeholder="Enter Radius"
                className="w-[150px] h-14 outline-none rounded-md rounded-tl-md rounded-r-none px-2 py-3 border-2  border-gray-400 border-r-0"
                name="radius"
                value={geofence.radius}
                onChange={handleChange}
              />
              <select
                name="unit"
                id="unit"
                className="outline-none h-14 rounded-l-none  rounded-md px-2 py-3 border-2 border-gray-400"
              >
                <option value="m">m</option>
                <option value="km">km</option>
              </select>
            </span>
            <select
              id=""
              className="w-[200px] rounded-md px-2 py-3 border-2 border-gray-400"
              name="country"
              onChange={handleChange}
            >
              <option value="NG">Nigeria</option>
              {countries.map((country) => {
                return (
                  <option key={country[0]} value={country[0]}>
                    {country[1]}
                  </option>
                );
              })}
            </select>
            <button
              type="submit"
              className="px-5 py-4 bg-blue-500 text-white rounded-md"
            >
              Search
            </button>
          </div>

          {didSearch && (
            <div className="w-full text-center mt-5">
              Search results for {geofence.location}
            </div>
          )}

          <div className="z-10 w-full border divide-y mt-5 shadow max-h-72 overflow-y-auto bg-white ...">
            {didSearch &&
              results.map((result) => {
                const { center, id, place_name } = result;

                return (
                  <span
                    key={id}
                    onClick={() => selectLocation(center, result)}
                    className="block p-2 hover:bg-indigo-50 ..."
                  >
                    {place_name}
                  </span>
                );
              })}
          </div>
        </form>

        {didSelect && (
          <GeoModal
            radius={Number(geofence.radius)}
            location={chosenSearch}
            query={geofence.location}
            cancel={setDidSelect}
          />
        )}
        {console.log(123)}
      </div>
    </>
  );
};

export default Map;
