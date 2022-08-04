from datetime import datetime, timedelta, time, timezone


class SenzorskiPodatak:
    def __init__(self, stanica: int, oznaka_vlaka: int, vrijeme: time, brzina: str, tezine: list):
        self.stanica = stanica
        self.oznaka_vlaka = oznaka_vlaka
        self.vrijeme = vrijeme
        self.brzina = brzina
        self.tezine = tezine

    def __repr__(self):
        return " ".join(
            [str(self.stanica), str(self.oznaka_vlaka), self.vrijeme.__str__(), self.brzina, self.tezine.__str__()])

    @staticmethod
    def parsiraj_podatak(podatak: str):
        splittani_podatak = podatak.strip().split(" ", maxsplit=4)
        stanica = int(splittani_podatak[0])
        oznaka_vlaka = int(splittani_podatak[1])
        vrijeme = datetime.strptime(splittani_podatak[2], "%H:%M").time()
        brzina = splittani_podatak[3]
        splittane_tezine = splittani_podatak[4].split(" ")
        tezine = []
        for i in range(0, len(splittane_tezine), 2):
            tezine.insert(int(i / 2), (int(splittane_tezine[i]), int(splittane_tezine[i + 1])))

        return SenzorskiPodatak(stanica, oznaka_vlaka, vrijeme, brzina, tezine)


class SensorService:
    @staticmethod
    def dohvati_podatke(trenutno_vrijeme):
        # dohvati sve senzorske podatke do ovog trenutka
        with open("sensor_data.txt") as file:
            # trenutno_vrijeme = datetime.strptime("23:55", "%H:%M").time()
            linije = file.readlines()
            parsirani_podaci = []
            for linija in linije:
                podatak = SenzorskiPodatak.parsiraj_podatak(linija)
                if podatak.vrijeme < trenutno_vrijeme:
                    parsirani_podaci.append(podatak)

        return parsirani_podaci

    @staticmethod
    def vrati_kasnjenja(data, threshold):
        trenutno_vrijeme = datetime.now(tz=timezone(name='UTC', offset=timedelta(hours=1))).time()
        parsirani_podaci = SensorService.dohvati_podatke(trenutno_vrijeme)
        # rijecnik s zadnjim podatkom za svaki vlak
        vlak_podatak = {}
        for pdtk in sorted(parsirani_podaci, key=lambda pod: pod.vrijeme):
            vlak_podatak[pdtk.oznaka_vlaka] = pdtk

        # rijecnik s kasnjenjima za svaki senzorski podatak
        kasnjenja = {}
        for dolazak in data:
            idvlak = dolazak["idvlak"]["idvlak"]
            idvlakstanica = dolazak["idvlakstanica"]

            ocekivano_vrijeme_dolaska = datetime.strptime(dolazak["vrijemedolazak"], "%H:%M:%S")
            ocekivano_vrijeme_polaska = (ocekivano_vrijeme_dolaska - timedelta(minutes=10)).time()
            ocekivano_vrijeme_dolaska = ocekivano_vrijeme_dolaska.time()

            if ocekivano_vrijeme_dolaska < trenutno_vrijeme:
                kasnjenja[idvlakstanica] = timedelta(0)
                continue
            if idvlak not in vlak_podatak:
                kasnjenja[idvlakstanica] = timedelta(0)
                continue

            podatak = vlak_podatak[idvlak]
            razlika_senzor_polazak = datetime.combine(datetime.today(), podatak.vrijeme) - datetime.combine(
                datetime.today(), ocekivano_vrijeme_polaska)
            kasnjenje = razlika_senzor_polazak - threshold

            if timedelta(minutes=0) < kasnjenje < timedelta(minutes=10):
                kasnjenja[idvlakstanica] = kasnjenje
            else:
                kasnjenja[idvlakstanica] = timedelta(0)
        return kasnjenja

    @staticmethod
    def izracunaj_vrijeme_dolaska_na_odrediste(polazisteid: int, odredisteid: int,
                                               pocetno_vrijeme: datetime) -> datetime:
        return (odredisteid - polazisteid) * timedelta(minutes=15) + pocetno_vrijeme

    @staticmethod
    def smjesti_u_vagon(tezine: list) -> tuple[int, int]:
        ukupna_min = tezine[0][0] + tezine[0][1]
        index_min = 0
        for i, tezina in enumerate(tezine):
            ukupna = tezina[0] + tezina[1]
            if ukupna < ukupna_min:
                ukupna_min = ukupna
                index_min = i

        vagon_tezina = tezine[index_min]
        vagon_sekcija = 0 if vagon_tezina[0] < vagon_tezina[1] else 1

        return index_min + 1, vagon_sekcija
