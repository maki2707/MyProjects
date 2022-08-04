import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { changeUserData } from "../actions/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { connect } from "react-redux";

function checkForm(ime, prezime, broj_kartice) {
    var ime_oblik = /^[a-zA-Z][a-zA-Z ]*$/;
    var kartica_oblik = new RegExp("^[0-9]{16}$");
    if(!ime_oblik.test(ime)){
        toast.error("Molimo upišite ispravno ime");
    }
    else if(!ime_oblik.test(prezime)) {
        toast.error("Molimo upišite ispravno prezime");
    }
    else if(broj_kartice != "" && !kartica_oblik.test(broj_kartice)) {
        toast.error("Molimo upišite ispravan broj kartice")
    }
    else return true;
    return false;
}

function submit_form(ime, prezime, broj_kartice) {
    if(checkForm(ime, prezime, broj_kartice)) {
        changeUserData(ime, prezime, broj_kartice);
        window.location.href = "/account";
    }
}

const AccEdit = (/*{user}*/) => {
    return (
    <div>
        <div className="content">
            <div className='accview-title'>                
                <span className = 'icon-acc'>
                    <FontAwesomeIcon icon={faUser} />
                </span>
                <h1>Osobni podaci</h1>
            </div>
            
            <div className="accview-grid-container">
                <div className="accview-grid-item">Ime</div>
                <div className="accview-grid-item">
                    {/*<input type="text" value={user.ime}/>*/}
                    <input className="edit-form" type="text" placeholder="Upišite ime" id="ime"/>
                </div>
                <div className="accview-grid-item">Prezime</div>
                <div className="accview-grid-item">
                    {/*<input type="text" value={user.prezime}/>*/}
                    <input className="edit-form" type="text" placeholder="Upišite prezime" id="prezime"/>
                </div>
                <div className="accview-grid-item">Broj kartice</div>
                <div className="accview-grid-item">
                    <input className="edit-form" type="text" placeholder="Upišite broj kartice" id="broj_kartice"/>
                </div>
            </div>
            <div className="button-flex-container">
                <div className="anew btn btn-2 navlinkother btn-noborder" onClick={() => submit_form(document.getElementById("ime").value, document.getElementById("prezime").value,
                document.getElementById("broj_kartice").value)}>
                    Potvrdi
                </div>
            </div>
        </div>
    </div>
    );
}

/*const mapStateToProps = state => ({
    user: state.auth.user
});

export default connect(mapStateToProps, null)(AccEdit);*/

export default AccEdit;