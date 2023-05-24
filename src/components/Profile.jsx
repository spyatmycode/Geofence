import React, { useContext, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthProvider";
import { updateProfile, updatePhoneNumber, updateEmail } from "firebase/auth";
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
          <FaUserCircle size={100} />

          <div className="font-bold">Username</div>
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
                Phone Number
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
