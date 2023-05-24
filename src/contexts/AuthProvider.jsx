import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { auth, database } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { set, ref, onValue } from "firebase/database";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDb, setUserDb] = useState(null);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [checkLogged, setCheckLogged] = useState(true);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },

      (error) => {
        console.error(error);
        // Handle geolocation error
      }
    );

    /*  return () => {
          navigator.geolocation.clearWatch(watchId);
        }; */
  }, []);

  useEffect(() => {
    if (!navigator.onLine) {
      setUser(null);
    }
    onAuthStateChanged(auth, (userauth) => {
      if (userauth) {
        setUser(userauth);
        const userReference = ref(database, `users/${userauth.uid}`);
        onValue(userReference, (data) => {
          setUserDb(data.val());
        });
      } else {
        setUser(null);
      }
    });
  }, [auth]);

  



  return (
    <>
      <AuthContext.Provider value={{ user, userDb, longitude, latitude }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
