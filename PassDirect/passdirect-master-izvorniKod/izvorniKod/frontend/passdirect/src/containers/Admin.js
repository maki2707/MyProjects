import React, { Fragment, useEffect, useState } from "react";
import { getAllUsers } from "../actions/auth";
import { deleteSpecifiedUser } from "../actions/auth";
import Select from 'react-select';
import { getAdminTransactions, getAllTransactions } from "../actions/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = () => {
    const [datumprvi, setDatumPrvi] = useState(null);   
    const onChangePrvi = e => setDatumPrvi(e.target.value);   
    let praviDatumPrvi = '';
    if(datumprvi){
        const [year, month, day] =  datumprvi.split('-')
        praviDatumPrvi = `${day}-${month}-${year}`;
      }

    const [datumdrugi, setDatumDrugi] = useState(null);   
    const onChangeDrugi = e => setDatumDrugi(e.target.value);   
    let praviDatumDrugi = '';
    if(datumdrugi){
        const [year, month, day] =  datumdrugi.split('-')
        praviDatumDrugi = `${day}-${month}-${year}`;
      }

    const [theData, setTheData] = useState('');
    
    React.useEffect(() => {
        const fetchData = async () => {
          const response = await getAllUsers();
          console.log(response);
          var tablica = document.getElementById("user-grid");
          for(const korisnik of response.data) {
              if(korisnik.fields.is_superuser) continue;
              const redak = document.createElement("div");
              redak.className = "admin-grid-item";
              const imeIPrezime = document.createElement("div");
              imeIPrezime.innerHTML = korisnik.fields.ime + " " + korisnik.fields.prezime + " || Datum registracije:  " + korisnik.fields.datum_registracije;
              const email = document.createElement("div");
              email.innerHTML = korisnik.fields.email;
              redak.appendChild(imeIPrezime);
              redak.appendChild(email);
              const gumb = document.createElement("div");
              const gumb2 = document.createElement("a");
              gumb.className = "admin-grid-button admin-grid-item btn-2 navlinkother ";
              gumb.innerHTML = "Izbriši korisnika";
              gumb.onclick = () => {
                  const potvrda = window.confirm("Jeste li sigurni da želite obrisati ovog korisnika?");
                  if(potvrda === true) {
                    deleteSpecifiedUser(korisnik.pk);
                    redak.remove();
                    gumb.remove();
                    gumb2.remove();
                  }
              }
              gumb2.className = "aadmin-grid-button admin-grid-item btn-2 navlinkother "
              gumb2.innerHTML = "Pregled transakcija";
              gumb2.onclick = () => {
                  deleteSpecifiedUser(korisnik.pk);
                  redak.remove();
                  gumb2.remove();
              }
              gumb2.href = "/user-transactions/" + korisnik.pk
              tablica.appendChild(redak);
              tablica.appendChild(gumb);
              tablica.appendChild(gumb2);
          }
        };
        fetchData();
      }, []);


      const handleSearch = e => {
       
        if(datumprvi && datumdrugi){   
          const fetchData = async () => {
           
          setTheData( await getAdminTransactions(praviDatumPrvi, praviDatumDrugi) );                
       
          console.log(theData)                   
            
          };
          fetchData();   
        
      }else if(!datumprvi|| !datumdrugi){   
        toast.error("Molimo odaberite oba parametra!")
        
      }else if(!datumprvi<datumdrugi){
        setTheData('');
        toast.error("Odaberite datume u pravilnom redoslijedu!")
  
      };
    }

    const handleSearch2 = e => {
      const fetchData = async () => {
           
        setTheData( await getAllTransactions());                
     
        console.log(theData)                   
          
        };
        fetchData();   
    }

    let izlaz = '';

     function datumCheck(param) {
        const [dat, vrijeme] =  param.split('T')
        const [year, month, day] =  dat.split('-')

        izlaz =  `${day}.${month}.${year}  |  ${vrijeme.slice(0,5)}`;
        return izlaz;
        
     }

    const transactionsHide = () => (

        <div></div>
        
      );

    const transactionsShow = () => (

        <Fragment>
           
        {" "}
         <table>
             <thead> 
                 <tr>
                    <th>Korisnik</th>
                    <th>Cijena karte</th>
                    <th>Datum kupnje</th>
                    <th>Polazište</th>
                    <th>Odredište</th>
                 
                 </tr>
             </thead>
             <tbody>
             {theData.map((kupnja) => {
                 console.log(kupnja.polaziste.naziv)
                 return (
                     <tr key={kupnja.idkarta}>
                         <td>{kupnja.idkorisnik.ime} {kupnja.idkorisnik.prezime}</td>
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
    )



    return (
   
        <div className="content">
            <div className='accview-title'>                
                <h1>Pregled korisnika</h1>
            </div>
            <div className="admin-grid-container" id="user-grid"></div>
            <div className='accview-title'>                
                <h1>Odaberite datume za pregled transakcija</h1>
            </div>
            <br/>
            <div className="date-trans-filters">

            <div className="datum prvi-date">
            <br />

          <input
                            type="date"                            
                            name="planDatPoc"
                            value={datumprvi}
                            onChange={onChangePrvi}                           
                            placeholder = "Odaberite datum polaska"
                            />


          </div>
          <div class="datum drugi-date">
            <br />

          <input
                            type="date"                            
                            name="planDatPoc"
                            value={datumdrugi}
                            onChange={onChangeDrugi}                           
                            placeholder = "Odaberite datum polaska"
                            />


          </div>
          <div className="sve-trans">
            <br />   
            <button  onClick={handleSearch} className="anew navlinkother btn btn-2 btn-noborder ">Pregled transakcija</button> 
            


          </div>
          </div>
            <div className='accview-title'>
              <button  onClick={handleSearch2} className="anew navlinkother btn btn-2 btn-noborder ">Pregledaj sve transakcije</button>     
            </div>
            <br />
           


            {theData !== '' ? transactionsShow() : transactionsHide() }
           
        </div>


    
    );
}

export default Admin;