import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Signup = () => {
    const {store,actions}  = useContext(Context)
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    function handleSubmit(e){
        e.preventDefault()
        actions.signUp(email,password)
    }

    return(
        <form className="container text-center" onSubmit={e=>handleSubmit(e)}>
            <div className="row my-3">
                <span className="col-4"/>
                <div className="col-4">
                    <label htmlFor="email" className="form-label float-start">Email</label>
                    <input className="form-control text-start" id="email" onChange={e=>{setEmail(e.target.value)}}/>
                </div>
                <span className="col-4"/>
                <span className="col-4"/>
                <div className="col-4 my-2">
                    <label htmlFor="password" className="form-label float-start">Password</label>
                    <input className="form-control text-start col-4" id="password" onChange={e=>{setPassword(e.target.value)}}/>
                </div>
                <span className="col-4"/>
                <span className="col-4"/>
                <div className="col-4">
                    <button type="submit" className="btn btn-primary my-3 col-4">Sign Up</button>
                </div>
            </div>
        </form>
    )
}