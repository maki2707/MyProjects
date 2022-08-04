import React from "react";
import { useState } from "react";
import { connect } from 'react-redux';
import { reset_password_confirm} from "../actions/auth";
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlockAlt } from "@fortawesome/free-solid-svg-icons";


const ResetPasswordConfirm = ({match, reset_password_confirm}) => {

    const [requestSent, setRequestSent] = useState(false);

    const [formData, setformData] =  useState({ 
        new_password: '',
        re_new_password: ''        
    })

    const {new_password, re_new_password} = formData;

    const onChange = e => setformData({
        ...formData, [e.target.name]: e.target.value
    });

    const onSubmit = e => {
        e.preventDefault();
        const uid = match.params.uid;
        const token = match.params.token;

        reset_password_confirm(uid, token, new_password, re_new_password);
        setRequestSent(true);        
    };

    if (requestSent) {
        return <Redirect to='/' />
    }

    return(
        <div className='resetpassBox'>
            <div className = 'login-naslov'>
                <h1>OBNOVA LOZINKE</h1>
                <p>Unesite i potvrdite novu lozinku:</p>
            </div>
            <div className = 'resetpass-box'>
                <form onSubmit={e => onSubmit(e)}>

                    <div className='newpass-form'>
                    <span className = 'icon'>
                            <FontAwesomeIcon icon={faUnlockAlt} type="button" id="eye" />
                    </span>
                    <input
                            className = 'form-control'
                            type = 'password'
                            placeholder = 'Upišite novu lozinku'
                            name = 'new_password'
                            value = {new_password}
                            onChange = {e => onChange(e)}
                            minLength='6'
                            required
                        />
                    
                
                        <input
                            className = 'form-control'
                            type = 'password'
                            placeholder = 'Potvrdite novu lozinku'
                            name = 're_new_password'
                            value = {re_new_password}
                            onChange = {e => onChange(e)}
                            minLength='6'
                            required
                        />
                    </div>
                
                    <button className='anew btn btn-2 btn-noborder navlinkother btn-conf' type='submit'>Postavi novu lozinku</button>
                </form>
            </div>          
            <br />            
        </div>
    )
}
export default connect(null, { reset_password_confirm}) (ResetPasswordConfirm);

