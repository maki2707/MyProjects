import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import Popup from "reactjs-popup";
import { getAllStations } from "../actions/auth";


const Timetable = () => {

    localStorage.removeItem("pocetna_stanica");

    React.useEffect(() => {
        const fetchData = async () => {
          const response = await getAllStations();
          console.log(response);
          var tablica = document.getElementById("station-grid");
          for(const stanica of response.data) {
              if(stanica.pk == response.data.length) continue;
              //console.log(stanica.fields.naziv);
              const redak = document.createElement("div");
              const link = document.createElement("a");
              link.className = "timetable-grid-item classic-search";
              link.innerHTML = stanica.fields.naziv;
              link.href = "/timetable/" + stanica.pk;
              redak.appendChild(link);
              tablica.appendChild(redak);
          }
        };
        fetchData();
      }, []);

    return (
        <div className='timetable-box' >
            <h1>Vozni red</h1>
            <div className="timetable-grid">
                <div id="station-grid" className="station-box">
                    <h1>Prikaz vlakova po stanici</h1>
                </div>
                <div className="classic-search">
                    <a href="/timetable-classic" ><h1>Klasično pretraživanje</h1></a>
                    <h3>Mogućnost filtracije voznog reda odabirom početne i konačne stanice te datuma polaska</h3>
                </div>
            </div>
        </div>
    )
}
export default Timetable;