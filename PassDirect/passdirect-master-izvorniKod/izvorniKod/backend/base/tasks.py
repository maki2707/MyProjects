import random

from passdirect.celery import app
from datetime import timedelta, datetime
from .sensors import SensorService, SenzorskiPodatak
from django.core.mail import EmailMessage, settings
from .email_service import EmailService
from .models import Vlak


@app.task
def provjeri_i_posalji(vrijeme_polazak_prethodnog, vrijeme_dolazak, idvlak, id_prethodna_stanica, polaziste, email,
                       ime):
    vrijeme_polazak_prethodnog = datetime.strptime(vrijeme_polazak_prethodnog, "%Y-%m-%d %H:%M:%S").time()
    vrijeme_dolazak = datetime.strptime(vrijeme_dolazak, "%Y-%m-%d %H:%M:%S").time()
    vrijeme_polazak_preth_plus5 = (
                datetime.combine(datetime.today(), vrijeme_polazak_prethodnog) + timedelta(minutes=5)).time()
    if id_prethodna_stanica < 1:
        vrijeme_dolazak = datetime.combine(datetime.today(), vrijeme_dolazak)
        broj_vagona = Vlak.objects.filter(idvlak=idvlak).get().brvagona
        sekcija = random.randint(0, 1)
        sekcija = "prednji" if sekcija == 0 else "stražnji"
        EmailService.posalji_detalje(vrijeme_dolazak.__str__(), idvlak, polaziste, email, ime,
                                     random.randint(1, broj_vagona), sekcija)
        return



    podaci = SensorService.dohvati_podatke(vrijeme_polazak_preth_plus5)
    podatak = 0
    for pdtk in podaci:
        if pdtk.stanica == id_prethodna_stanica and pdtk.oznaka_vlaka == idvlak and (
                vrijeme_polazak_prethodnog < pdtk.vrijeme < vrijeme_polazak_preth_plus5):
            podatak = pdtk
            break

    if podatak == 0:
        vrijeme_dolazak = datetime.combine(datetime.today(), vrijeme_dolazak)
        broj_vagona = Vlak.objects.filter(idvlak=idvlak).get().brvagona
        sekcija = random.randint(0, 1)
        sekcija = "prednji" if sekcija == 0 else "stražnji"
        EmailService.posalji_detalje(vrijeme_dolazak.__str__(), idvlak, polaziste, email, ime,
                                     random.randint(1, broj_vagona), sekcija)
        return

    razlika_senzor_polazak = datetime.combine(datetime.today(), podatak.vrijeme) - datetime.combine(
        datetime.today(), vrijeme_polazak_prethodnog)
    kasnjenje = razlika_senzor_polazak - timedelta(minutes=1)
    vrijeme_dolazak = datetime.combine(datetime.today(), vrijeme_dolazak) + kasnjenje

    peron, sekcija = SensorService.smjesti_u_vagon(tezine=podatak.tezine)
    sekcija = "prednji" if sekcija == 0 else "stražnji"
    EmailService.posalji_detalje(vrijeme_dolazak.__str__(), idvlak, polaziste, email, ime, peron, sekcija)

    return email + vrijeme_dolazak.__str__() + ' ' + str(peron) + ' ' + str(sekcija)


def posalji_test_mail():
    email_predmet = 'Uspjeh'

    email = EmailMessage(email_predmet, "uspjeh", settings.DEFAULT_FROM_EMAIL, ['lovrogm@gmail.com', ], )

    return email.send(fail_silently=False)

# if __name__ == '__main__':
#     provjeri_i_posalji("2022-01-11 16:59:00", 1, 2, "lovrogm@gmail.com")
