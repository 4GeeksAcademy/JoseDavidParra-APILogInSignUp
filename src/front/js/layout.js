import React, { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import { Login } from "./pages/login";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Signup } from "./pages/signup";
import { Profile } from "./pages/profile";
import { PrivateRoutes } from "./privateRoutes";
import { Context } from "./store/appContext";

//create your first component
const Layout = () => {
    const {store,actions} = useContext(Context)
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    const validate = async()=>{
        let valid = await actions.validateToken()
        return valid
    }

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<h1>Not found!</h1>} />
                        <Route element={<Login />} path="/login"/>
                        <Route element={<Signup />} path="/signup"/>  
                        <Route path='*' element={<Navigate to='/' replace/>}/>
                        <Route path="/profile" element={<Profile/>}
                            // <PrivateRoutes user={validate}>
                            //     <Profile />
                            // </PrivateRoutes>}
                        />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
