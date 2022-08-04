import React, { Fragment, useEffect, useState } from "react";
import { getAdminUserTransactions } from "../actions/auth";
import {withRouter, useHistory, useParams} from 'react-router-dom';

const UserTransactions = () => {

    const[transData, setTransData] = useState('');
    const idK = useParams().uid;
    console.log(idK);

    useEffect(() => { 
        const fetchData = async (idK) => {
            setTransData(await getAdminUserTransactions(idK));
            console.log(transData);
        };
        fetchData(idK); 
    
    }, []);

    let izlaz = '';

    function datumCheck(param) {
       const [dat, vrijeme] =  param.split('T')
       const [year, month, day] =  dat.split('-')

       izlaz =  `${day}.${month}.${year}`;
       return izlaz;
       
    }

    

    


    return (
        <div>
        <div className="content">
             <div className='accview-title'>           
            <h1>Pregled transakcija za korisnika:  {transData.length !== 0 ? transData.at(0).idkorisnik.ime + ' ' + transData.at(0).idkorisnik.prezime : 'Nema'}</h1>        
                
              </div>
        </div>
        <br/>
       
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
                {Object.values(transData).map((kupnja) => {
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
        </div>
    )

}
export default UserTransactions;