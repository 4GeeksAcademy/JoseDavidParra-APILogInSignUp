import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Profile = () => {
    const {store,actions} = useContext(Context)
    return(
        <>
            <div className="row">
                <h1>ESTOY EN PROFILE usuario loggeado {store.userLogged}</h1>
            </div>
        </>
    )
}