import React, { Fragment, useEffect, useState } from "react";
import { getAllStations, postTransaction } from "../actions/auth";
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { getFilteredTimetable } from "../actions/auth";
import { setAlert } from "../actions/alert";
import { getUserData } from "../actions/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { element } from "prop-types";
import { now } from "moment";
import Popup from 'reactjs-popup';
import { Redirect } from 'react-router-dom';
import axios from "axios";
import { titleContains } from "selenium-webdriver/lib/until";


const TimetableClassic = () => {        

 

     
  
      const[dataStations, setDataStations] = useState([]);   
      let allStations = [];

      const [pocetna, setPocetna] = useState(parseInt(localStorage.getItem("pocetna_stanica")));
      //if(localStorage.getItem("pocetna_stanica") !== null) localStorage.removeItem("pocetna_stanica");
      const [odrediste, setOdrediste] = useState(null);
      const [brkartice, setBrKartice] = React.useState("");
      const [theData, setTheData] = useState('');
      const [theLateData, setTheLateData] = useState('');
      const [firstName, setFirstName] = React.useState("");
      const [lastName, setLastName] = React.useState("");
      const [email, setEmail] = React.useState("");
      
      const [idkorisnik, setIdKorisnik] = React.useState("");
      React.useEffect(() => {
        const fetchData = async () => {
          const response = await getUserData();
          setFirstName(response.data.ime);
          setLastName(response.data.prezime);
          setEmail(response.data.email);
          setBrKartice(response.data.brkartice);
          setIdKorisnik(response.data.idkorisnik);         
          
        };
        fetchData();
      }, []);

      useEffect(() => {
        const getData = async () => {
          const res = await getAllStations();
          setDataStations(res.data); 

         
          };   
        
        getData();
      },[]);

      //console.log(dataStations);

      for(const station of dataStations) {
        var o =  {value : station.pk, label : station.fields.naziv}
        allStations.push(o);            
      }
      //console.log(allStations);
      

    

      const [placanjeFormData, setPlacanjeFormData] =  useState({ 
        datumIsteka: '',
        cvv: '',
      })

       const {datumIsteka, cvv, cijena} = placanjeFormData;
    
       const onChangePlacanje = e => setPlacanjeFormData({
        ...placanjeFormData, [e.target.name]: e.target.value,
      });

    const  onSubmitPlacanje = (e, idvlakstanica, idvlak, kolosijek, vrijemepolazak, vrijemedolazak) => {
      e.preventDefault();
      postTransaction(brkartice, datumIsteka, cvv, idvlakstanica, idvlak, kolosijek,  vrijemepolazak, vrijemedolazak, pocetna, odrediste, idkorisnik);
    };
      
      const handleChange1 = e => {
        setPocetna(e.value);
      }

      const handleChange2 = e => {
        setOdrediste(e.value);
      }

      let praviDatum = '';

      const [datum, setDatum] = useState(null);   
      const onChange = e => setDatum(e.target.value);

      if(datum){
        const [year, month, day] =  datum.split('-')
        praviDatum = `${day}-${month}-${year}`;
      }           
      const current = new Date();
      const danas = `${current.getDate()}-0${current.getMonth()+1}-${current.getFullYear()}`;
      //console.log(danas)

     

     

     const handleSearch = e => {

      //console.log(datum);
      var god = datum.slice(0, 4), mje = datum.slice(5, 7), dan = datum.slice(8, 10); //2001-03-26
      if(parseInt(god) < 2022 || parseInt(god) > 2023) {
        toast.error("Molimo odaberite datum u 2022. ili 2023. godini!")
        return;
      }

      if(datum && pocetna && odrediste && pocetna<odrediste) {   
          const fetchData = async () => {
          setTheData( await getFilteredTimetable(pocetna, odrediste, praviDatum) );                
          
          console.log(theData)
          
          console.log(theData.slice(theData.length-1, theData.length ));
          /*console.log(theData.slice(theData.length-1, theData.length ).at(0)[Object.keys(theData.slice(theData.length-1, theData.length ).at(0)[5])]);
          console.log(Object.values(theData.slice(theData.length-1, theData.length ).at(0)))*/
          console.log(theData.slice(theData.length-1, theData.length ).at(0))
            
          };
          fetchData();    

      } else if(!datum || !pocetna || !odrediste) {   
        toast.error("Molimo odaberite sva tri parametra!")
        
      } else if(!pocetna<odrediste) {
        setTheData('');
        toast.error("Odabrano odredište nalazi se prije odabranog polazišta! Pokušajte ponovno!")

      };
    }

  let index = 0;
  

  const timetableshow = () => (
    <Fragment>           
        {" "}
        <table>
            <thead> 
                <tr>
                <th>Oznaka vlaka </th>
                <th>Kolosijek</th>
                <th>Odlazak</th>
                <th>Dolazak na odredište</th>             
                <th>Kašnjenje</th>  
                <th>Cijena karte</th>
                <th></th>                                               
                </tr>
            </thead>
            <tbody>
            
            {theData.map((vlak) => {
                const cijena = (odrediste - pocetna) * 2;
                const idvlak = vlak.idvlak.idvlak; 
                const kolosijek = vlak.idvlak.kolosijek;
                const vrijemepolazak = new Date(Date.parse(datum + "T" + vlak.vrijemepolazak + "Z"));
                const vrijemedolazak = new Date(Date.parse(datum + "T" + vlak.vrijemedolazak_odrediste + "Z"));
                const idvlakstanica = vlak.idvlakstanica;

                return (
                    <tr key={vlak.idvlakstanica}> 
                        <td>{vlak.idvlak.idvlak}</td>       
                        <td>{vlak.idvlak.kolosijek}</td>       
                        <td>{vlak.vrijemepolazak}</td>
                        <td style= {!vlak.kasnjenje ? {color: "#FFC300"} : vlak.kasnjenje == '0:00:00' || !vlak.kasnjenje ? {color:"green"} : {color:"red"}}>{vlak.vrijemedolazak_odrediste}</td>
                        <td id= "kasnjenje" style= {vlak.kasnjenje == '0:00:00' ? {color:"green"} : {color:"red"}}>{vlak.kasnjenje !== '0:00:00' ?
                        vlak.kasnjenje : '-' }</td>    
                        <td>{(odrediste - pocetna) * 2} kn  </td>
                        <td>
                          <Popup trigger = {Date.parse(datum + "T" + vlak.vrijemepolazak) > Date.parse(Date()) ? <button className='anew btn btn-2 btn-noborder navlinkother'>Kupi</button> : ""}
                               modal> {
                                  <div className = 'form-box'>
                                    <form method = "post" onSubmit={e => {onSubmitPlacanje(e, idvlakstanica, idvlak, kolosijek, vrijemepolazak, vrijemedolazak);
                                                                          document.getElementById("popup-root").remove();}}>

                                        <div className='email-form'>
                                          <span>Broj kartice: </span>
                                          <input
                                                className = 'transaction-form-control'
                                                type = 'text'
                                                name = 'brkartice'
                                                value = {brkartice}
                                                pattern="[0-9]*"
                                                onChange = {e => setBrKartice(e.target.value)}
                                                minLength = '16'
                                                maxLength = '16'
                                                size = '16'     
                                                required
                                            />
                                        </div>
                                        <div className='email-form'>
                                          <span>Datum isteka: </span>
                                          <input
                                                className = 'transaction-date-form-control'
                                                type = 'text'
                                                name = 'datumIsteka'
                                                placeholder="MM/YY"
                                                value = {datumIsteka}
                                                dateformat="mm/yy"
                                                pattern="[0-1][1-9]/[0-9][0-9]"
                                                size = '5'
                                                maxLength = '5' 
                                                onChange = {e => onChangePlacanje(e)}
                                                required
                                            />
                                        </div>
                                        <div className='email-form'>
                                          <span>CVV: </span>
                                          <input
                                                className = 'transaction-price-cvv-form-control'
                                                type = 'password'
                                                name = 'cvv'
                                                pattern="[0-9]*"
                                                value = {cvv}
                                                minLength='3'
                                                maxLength='4'
                                                size = '4' 
                                                onChange = {e => onChangePlacanje(e)}
                                                required
                                            />
                                        </div>
                                        <div className='email-form'>
                                          <span>Cijena: 
                                          <input
                                                className = 'transaction-price-cvv-form-control'
                                                type = 'text'
                                                name = 'cijena'
                                                defaultValue = {(odrediste - pocetna) * 2 + "kn"}  
                                                //onChange = {e => onChangePlacanje(e)}
                                                required
                                                readOnly
                                            /></span>
                                        </div>        

                                        <button className='anew btn btn-2 btn-noborder navlinkother btn-conf' type='submit'>Potvrdi</button>
                                    </form>
                                </div>
                               }</Popup>
                        </td>
                      </tr>
                )
                
            })}                                    
            </tbody>
        </table>
    </Fragment>
  );

const timetablehide = () => (

  <div></div>
  
); 

     
    return (
      <div class="classic-timetable-filters"> 
          <div class="pocetna">
            <br />
            <Select           
              placeholder="Odaberite početnu stanicu"
             value={allStations.find(obj => obj.value === pocetna)}
              options={allStations} 
              onChange={handleChange1} 
            /> 
          </div>

          <div class="odrediste">
            <br />          
            <Select
              placeholder="Odaberite odredišnu stanicu"
              value={allStations.find(obj => obj.value === odrediste)}
              options={allStations} 
              onChange={handleChange2} 
            />
          </div>
          <div class="datum">
            <br />

          <input
                            type="date"                            
                            name="planDatPoc"
                            value={datum}
                            onChange={onChange}                           
                            placeholder = "Odaberite datum polaska"
                            />


          </div>

          
          <div class="timetable">      
          <br />           

            <div className="btn-con">
                <button onClick={handleSearch} className="anew navlinkother btn btn-2 btn-noborder ">
                    Pretraži
                </button>
            </div>   

             {(theData !== '' && allStations.length !== 0) ? timetableshow() : timetablehide() }             

         </div>  

        

        
      </div>

      
     
)
;}

           
  

export default TimetableClassic;