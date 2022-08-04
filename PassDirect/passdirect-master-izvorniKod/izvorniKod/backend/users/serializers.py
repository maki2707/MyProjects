from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model

Korisnik = get_user_model()


class KorisnikCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = Korisnik
        fields = ['idkorisnik', 'email', 'ime', 'prezime', 'brkartice', 'datum_registracije']


class KorisnikSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = Korisnik
        fields = ['idkorisnik', 'email', 'ime', 'prezime', 'brkartice', 'datum_registracije']
