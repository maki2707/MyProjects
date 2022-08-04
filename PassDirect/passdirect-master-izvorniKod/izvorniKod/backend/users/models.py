

from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class KorisnikManager(BaseUserManager):
    def create_user(self, email, ime, prezime, password):
        if not email:
            raise ValueError('Korisnik mora imati email adresu')
        email = self.normalize_email(email)
        korisnik = self.model(email=email, ime=ime, prezime=prezime)
        korisnik.set_password(password)
        korisnik.save()

        return korisnik

    def create_superuser(self, email, ime, prezime, password):
        if not email:
            raise ValueError('Korisnik mora imati email adresu')
        email = self.normalize_email(email)
        korisnik = self.model(email=email, ime=ime, prezime=prezime)
        korisnik.set_password(password)
        korisnik.is_superuser = True
        korisnik.save()

        return korisnik

class Korisnik(AbstractBaseUser, PermissionsMixin):
    idkorisnik = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True, max_length=50)
    ime = models.CharField(max_length=20)
    prezime = models.CharField(max_length=30)
    brkartice = models.CharField(max_length=16, blank=True, null=True, default=None)
    is_active = models.BooleanField(default=False)
    datum_registracije = models.DateField(default=now().date())

    objects = KorisnikManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['ime','prezime', 'is_superuser', 'brkartice', 'datum_registracije']
    class Meta:
        managed = True
        db_table = 'korisnik'
