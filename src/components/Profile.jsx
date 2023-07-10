import React, { useContext, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthProvider";
import { updateProfile, updatePhoneNumber, updateEmail } from "firebase/auth";
import girl from '../assets/girl.jpeg'
import { auth } from "../firebase/firebase";
import { toast } from "react-hot-toast";
import loader from "../assets/220 (2).gif";
import { database } from "../firebase/firebase";
import { ref, set, onValue } from "firebase/database";

const Profile = () => {
  const { user, userDb } = useContext(AuthContext);

  const doThis = async () => {
    console.log(userDb);
  };

  const [loading, setLoading] = useState(false);

  const [userInputs, setUserInputs] = useState({
    firstname: userDb.firstname || "",
    lastname: userDb.lastname || "",
    email: userDb.email || "",
    phone: userDb.phoneNumber || "",
    nextofkin:userDb.nextofkin|| ""
  });

  const updateInfo = async (e) => {
    e.preventDefault();

    setLoading(true);

    await updateProfile(auth.currentUser, {
      displayName: `${userInputs.lastname} ${userInputs.firstname}`,
    })
      .then(() => toast.success("success: username updated"))
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });

    /* await updatePhoneNumber(auth.currentUser,userInputs.phone)
      .then(() => toast.success("success: phone number updated"))
      .catch((error) =>  {toast.error("Phone number error"); setLoading(false) });
 */
    await updateEmail(auth.currentUser, userInputs.email)
      .then(() => toast.success("success: email updated"))
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });

    setLoading(false);

    await set(ref(database, "users/" + auth.currentUser.uid), {
      firstname: userInputs.firstname,
      lastname: userInputs.lastname,
      email: userInputs.email,
      phonenumber: userInputs.phone,
      nextofkin:userInputs.nextofkin
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserInputs({ ...userInputs, [name]: value });
  };

  return (
    <>
      <nav className=" w-full font-bold text-4xl p-10 text-blue-500">Your Profile</nav>
      <div className="w-full">
        <div className="flex justify-center items-center p-10 flex-col">
        <div className="w-32 h-32 rounded-full border-2 border-blue-500 overflow-hidden">
          <img
            src={girl}
            alt="Profile Image"
            className="w-full h-full object-cover"
          />
        </div>

          <div className="font-bold">{userDb.firstname || ""}</div>
        </div>

        <form onSubmit={(e) => updateInfo(e)}>
          <div className="grid grid-cols-1 md:grid-cols-2 place-content-center place-items-center gap-y-16">
            <div className="flex flex-col w-2/3">
              <label htmlFor="" className="font-bold">
                First Name
              </label>
              <input
                type="text"
                defaultValue={userDb.firstname || ""}
                placeholder="Enter your First Name"
                className="outline-none border-b-[2px] border-blue-700  p-2"
                onChange={(e) => handleChange(e)}
                name="firstname"
              />
            </div>
            <div className="flex flex-col w-2/3">
              <label htmlFor="" className="font-bold">
                Last Name
              </label>
              <input
                type="text"
                defaultValue={userDb.lastname || ""}
                placeholder="Enter your Last Name"
                className="outline-none border-b-[2px] border-blue-700  p-2"
                onChange={(e) => handleChange(e)}
                name="lastname"
              />
            </div>
            <div className="flex flex-col w-2/3">
              <label htmlFor="" className="font-bold">
                Email
              </label>
              <input
                type="email"
                defaultValue={userDb.email}
                className="outline-none border-b-[2px] border-blue-700  p-2"
                onChange={(e) => handleChange(e)}
                name="email"
              />
            </div>
            <div className="flex flex-col w-2/3">
              <label htmlFor="" className="font-bold">
                Phone Number of Next of Kin
              </label>
              <input
                type="text"
                defaultValue={userDb.phonenumber}
                placeholder="Enter your Phone number"
                className="outline-none border-b-[2px] border-blue-700  p-2"
                onChange={(e) => handleChange(e)}
                name="phone"
              />
            </div>
            <div className="flex flex-col w-2/3">
              <label htmlFor="" className="font-bold">
                Name of Next of Kin
              </label>
              <input
                type="text"
                defaultValue={userDb.nextofkin || ""}
                placeholder="Enter Name of Next of Kin"
                className="outline-none border-b-[2px] border-blue-700  p-2"
                onChange={(e) => handleChange(e)}
                name="nextofkin"
              />
            </div>
          </div>

          <button
            type="submit"
            className=" text-white relative left-[8%] mt-10 bg-blue-600 px-6 py-3 rounded-md transition-all hover:bg-gray-400 hover:transition-all hover:duration-700"
          >
            {loading ? <img src={loader} width={"50px"} /> : "Update Info"}
          </button>
          {/* <button
         
          onClick={doThis}
          className=" text-white relative left-[8%] mt-10 bg-blue-600 px-6 py-3 rounded-md"
        >
         {loading ? <img src={loader} width={"50px"}/> : "Check"}
        </button> */}
        </form>
      </div>
    </>
  );
};

export default Profile;
