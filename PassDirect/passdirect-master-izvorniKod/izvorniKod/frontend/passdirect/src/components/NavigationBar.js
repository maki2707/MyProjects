import React, {Fragment} from "react";
import { logout } from "../actions/auth";
import { connect } from "react-redux";
import Alert from './alert';
import PropTypes from 'prop-types';

const NavigationBar = ({logout, isAuthenticated, isSuperuser}) => {
    const guestLinks = () => (
        <Fragment>

            <div className = 'btn-con'>
                <a href="/timetable" className="anew navlinkother btn btn-2">
                    Vozni red
                </a>
            </div>

            <div className = 'btn-con'>
                <a href="/signup" className="anew navlinkother btn btn-2">
                    Registracija
                </a>
            </div>

            <div className="btn-con">
                <a href="/login" className="anew navlinkother btn btn-2 ">
                    Prijava
                </a>
            </div>
        </Fragment>

    );

    const adminLinks = () => (
        <Fragment>
            <div className = 'btn-con'>
                <a href="/admin" className="anew navlinkother btn btn-2">
                    Admin
                </a>
            </div>
        </Fragment>
    );

    const authLinks = () => (
        <Fragment>
            {isSuperuser ? adminLinks() : <Fragment></Fragment>}
            <div className = 'btn-con'>
                <a href="/timetable" className="anew navlinkother btn btn-2">
                    Vozni red
                </a>
            </div>
            <div className="btn-con">
                <a href="/account" className="anew navlinkother btn btn-2 ">
                    Upravljanje računom
                </a>
            </div>

            <div onClick={logout}>
                <a href='/' className="anew navlinkother btn btn-2 ">                
                    Odjava
                </a>
            </div>
        </Fragment>

    );


    return (
        <Fragment>
            
            <nav className="navbar-flex-container navbar">
                <div className="left-navbar">
                    <div className='navbarlinkholder' >
                        <a href="/" className='anew btn btn-2 homelink'>
                            PassDirect
                        </a>
                    </div>
                </div>
                
                <div className="right-navbar">
                {isAuthenticated ? authLinks() : guestLinks()}
                </div>
            </nav>
            <Alert />
        </Fragment>
        
    );
};

NavigationBar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isSuperuser: state.auth.isSuperuser
});

export default connect(mapStateToProps, { logout })(NavigationBar);