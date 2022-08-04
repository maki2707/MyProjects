from django.test import TestCase, Client
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from django.http import HttpResponse
from .models import Stanica, Vlak, Vlakstanica, Karta
from users.models import Korisnik
from datetime import date
import datetime
import pytz
# Create your tests here.

client = APIClient()
   

class BaseTests(APITestCase):
    
    def test_karte_byId(self):

        url = '/auth/jwt/create'
        u = Korisnik.objects.create_user(email='user.user1@fer.hr', ime='user', prezime='useric',  password='pass123')
        u.is_active = True
        u.save()

        resp = self.client.post(url, {'email':'user.user1@fer.hr', 'password':'pass123'})
        token = resp.data['access']
        client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        u.is_superuser = True
        u.save()
        
        resp = client.get(reverse('karte_by_korisnik_id', kwargs={'korisnik_id':u.idkorisnik}))
        self.assertEqual(resp.status_code, 200)

        u.is_superuser = False
        u.save()

        resp = client.get(reverse('karte_by_korisnik_id', kwargs={'korisnik_id':u.idkorisnik}))
        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.content.decode('UTF-8'), 'User is not administrator.')

    def test_karte_me(self):

        url = '/auth/jwt/create'
        u = Korisnik.objects.create_user(email='user.user1@fer.hr', ime='user', prezime='useric',  password='pass123')
        u.is_active = True
        u.save()

        resp = self.client.post(url, {'email':'user.user1@fer.hr', 'password':'pass123'})
        token = resp.data['access']
        client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        u.is_superuser = True
        u.save()
        
        resp = client.get(reverse('karte_me'))
        self.assertEqual(resp.status_code, 200)

        u.is_superuser = False
        u.save()

        resp = client.get(reverse('karte_me'))
        self.assertEqual(resp.status_code, 200)
    
    def test_raspored_filter(self):
        
        st1 = Stanica.objects.get(idstanica = 1)
        st2 = Stanica.objects.get(idstanica = 2)
        today = date.today()
        d = today.strftime("%d-%m-%Y")
        resp = client.get(reverse('raspored_filter', kwargs={'polaziste_id':st1.idstanica, 'odrediste_id':st2.idstanica, 'datum':d}))
        self.assertEqual(resp.status_code, 200)

        resp = client.get(reverse('raspored_filter', kwargs={'polaziste_id':st2.idstanica, 'odrediste_id':st1.idstanica, 'datum':d}))
        self.assertEqual(resp.status_code, 406)
        self.assertEqual(resp.content.decode('UTF-8'), 'Polazište ne može biti poslije odredišta.')
    
        resp = client.get(reverse('raspored_filter', kwargs={'polaziste_id':st2.idstanica, 'odrediste_id':6, 'datum':d}))
        self.assertEqual(resp.status_code, 406)
        self.assertEqual(resp.content.decode('UTF-8'), 'Odredište ne postoji.')

        resp = client.get(reverse('raspored_filter', kwargs={'polaziste_id':0, 'odrediste_id':st2.idstanica, 'datum':d}))
        self.assertEqual(resp.status_code, 406)
        self.assertEqual(resp.content.decode('UTF-8'), 'Polazište ne postoji.')

    def test_vlakovi(self):
        
        resp = client.get(reverse('vlakovi'))
        self.assertEqual(resp.status_code, 200)
       

        
