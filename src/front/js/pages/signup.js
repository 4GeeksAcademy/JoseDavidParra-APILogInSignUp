import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const {store,actions}  = useContext(Context)
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [ver,setVer] = useState("password")
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        let created = await actions.signUp(email,password)
        if(created){
            navigate('/')
        }else{
            alert('Error al crear el usuario')
        }
    }

    function verNoVerPass(){
        if (ver === "password"){
            setVer("text")
        }else{
            setVer("password")
        }
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
                    <div className="input-group mb-3" id="password">
                        <input type={ver} className="form-control" onChange={e=>{setPassword(e.target.value)}}/>
                        <span className="input-group-text bg-light rounded-end" id="basic-addon1" onClick={verNoVerPass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye float-end" viewBox="0 0 16 16">
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                            </svg>
                        </span>
                    </div>
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