import React from "react";
import { useState } from "react";
import { connect } from 'react-redux';
import { login } from "../actions/auth";
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import showPwdImg from '../images/show-pass.svg';
import hidePwdImg from '../images/hide-pass.svg';





const Login = ({login, isAuthenticated}) => {

    const [isRevealPwd, setIsRevealPwd] = useState(false);

    const [loginFormData, setLoginFormData] =  useState({ 
        email: '', 
        password: ''
    })


    const {email, password} = loginFormData;

    const onChange = e => setLoginFormData({
        ...loginFormData, [e.target.name]: e.target.value
    });

    const onSubmit = e => {
        e.preventDefault();
        login(email,password);
        
    };    

    if (isAuthenticated) {
        return <Redirect to='/' />        
    }
    

    return(
        <div className='signIN'>
            <div className = 'login-naslov'>
                <h1>DOBRODOŠLI NATRAG!</h1>
                <p>Unesite svoje podatke za prijavu:</p>
            </div>
            <div className = 'form-box'>
                <form className='formtest' onSubmit={e => onSubmit(e)}>

                    <div className='email-form'>
                        <span className = 'icon'>
                            <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                    
                
                        <input
                            className = 'form-control-email'
                            type = 'email'
                            id = 'email-input'
                            placeholder = 'Upišite email adresu*'
                            name = 'email'
                            value = {email}
                            onChange = {e => onChange(e)}
                            required
                        />
                        <span className = 'icon-hehe'>
                            <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                    </div>

                    <div className='pass-form'>
                        <span className = 'icon'>
                            <FontAwesomeIcon icon={faUnlockAlt} type="button" id="eye" />
                        </span>

                        <input
                            className='form-control'
                            type={isRevealPwd ? "text" : "password"}
                            placeholder='Upišite lozinku'
                            name='password'
                            value={password}
                            onChange={e => onChange(e)}
                            minLength='6'
                            required
                        />                       
                        <img
                        className = "icon-eye"
                            title={isRevealPwd ? "Hide password" : "Show password"}
                            src={isRevealPwd ? hidePwdImg : showPwdImg}
                            onClick={() => setIsRevealPwd(prevState => !prevState)}
                            alt = "oko"
                        />                        
                    </div>
                    <button className='anew btn btn-2 navlinkother btn-noborder' type='submit' >Login</button>
                </form>
            </div>

            

            <br />

            <div className = 'ostaloLogin'>
                <div className='sign-up-option'>
                    Nemaš račun?<a href="/signup" className= 'a4 btn-4'>Registriraj se</a>
                </div>
                
                <div className='pass-reset-option'>
                    Zaboravljena lozinka? <a href="/reset-password" className= 'a4 btn-4'>Obnovi lozinku</a>
                </div>
            </div>
        </div>
    )
};



Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLogged: state.auth.isLogged
});

export default connect(mapStateToProps, { login }) (Login);

