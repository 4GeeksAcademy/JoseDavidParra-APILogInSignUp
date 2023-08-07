import React, {useContext} from "react";
import { Link , useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const {store,actions} = useContext(Context)
	const navigate = useNavigate()

	// async function openProfile(){
	// 	let validate = await actions.validateToken()
	// 	console.log(validate);
	// 	if (validate){
	// 		navigate("/profile")
	// 	}else{
	// 		alert("No se ha iniciado sesión aun")
	// 	}
	// }

	function cerrarSesion(){
		actions.logOut()
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					{store.logged ? <button className="btn btn-primary mx-1" onClick={()=>{
						cerrarSesion()
						navigate("/")
						}}>Cerrar sesión</button>:<Link to="/login"><button className="btn btn-primary mx-1">Log In</button></Link>}
					<Link to="/signup">
						<button className="btn btn-primary mx-1">Sign Up</button>
					</Link>
					<button className="btn btn-primary mx-1" onClick={()=>navigate("/profile")}>Profile</button>
				</div>
			</div>
		</nav>
	);
};
