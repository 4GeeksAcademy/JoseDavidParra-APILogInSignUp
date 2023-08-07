import axios from "axios"

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: {
				type:"info",
				display:"none",
				msg:""
			},
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			user:null,
			logged:false
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			validateToken: async () => {
				try {
					const config = {
						headers:{Authorization: `Bearer ${localStorage.getItem("token")}`}
					}
					let data = await axios.get("https://symmetrical-parakeet-gjrq5x949jv3r4x-3001.preview.app.github.dev/api/profile",config)
					if (data.status === 200 ){
						return true
					}
				} catch (error) {
					console.log(error);
					if (error.response.status === 401){
						setStore({message:{type:"danger",display:"block",msg:"La sesión ha expirado"}})
						localStorage.removeItem("token")
						return false
					}else if(error.response.status === 422){
						setStore({message:{type:"danger",display:"block",msg:"No se ha iniciado sesión aun"}})
						return false
					}
					return false
				}
				
			},
			signUp: async (email,password) =>{
				const actions=getActions()
				try {
					let data = await axios.post("https://symmetrical-parakeet-gjrq5x949jv3r4x-3001.preview.app.github.dev/api/signup",{
						email:email,
						password:password
					})
					console.log(data);
					if (data.status === 201){
						actions.logIn(email,password)
					}
					setStore({message:{type:"info",display:"block",msg:"Usuario creado con exito"}})
					return true
				} catch (error) {
					console.log(error);
					setStore({message:{type:"danger",display:"block",msg:"Error. Usuario no creado"}})
					return false
				}
			},

			logIn: async (email,password) => {
				localStorage.removeItem("token")
				try {
					let data = await axios.post("https://symmetrical-parakeet-gjrq5x949jv3r4x-3001.preview.app.github.dev/api/login",{
					email:email,
					password:password
				})
					console.log(data);
					localStorage.setItem("token",data.data.access_token)
					setStore({user:email,logged:true})
					setStore({message:{type:"info",display:"block",msg:`Sesion iniciada, usuario: ${email}`}})
					return true
				} catch (error) {
					console.log(error);	
					return false
				}
				
			},

			logOut: () => {
				if (localStorage.getItem("token") != null){
					localStorage.removeItem("token")
					setStore({user:null,logged:false})
					setStore({message:{type:"info",display:"block",msg:"Sesión cerrada"}})
				}else{
					alert("No hay token")
				}
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
