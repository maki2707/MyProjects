import datetime

from django.db import models

# Create your models here.
from django.db import models


class Stanica(models.Model):
    idstanica = models.AutoField(primary_key=True)
    naziv = models.CharField(unique=True, max_length=25)

    class Meta:
        managed = False
        db_table = 'stanica'

    def natural_key(self):
        return self.naziv

    def __str__(self):
        return self.naziv

class Karta(models.Model):
    cijena = models.FloatField()
    idkarta = models.AutoField(primary_key=True)
    vrijemepolazak = models.DateTimeField()
    vrijemedolazak = models.DateTimeField()
    polaziste = models.ForeignKey('Stanica', models.DO_NOTHING, related_name="polaziste")
    odrediste = models.ForeignKey('Stanica', models.DO_NOTHING, related_name="odrediste")
    kolosijek = models.IntegerField(default=1)
    idkorisnik = models.ForeignKey('users.Korisnik', models.CASCADE, db_column='idkorisnik')
    idvlak = models.ForeignKey('Vlak', models.CASCADE, db_column='idvlak')

    class Meta:
        managed = True
        db_table = 'karta'
        unique_together = (('idkarta', 'idkorisnik', 'idvlak'),)

    def __str__(self):
        return self.idkarta

class Vlak(models.Model):
    idvlak = models.AutoField(primary_key=True)
    brvagona = models.IntegerField()
    brputnikavagon = models.IntegerField()
    idkrajnjastanica = models.ForeignKey('Stanica', models.DO_NOTHING, db_column='idkrajnjastanica', default=1)
    kolosijek = models.IntegerField(default=1)

    def natural_key(self):
        return self.idvlak
    class Meta:
        managed = True
        db_table = 'vlak'


class Vlakstanica(models.Model):
    idvlakstanica = models.AutoField(primary_key=True)
    vrijemedolazak = models.TimeField(auto_now=False, auto_now_add=False)
    vrijemepolazak = models.TimeField(auto_now=False, auto_now_add=False)
    idvlak = models.ForeignKey(Vlak, models.DO_NOTHING, db_column='idvlak')
    idstanica = models.ForeignKey(Stanica, models.DO_NOTHING, db_column='idstanica')

    def natural_key(self):
        return self.idvlakstanica

    class Meta:
        managed = True
        db_table = 'vlakstanica'
        unique_together = (('idvlak', 'idstanica', 'idvlakstanica'),)
