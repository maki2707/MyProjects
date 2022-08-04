import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { verify } from '../actions/auth';

const Activate = ({ verify, match }) => {
    const [verified, setVerified] = useState(false);

    const verify_account = e => {
        const uid = match.params.uid;
        const token = match.params.token;

        verify(uid, token);
        setVerified(true);
    };

    if (verified) {
        return <Redirect to='/' />
    }

    return (
        <div className='resetpassBox'>

            <div className='login-naslov'>
                <h1>Potvrdi svoju registraciju:</h1>
            </div>

            <div className= 'btn-container'>
                <button className='anew btn btn-2 navlinkother btn-noborder btn-conf' onClick={verify_account}>Potvrdi</button>
            </div>              
            
        </div>
    );
};
export default connect(null, { verify })(Activate);