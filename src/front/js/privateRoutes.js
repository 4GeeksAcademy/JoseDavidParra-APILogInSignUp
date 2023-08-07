import React from "react";
import { Navigate,Route,Routes } from "react-router-dom";
import { Home } from "./pages/home";
import { Profile } from "./pages/profile";

export const PrivateRoutes = ({validToken,children}) => {
    if (!validToken) {
        return <Navigate to="/" replace/>
    }
    return(children
        // <Routes>
        //     <Route element={<Profile />} path="/profile"/>
        //     <Route path='/' element={<Home />} />
        //     <Route path='*' element={<Navigate to='/' replace/>}/>
        // </Routes>
    )
}