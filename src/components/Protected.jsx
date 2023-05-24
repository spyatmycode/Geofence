import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthProvider'
import { Navigate } from 'react-router'

const Protected = ({children}) => {

    const {user} = useContext(AuthContext)

    if(children.type.name === "Render"){

        if(user !==null){
            return <Navigate to="/" />
        }
        return children
    }
   

    

    switch(user){
        case null : return <Navigate  to="/auth"/>;
        
        default: return children;
    }


   
 
}

export default Protected