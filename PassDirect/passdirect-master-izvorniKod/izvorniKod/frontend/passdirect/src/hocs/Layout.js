/*
svrha ove datoteke je oblikovanje rasporeda svih komponenti na stranici, a želimo ju izdvojiti iz 2 razloga:
    1. ako poželimo mijenjati raspored komponenata, znamo da promjene moramo raditi u ovoj datoteci
    2. jedan "Layout" može se upotrijebiti na više različitih mjesta te time smanjiti redundanciju koda
*/

import React from "react";
import NavigationBar from '../components/NavigationBar';
import { useEffect } from "react";
import { connect } from "react-redux";
import { checkAuthenticated, load_user } from "../actions/auth";
const Layout = ({ checkAuthenticated, load_user, children }) => {

    useEffect(() => {
        checkAuthenticated();
        load_user();
    }, []);

    return (
        <div>
            <NavigationBar />
            {children}
        </div>
    );}

export default connect(null, { checkAuthenticated, load_user })(Layout);