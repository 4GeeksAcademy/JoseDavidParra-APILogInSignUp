import React, {useContext} from "react";
import { Link , useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const {store,actions} = useContext(Context)
	const navigate = useNavigate()

	function openProfile(){
		if (actions.goProfile()){
			navigate("/profile")
		}else{
			alert("No se ha iniciado sesión aun")
		}
	}

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
					<Link to="/login">
						<button className="btn btn-primary mx-1">Log In</button>
					</Link>
					<Link to="/signup">
						<button className="btn btn-primary mx-1">Sign Up</button>
					</Link>
					<button className="btn btn-primary mx-1" onClick={cerrarSesion}>Cerrar sesión</button>
					<button className="btn btn-primary mx-1" onClick={openProfile}>Profile</button>
					<Link to="/demo">
						<button className="btn btn-primary mx-1">Check the Context in action</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};
