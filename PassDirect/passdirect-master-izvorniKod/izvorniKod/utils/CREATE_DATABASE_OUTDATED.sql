CREATE TABLE VLAK
(
  idVlak INT NOT NULL,
  brVagona INT NOT NULL,
  brPutnikaVagon INT NOT NULL,
  PRIMARY KEY (idVlak)
);

CREATE TABLE KORISNIK
(
  idKorisnik INT NOT NULL,
  email VARCHAR(50) NOT NULL,
  ime VARCHAR(20) NOT NULL,
  prezime VARCHAR(30) NOT NULL,
  lozinka VARCHAR(30) NOT NULL,
  brKartice VARCHAR(16),
  uloga INT NOT NULL,
  PRIMARY KEY (idKorisnik),
  UNIQUE (email)
);

CREATE TABLE STANICA
(
  idStanica INT NOT NULL,
  naziv VARCHAR(25) NOT NULL,
  PRIMARY KEY (idStanica),
  UNIQUE (naziv)
);

CREATE TABLE dolaziNaStanicu
(
  vrijemeDolazak TIMESTAMP NOT NULL,
  vrijemeOdlazak TIMESTAMP NOT NULL,
  idVlak INT NOT NULL,
  idStanica INT NOT NULL,
  PRIMARY KEY (idVlak, idStanica),
  FOREIGN KEY (idVlak) REFERENCES VLAK(idVlak),
  FOREIGN KEY (idStanica) REFERENCES STANICA(idStanica)
);

CREATE TABLE KARTA
(
  cijena FLOAT NOT NULL,
  id INT NOT NULL,
  vrijemePolaska DATE NOT NULL,
  vrijemeDolaska DATE NOT NULL,
  polaziste VARCHAR(20) NOT NULL,
  odrediste VARCHAR(20) NOT NULL,
  idKorisnik INT NOT NULL,
  idVlak INT NOT NULL,
  PRIMARY KEY (id, idKorisnik, idVlak),
  FOREIGN KEY (idKorisnik) REFERENCES KORISNIK(idKorisnik),
  FOREIGN KEY (idVlak) REFERENCES VLAK(idVlak)
);