import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UserAuth from "./components/UserAuth";
import Protected from "./components/Protected";
import AuthProvider from "./contexts/AuthProvider";
import NavBar from "./components/Nav";
import { Toaster } from "react-hot-toast";
import Profile from "./components/Profile";
import Geofence from "./components/Geofence";
import Dashboard from "./components/Dashboard";
import Database from "./contexts/Database";
const App = () => {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={10}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "white",
            color: "black", //#363636
            width: "300px",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "black",
              secondary: "green",
            },
          },
        }}
      />
      <AuthProvider>
       
        <BrowserRouter>
          <Routes>
            <Route
              path="/auth"
              element={
                <Protected>
                  <UserAuth />
                </Protected>
              }
            />

            <Route
              element={
                <Protected>
                  <NavBar />
                </Protected>
              }
              
              path="/"
            >
              <Route

              
                element={
                  <Protected>
                    <Profile />
                  </Protected>
                }
                path="/profile"
              />
              <Route
                element={
                  <Protected>
                    <Geofence />
                  </Protected>
                }
                path="/geofence"
                index
              />
              <Route
                element={
                  <Protected>
                    <Geofence />
                  </Protected>
                }
                path="/"
                index
              />
             
              <Route
                element={
                  <Protected>
                   <Database>
                   <Dashboard />
                   </Database>
                  </Protected>
                }
                path="/dashboard"
              />

           
            </Route>

            <Route path="*" element={<>

              <div className=" h-screen flex flex-col w-screen justify-center items-center ">
                
                <h3 className="text-3xl font-bold text-red-600">Error 404: Page not found</h3>

              <button className="p-4 rounded-md bg-blue-950 text-white mt-6">
               <Link to={'/geofence'}> Back to Dashboard </Link>
              </button>
              
              </div>

             
            
            </>}/>
          </Routes>
        </BrowserRouter>
       
      </AuthProvider>
    </>
  );
};

export default App;
