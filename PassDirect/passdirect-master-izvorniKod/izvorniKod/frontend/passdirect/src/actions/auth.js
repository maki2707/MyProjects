import axios from 'axios';
import { toast } from 'react-toastify';
import { setAlert } from './alert';


import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    LOGOUT,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL, 
    DELETION_SUCCESS,
    DELETION_FAIL
}
from './types';

export const checkAuthenticated = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }; 

        const body = JSON.stringify({ token: localStorage.getItem('access') });

        try {
            const res = await axios.post(`https://passdirect-backend.herokuapp.com/auth/jwt/verify/`, body, config)

            if (res.data.code !== 'token_not_valid') {
                dispatch({
                    type: AUTHENTICATED_SUCCESS
                });
            } else {
                dispatch({
                    type: AUTHENTICATED_FAIL
                });
            }
        } catch (err) {
            dispatch({
                type: AUTHENTICATED_FAIL
            });
        }

    } else {
        dispatch({
            type: AUTHENTICATED_FAIL
        });
    }
};
export const load_user = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        }; 

        try {
            const res = await axios.get(`https://passdirect-backend.herokuapp.com/auth/users/me`, config);
    
            dispatch({
                type: USER_LOADED_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: USER_LOADED_FAIL,
                type: DELETION_SUCCESS
            });
        }
    } else {
        dispatch({
            type: USER_LOADED_FAIL,
            type: DELETION_SUCCESS
        });
    }
};

export const login = (email, password, showResult) => async dispatch => {
    //email = email.toLowerCase();
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post(`https://passdirect-backend.herokuapp.com/auth/jwt/create`, body, config);

        

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data              
        });
        dispatch(setAlert('Uspješna prijava.', 'success')); 
         
        dispatch(load_user());
    } catch (err) {     
        dispatch({
            type: LOGIN_FAIL
        });
        dispatch(setAlert('Pogreška prilikom prijave. Molim, pokušajte ponovno.', 'error')); 
    }

    
};

export const signup = (ime, prezime, email, password, re_password) => async dispatch => {
    //email = email.toLowerCase();
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ ime, prezime, email, password, re_password});

    try {
        const res = await axios.post(`https://passdirect-backend.herokuapp.com/auth/users/`, body, config);

        dispatch({
            type: SIGNUP_SUCCESS,
            payload: res.data
        });
        dispatch(setAlert('Uspješna registracija.', 'success'));

        
    } catch (err) {
        dispatch({
            type: SIGNUP_FAIL
        });

        dispatch(setAlert('Neuspješna registracija.', 'error'));
    }
};

export const verify = (uid, token) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uid, token });

    try {
        await axios.post(`https://passdirect-backend.herokuapp.com/auth/users/activation/`, body, config);

        dispatch({
            type: ACTIVATION_SUCCESS,
        });
    } catch (err) {
        dispatch({
            type: ACTIVATION_FAIL
        })
    }
};

export const reset_password = (email) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email });

    try {
        await axios.post(`https://passdirect-backend.herokuapp.com/auth/users/reset_password/`, body, config);

        dispatch({
            type: PASSWORD_RESET_SUCCESS
        });
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_FAIL
        });
    }
};

export const reset_password_confirm = (uid, token, new_password, re_new_password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uid, token, new_password, re_new_password });

    try {
        await axios.post(`https://passdirect-backend.herokuapp.com/auth/users/reset_password_confirm/`, body, config);

        dispatch({
            type: PASSWORD_RESET_CONFIRM_SUCCESS
        });
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_CONFIRM_FAIL
        });
    }
};



export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    });
};



export const deleteUser = async (password) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const body = JSON.stringify({password});
    const res = await axios.delete(`https://passdirect-backend.herokuapp.com/users/delete/me/`, config);
    //const res = await axios.delete(`http://localhost:8000/users/delete/me/`, config);
    
}

export const deleteSpecifiedUser = async (id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const res = await axios.delete(`https://passdirect-backend.herokuapp.com/users/delete/${id}`, config);
}

export const getUserData = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const res = await axios.get(`https://passdirect-backend.herokuapp.com/auth/users/me/`, config);
    console.log(res);
    return res;
}

export const changeUserData = async(ime, prezime, brkartice) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const body = JSON.stringify({ime, prezime, brkartice});
    console.log(body)
    const res = await axios.post(`https://passdirect-backend.herokuapp.com/users/update/`, body, config);
}

export const getAllUsers = async() => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    const res = await axios.get(`https://passdirect-backend.herokuapp.com/users/getAll/`, config)
    return res;
}

export const getAllStations = async() => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const res = await axios.get(`https://passdirect-backend.herokuapp.com/base/stanice/`, config)
    return res;
}

export const getStationTrains = async(id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const res = await axios.get(`https://passdirect-backend.herokuapp.com/base/raspored/${id}/`, config)
    return res;
}

export const authConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('access')}`,
        'Accept': 'application/json'
    }
};


/*export const getFilteredTimetable = async(pocetna, konacna, datum) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const res = await fetch(`https://passdirect-backend.herokuapp.com/base/raspored/${pocetna}/${konacna}/${datum}`, config)
    return res;
}*/




export const getFilteredTimetable = async(pocetna, konacna, datum) => {

    const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    try {             
        const response = await fetch(`https://passdirect-backend.herokuapp.com/base/raspored/${pocetna}/${konacna}/${datum}`, config);

        const jsonData = await response.json();
        return jsonData
       
    } catch (err) {
        console.error(err.message);
        
    }
}




export const  getUserTransactions = async(id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try{
        const res = await fetch(`https://passdirect-backend.herokuapp.com/base/karte/me`, config);
        const jsonData = await res.json();
        return jsonData
    } catch (err) {
        console.error(err.message);
        
    }    
}

export const  postTransaction = async (brkartice, datumIsteka, cvv, idvlakstanica, idvlak, kolosijek,  vrijemepolazak, vrijemedolazak, pocetna, odrediste, idkorisnik) => {
    
    
    console.log("stigao");
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('access')}`,
        'Accept': 'application/json'
      }
    };

  
    const body = JSON.stringify({ brkartice, datumIsteka, cvv, idvlakstanica, idvlak, kolosijek,  vrijemepolazak, vrijemedolazak, pocetna, odrediste, idkorisnik});

    try {
        const res = await axios.post(`https://passdirect-backend.herokuapp.com/base/kupi/`, body, config);

        console.log("uspio");
        toast.success("Uspješna transakcija.");
       
    } catch {
      console.log("error");
      toast.error("Neuspješna transakcija. Molimo pokušajte ponovno.")
    }

  };


  export const  getAdminTransactions = async(prvi, drugi) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try{
        const res = await fetch(`https://passdirect-backend.herokuapp.com/base/karte/${prvi}/${drugi}`, config);
        const jsonData = await res.json();
        return jsonData
    } catch (err) {
        console.error(err.message);
        
    }    
}



export const  getAdminUserTransactions = async(id) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try{
        const res = await fetch(`https://passdirect-backend.herokuapp.com/base/karte/${id}`, config);
        const jsonData = await res.json();
        return jsonData
    } catch (err) {
        console.error(err.message);
        
    }    
}



export const  getAllTransactions = async() => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };
    try{
        const res = await fetch(`https://passdirect-backend.herokuapp.com/base/karte/all`, config);
        const jsonData = await res.json();
        return jsonData
    } catch (err) {
        console.error(err.message);
        
    }    
}