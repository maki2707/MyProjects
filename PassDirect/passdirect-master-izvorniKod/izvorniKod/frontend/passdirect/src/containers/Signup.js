import React from "react";
import { useState } from "react";
import { connect } from 'react-redux';
import { signup } from "../actions/auth";
import { Link, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import showPwdImg from '../images/show-pass.svg';
import hidePwdImg from '../images/hide-pass.svg';




const Signup = ({signup, isAuthenticated}) => {

    const [isRevealPwd, setIsRevealPwd] = useState(false);

    const [accCreated, setAccCreated] = useState(false);

    const [signupFormData, setSignupFormData] =  useState({ 
        ime: '',
        prezime: '',
        email: '',
        password: '',
        re_password: ''
    })

    const {ime, prezime, email, password, re_password} = signupFormData;

    const onChange = e => setSignupFormData({
        ...signupFormData, [e.target.name]: e.target.value
    });

    const onSubmit = e => {
        e.preventDefault();

        if (password === re_password) {
            signup(ime, prezime, email, password, re_password);
            setAccCreated(true);
        }
    };

    if (isAuthenticated) {
        return <Redirect to='/' />
    }

    if (accCreated) {
        return <Redirect to='/login' />
    }

    return(
        <div className='signIN'>
            <div className = 'login-naslov'>
                <h1>DOBRODOŠLI !</h1>
                <p>Unesite podatke potrebne za registraciju:</p>
            </div>
            <div className = 'form-box'>
                <form onSubmit={e => onSubmit(e)}>

                    <div className='email-form'>
                        <span className = 'icon'>
                            <FontAwesomeIcon icon={faUser} />
                        </span>       

                        <input
                        className='form-control'
                        type='text'
                        placeholder='Ime*'
                        name='ime'
                        value={ime}
                        onChange={e => onChange(e)}
                        required
                        />      

                        <span className = 'icon-hehe'>
                            <FontAwesomeIcon icon={faUser} />
                        </span>  
     
                    </div>

                    <div className='email-form'>
                        <span className = 'icon-hehe'>
                            <FontAwesomeIcon icon={faUser} />
                        </span>       

                        <input
                        className='form-control'
                        type='text'
                        placeholder='Prezime*'
                        name='prezime'
                        value={prezime}
                        onChange={e => onChange(e)}
                        required
                        />     
                        <span className = 'icon-hehe'>
                            <FontAwesomeIcon icon={faUser} />
                        </span>   
     
                    </div>

                    <div className='email-form' >
                    <span className = 'icon'>
                            <FontAwesomeIcon icon={faEnvelope} />
                        </span> 

                        <input
                            className = 'form-control'
                            type = 'email'
                            id = 'email'
                            placeholder = 'Upišite email adresu*'
                            name = 'email'
                            value = {email}
                            onChange = {e => onChange(e)}
                            required
                        />
                        <span className = 'icon-hehe'>
                            <FontAwesomeIcon icon={faUser} />
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

                    <div className='pass-form'>
                        <span className = 'icon'>
                            <FontAwesomeIcon icon={faUnlockAlt} type="button" id="eye" />
                        </span>

                        <input
                            className='form-control'
                            type={isRevealPwd ? "text" : "password"}
                            placeholder='Potvrdite lozinku'
                            name='re_password'
                            value={re_password}
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
                    <button className='anew btn btn-2 navlinkother btn-noborder' type='submit'>Registriraj se</button>
                </form>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { signup })(Signup);



