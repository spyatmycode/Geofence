import React, { useContext, useEffect, useState } from "react";
import { DatabaseContext } from "../contexts/Database";
import { ref, remove } from "firebase/database";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-hot-toast";
import { database } from "../firebase/firebase";
import Map from "./Map";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import loader from "../assets/220 (2).gif";

import { Doughnut } from "react-chartjs-2";

const Data = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 10],
      backgroundColor: [
        "blue",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

ChartJS.register(ArcElement, Tooltip, Legend);

const Modal = ({ setShowModal, deleteFunction, deleteItem, setDeleteItem }) => {
  return (
    <div className="w-full h-full fixed top-0 bg-gray-500 bg-opacity-40 flex justify-center items-center">
      <div className="px-5 py-5 rounded-lg bg-white shadow-lg ">
        <h2 className="font-bold text-md p-3">
          Are you sure you want to delete this geolocation?
        </h2>

        <span className="flex justify-center gap-4 my-5">
          <button
            className=" text-white  bg-red-600 w-20 text-center px-4 py-2 rounded-md
    }
"
            onClick={() => {
              console.log(deleteItem);
              deleteFunction(deleteItem);
            }}
          >
            Delete
          </button>
          <button
            className=" text-white text-center bg-blue-600 w-20 px-4 py-2 rounded-md hover:bg-gray-500 duration-700 hover:transition-all ease-out hover:duration-700 hover:text-blue-950"
            onClick={() => {
              setShowModal(false);
              setDeleteItem({});
            }}
          >
            Cancel
          </button>
        </span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  
  const [showModal, setShowModal] = useState(false);
  const { data } = useContext(DatabaseContext);

  const { user } = useContext(AuthContext);

  const { geolocationHistory } = data;

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

  const radiusCircleData = geoArray && geoArray.map((item)=>(item.radius))
  const locationCircleData = geoArray && geoArray.map((item)=>(item.place_name))

  console.log(radiusCircleData,locationCircleData);

  const avgRadius = () => {
    let sum = 0;

    const value = radiusArray && radiusArray.reduce((acc, current) => acc + current, sum);

    return value / radiusArray.length;
  };

  console.log(avgRadius());

  const prompt = (item) => {
    setShowModal(true);
    console.log("deez", item);
    setDeleteItem({ ...item });
  };

  const deleteFunction = async (item) => {
    const duplicate = [...geoArray];

    // const filter = duplicate.filter((item) => item.date !== item);

    const deleteRef = ref(
      database,
      `users/${user.uid}/geolocationHistory/${item.date}`
    );

    remove(deleteRef)
      .then(() => {
        toast.success("Success: Geolocation deleted");
        setShowModal(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(`Error: ${err.message}`);
        setShowModal(false);
      });
  };

  

  const mostRecent = geoArray && geoArray.map((item) => Number(item.date));

  const sortedTimes = mostRecent && mostRecent.sort((a, b) => b - a);

  const [coords, setCoords] = useState([0, 0]);
  const [locationName, selectLocationName] = useState("")

  const currentView = (item) => {
    console.log(item);
    setCoords(item.center);
    selectLocationName(item.place_name)
    window.location.href="#map"
  };

  const CircleData = geoArray &&  {
    labels: locationCircleData /* ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"] */,
    datasets: [
      {
        label: "Radius per location(m): ",
        data: radiusCircleData /* [12, 19, 3, 5, 2, 10] */,
        backgroundColor: [
          "blue",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };



  console.log(coords);

  // This is for the Map

  return (
    <>
     <nav className="w-full font-bold text-4xl p-10 text-blue-500">
        
        Dashboard

      </nav>
      {data ? (
        <div className="w-full h-full flex flex-col">
          <div className=" h-full flex">
            <section className="container px-4 mx-auto">
              <div className="flex flex-col">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-5 align-middle md:px-6 lg:px-8">
                    <div className=" border border-gray-200 shadow-md dark:border-gray-700 md:rounded-lg">
                      <h2 className="w-full text-center dark:text-white bg-gray-50 dark:bg-gray-800">
                        Geolocation History
                      </h2>
                      <table className="min-w-full divide-y divide-gray-200  dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Date
                            </th>

                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Status
                            </th>

                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Query
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Location
                            </th>

                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Radius
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Contact
                            </th>

                            <th
                              scope="col"
                              className="relative py-3.5 px-4  text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              <span className="">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                          {geoArray.map((each) => {
                            const {
                              center,
                              contact_info,
                              id,
                              key,
                              place_name,
                              date,
                              query,
                              radius,
                            } = each;

                            let isActive = false;

                            if (date >= sortedTimes[0]) {
                              isActive = true;
                            }

                            const newdate = new Date(Number(date));

                            var year = newdate.getFullYear();
                            var month = newdate.getMonth() + 1;
                            var day = newdate.getDate();

                            month = month < 10 ? "0" + month : month;
                            day = day < 10 ? "0" + day : day;

                            var formattedDate = year + "-" + month + "-" + day;

                            return (
                              <tr>
                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                  {formattedDate}
                                </td>
                                <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                  <div
                                    className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${
                                      isActive
                                        ? "text-emerald-500"
                                        : "text-red-500"
                                    } bg-emerald-100/60 dark:bg-gray-800`}
                                  >
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M10 3L4.5 8.5L2 6"
                                        stroke="currentColor"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>

                                    <h2 className="text-sm font-normal">
                                      {isActive ? "Active " : "Inactive"}
                                    </h2>
                                  </div>
                                </td>

                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                  {query}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                  <div className="flex items-center gap-x-2">
                                    {/* <img
                                        className="object-cover w-8 h-8 rounded-full"
                                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                                        alt=""
                                      /> */}
                                    <div>
                                      <h2 className="text-sm font-medium text-gray-800 dark:text-white ">
                                        {place_name}
                                      </h2>
                                      <p className="text-xs font-normal text-gray-600 dark:text-gray-400">
                                        {`${center[1]},${center[0]}`}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                  {radius}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                  {contact_info}
                                </td>
                                <td className="px-4 py-4 text-sm whitespace-nowrap flex justify-center  gap-3">
                                  <div className="flex items-center gap-x-6">
                                    <button
                                      className="text-green-500 transition-colors duration-200 dark:hover:text-indigo-500 dark:text-white-600  hover:text-indigo-500 focus:outline-none"
                                      onClick={() => currentView(each)}
                                    >
                                      View
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-x-6">
                                    <button
                                      className="text-red-500 transition-colors duration-200 dark:hover:text-indigo-500 dark:text-red-600  hover:text-indigo-500 focus:outline-none"
                                      onClick={() => prompt(each)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <h2 className="text-3xl font-bold text-center py-4">
            User statistics
          </h2>

          <div className=" flex flex-col lg:grid lg:grid-cols-3 place-content-center place-items-center h-full w-full justify-between items-center  p-5 gap-y-10 my-10">

            {/* <div
              id="stats"
              className="bg-white flex gap-10 items-center justify-center p-5 rounded-md shadow-xl h-[400px] border-2"
            >
              <div>
                <div>
                  <Doughnut data={Data} />
                </div>
              </div>
            </div> */}
            <div
              id="stats"
              className="bg-white flex-col flex gap-10 items-center justify-center p-5 rounded-md shadow-xl h-[400px] border-2"
            >
              <div>
                <h2>
                  Location radius stats
                </h2>
              </div>
              <div>
                <div>
                  <Doughnut data={CircleData} />
                </div>
              </div>
            </div>
            <div
              id="stats"
              className="bg-white flex gap-10 items-center justify-center  p-5 rounded-md shadow-xl w-[400px] h-[400px] border-2 flex-col"
            >
              <h2 className=" text-left divide-dashed divide-y-2  divide-orange-500">
                Geofences created
              </h2>

              <div className="flex flex-col items-center rounded-full min-w-[100px] min-h-[100px] lg:h-[300px] md:w-[300px] justify-center - dark:bg-[#316dee] dark:text-white relative">
                <span className=" h-[220px] w-[220px] bg-white rounded-full relative">
                  <div className="absolute flex z-10 text-black h-full w-full justify-center items-center">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-lg md:text-7xl ">
                        {geoArray.length}
                      </span>

                      <span className="text-xs md:text-lg">
                        Geofences created
                      </span>
                    </div>
                  </div>
                </span>
              </div>
            </div>
            <div
              id="stats"
              className=" flex gap-10 items-center justify-center  p-5 rounded-md shadow-xl w-[400px] h-[400px] border-2 flex-col bg-white"
            >
              <h2 className=" ">
                Average Radius
              </h2>

              <div className="flex flex-col items-center rounded-full min-w-[100px] min-h-[100px] lg:h-[300px] md:w-[300px] justify-center  dark:bg-[#316dee] dark:text-white relative">
                <span className=" h-[220px] w-[220px] bg-white rounded-full relative">
                  <div className="absolute flex z-10 text-black h-full w-full justify-center items-center">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-lg md:text-7xl ">
                        {`${Math.round(avgRadius())} m`}
                      </span>

                      <span className="text-xs md:text-lg">
                        Average Radius
                      </span>
                    </div>
                  </div>
                </span>
              </div>
            </div>
            <div className="relative bg-white text-center" id="map">
              <h2>
                Map Visualization
              </h2>
              <Map coords={coords} locationname={locationName}/>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full top-0 absolute flex  items-center justify-center backdrop-brightness-50 flex-col gap-5">
        <div className="text-white text-2xl italic">Loading...</div>
        <img src={loader} alt="loader" width={"100px"} />
      </div>
      )}

      {showModal && (
        <Modal
          setShowModal={setShowModal}
          deleteFunction={deleteFunction}
          deleteItem={deleteItem}
          setDeleteItem={setDeleteItem}
        />
      )}
    </>
  );
};

export default Dashboard;

