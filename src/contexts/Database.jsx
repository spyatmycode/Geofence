import React, { createContext, useContext, useEffect, useState } from "react";
import { database } from "../firebase/firebase";
import { onValue, off, ref } from "firebase/database";
import { AuthContext } from "./AuthProvider";

export const DatabaseContext = createContext();

const Database = ({ children }) => {
  const [data, setData] = useState("");
  const { user } = useContext(AuthContext);

  const getData = () => {
    if (user) {
      const userRef = ref(database, `/users/${user.uid}`);
      const onDataReceive = (snapshot) => {
        setData(snapshot.val());
      };
      const unsubscribe = onValue(userRef, onDataReceive);

      return unsubscribe;
    }
  };

  useEffect(() => {
    const unsubscribe = getData();
    return () => {
      // Clean up the event listener when the component unmounts or when `user` changes
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  return (
    <DatabaseContext.Provider value={{ data }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default Database;
