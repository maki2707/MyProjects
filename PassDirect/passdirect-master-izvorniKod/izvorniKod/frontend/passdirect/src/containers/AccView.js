import Popup from "reactjs-popup";
import { deleteUser } from "../actions/auth";
import { getUserData } from "../actions/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import React, { Fragment, useEffect, useState } from "react";
import { getUserTransactions } from "../actions/auth";


import { mocktransdata } from "../mockDATA/transactions";

const AccView = () => {
    const [firstName, setFirstName] = React.useState("");
    const[lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [cardNumber, setCardNumber] = React.useState("");
    const [idK, setIdK] = React.useState(null);
    const[transData, setTransData] = useState([]);
    

    React.useEffect(() => {
        const fetchData = async () => {
          const response = await getUserData();
          console.log(response);
          setFirstName(response.data.ime);
          setLastName(response.data.prezime);
          setEmail(response.data.email);     
          setIdK(response.data.idkorisnik); 
          setCardNumber(response.data.brkartice);      
          console.log(idK);
          
        };
        fetchData();
      }, []);


      
      const handleSearch = e => {        
            if(idK){
                const getTrans = async () => {
                    setTransData( await getUserTransactions(idK));
                };
                getTrans();
                
            }           
            
        }
         
         
      
     
     console.log(transData);
     console.log(transData)

     let izlaz = '';

     function datumCheck(param) {
        const [dat, vrijeme] =  param.split('T')
        const [year, month, day] =  dat.split('-')

        izlaz =  `${day}.${month}.${year}  |  ${vrijeme.slice(0,5)}`;
        return izlaz;
        
     }
      
    
      
      
      
      

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
                <div className="accview-grid-item">{firstName}</div>
                <div className="accview-grid-item">Prezime</div>
                <div className="accview-grid-item">{lastName}</div>
                <div className="accview-grid-item">e-mail</div>
                <div className="accview-grid-item">{email}</div>
                <div className="accview-grid-item">Broj kartice</div>
                <div className="accview-grid-item">{cardNumber}</div>
            </div>

            <div className='accview-title'>
            <button onClick={handleSearch} className="anew navlinkother btn btn-2 btn-noborder ">
            Pregled transakcija
                </button>
                
                </div>
            <br />
            <Fragment>
           
           {" "}
            <table>
                <thead> 
                    <tr>
                    <th>Cijena karte</th>
                    <th>Datum kupnje</th>
                    <th>Polazište</th>
                    <th>Odredište</th>
                    
                    </tr>
                </thead>
                <tbody>
                {transData.map((kupnja) => {
                    console.log(kupnja.polaziste.naziv)
                    return (
                        <tr key={kupnja.idkarta}>
                            <td>{kupnja.cijena} kn</td>
                            <td>{datumCheck(kupnja.vrijemepolazak)}</td>
                            <td>{kupnja.polaziste.naziv}</td>
                            <td>{kupnja.odrediste.naziv}</td>                                              
                         </tr>
                    )
                })}                                    
                </tbody>
            </table>
        </Fragment>
            <div className="button-flex-container">
                <div className="anew btn btn-2 navlinkother btn-noborder">
                    <a href="/account/edit" className="button-link">
                        Izmijeni podatke
                    </a>
                </div>
                <Popup trigger={<div className="anew btn btn-2 navlinkother btn-noborder">
                                    <div className="popup-button">Obriši račun</div>
                                </div>} position="right center" modal className="popup">
                    {close => (
                        <div>
                            <div className="popup-text">
                                Jeste li sigurni da želite trajno obrisati svoj račun?
                            </div>
                            <br/>
                            {/*<input type="password" className="form-control" id="password"/>*/}
                            <div className="button-flex-container">
                                <div className="anew btn btn-2 navlinkother btn-noborder" onClick={() => {
                                    {/*deleteUser(document.getElementById("password").value);*/}
                                    deleteUser("");
                                    close();
                                }}>
                                    <div className="popup-button"><a href="/">Potvrdi</a></div>
                                </div>
                                <div className="anew btn btn-2 navlinkother btn-noborder" onClick={() => {close();}}>
                                    <div className="popup-button">Odustani</div>
                                </div>
                            </div>
                        </div>
                    )}
                </Popup>
            </div>
        </div>
    </div>
    );
}

export default AccView;