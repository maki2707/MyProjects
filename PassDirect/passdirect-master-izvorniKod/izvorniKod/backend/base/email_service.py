from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.conf import settings
from .models import Karta
from users.models import Korisnik

class EmailService:
    @staticmethod
    def posalji_potvrdu_o_kupnji(korisnik: Korisnik, karta: Karta):
        context = {
            'name': korisnik.ime,
            'email': korisnik.email,
            'polaziste': karta.polaziste.naziv,
            'odrediste': karta.odrediste.naziv,
            'vrijemepolazak': str(karta.vrijemepolazak),
            'vrijemedolazak': str(karta.vrijemedolazak),
            'cijena': str(karta.cijena)
        }

        email_predmet = 'Passdirect - Uspješno kupljena karta'
        email_tijelo = render_to_string('email_potvrda.txt', context)

        email = EmailMessage(email_predmet, email_tijelo, settings.DEFAULT_FROM_EMAIL, [korisnik.email, ], )

        return email.send(fail_silently=False)

    @staticmethod
    def posalji_detalje(vrijeme_polazak, idvlak, polaziste, email, ime, peron, sekcija):
        context = {
            'name': ime,
            'polaziste': polaziste,
            'vrijemepolazak': vrijeme_polazak,
            'sifra_vlaka': idvlak,
            'peron': peron,
            'sekcija': sekcija
        }

        email_predmet = 'Passdirect - Detalji o Vašem putovanju'
        email_tijelo = render_to_string('email_detalji.txt', context)

        email = EmailMessage(email_predmet, email_tijelo, settings.DEFAULT_FROM_EMAIL, [email, ], )

        return email.send(fail_silently=False)
