import React from "react";
import { getStationTrains } from "../actions/auth";
import { getAllStations } from "../actions/auth";

const Station = ({match}) => {

    const [imeStanice, setImeStanice] = React.useState("");

    React.useEffect(() => {
        const fetchData = async () => {
            const stations = await getAllStations();
            for(const station of stations.data) {
                if(station.pk == match.params.sid) {
                    setImeStanice(station.fields.naziv);
                    break;
                }
            }
            const response = await getStationTrains(match.params.sid);
            var tablica = document.getElementById("station-grid");
            const data = response.data;
            //console.log(data);
            //const vlakovi = response.data.slice(0, response.data.length - 1);
            const vlakovi = response.data;
            for(const vlak of vlakovi) {
                //console.log(vlak);
                const id = document.createElement("div");
                id.innerHTML = vlak.idvlak.idvlak;
                id.className = "station-grid-item";
                tablica.appendChild(id);
                const krajnje_odrediste = document.createElement("div");
                krajnje_odrediste.innerHTML = vlak.idvlak.idkrajnjastanica.naziv;
                krajnje_odrediste.className = "station-grid-item";
                tablica.appendChild(krajnje_odrediste);
                const kolosijek = document.createElement("div");
                kolosijek.innerHTML = vlak.idvlak.kolosijek;
                kolosijek.className = "station-grid-item";
                tablica.appendChild(kolosijek);
                const vrijeme_dolaska = document.createElement("div");
                vrijeme_dolaska.innerHTML = vlak.vrijemedolazak_s_kasnjenjem;
                if(vlak.kasnjenje != "0:00:00") vrijeme_dolaska.className = "station-grid-item bad-text";
                else vrijeme_dolaska.className = "station-grid-item";
                tablica.appendChild(vrijeme_dolaska);
                const vrijeme_polaska = document.createElement("div");
                vrijeme_polaska.innerHTML = vlak.vrijemepolazak;
                vrijeme_polaska.className = "station-grid-item";
                tablica.appendChild(vrijeme_polaska);
                const kupi = document.createElement("a");
                kupi.onclick = () => {
                    localStorage.setItem("pocetna_stanica", match.params.sid);
                }
                kupi.href = "/timetable-classic";
                kupi.innerHTML = "Kupi";
                kupi.className = "station-grid-item";
                tablica.appendChild(kupi);
            }
        };
        fetchData();
      }, []);

    return (
        <div className="timetable-box">
            <h1>Prikaz za stanicu {imeStanice}</h1>
            <div className="station-grid" id = "station-grid">
                <div className="station-grid-item">ID Vlaka</div>
                <div className="station-grid-item">Krajnje odredište</div>
                <div className="station-grid-item">Kolosijek</div>
                <div className="station-grid-item">Vrijeme dolaska</div>
                <div className="station-grid-item">Vrijeme polaska</div>
                <div className="station-grid-item">Kupi</div>
            </div>
        </div>
    )
}
export default Station;