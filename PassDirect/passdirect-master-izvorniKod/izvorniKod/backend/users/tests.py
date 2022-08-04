from django.test import TestCase, Client
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from django.http import HttpResponse
from .models import Korisnik, KorisnikManager
# Create your tests here.

client = APIClient()
   

class UserTests(APITestCase):
    
    def test_users_getAll(self):

        url = '/auth/jwt/create'
        u = Korisnik.objects.create_user(email='user.user1@fer.hr', ime='user', prezime='useric',  password='pass123')
        u.is_active = True
        u.save()

        resp = self.client.post(url, {'email':'user.user1@fer.hr', 'password':'pass123'})
        token = resp.data['access']
        client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        u.is_superuser = True
        u.save()
        
        resp = client.get(reverse('getAll'))
        self.assertEqual(resp.status_code, 200)

        u.is_superuser = False
        u.save()

        resp = client.get(reverse('getAll'))
        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.content.decode('ascii'), 'User is not superuser')

    def test_users_delete(self):
        
        url = '/auth/jwt/create'
        u = Korisnik.objects.create_user(email='user.user1@fer.hr', ime='user', prezime='useric',  password='pass123')
        u.is_active = True
        u.save()
        resp = self.client.post(url, {'email':'user.user1@fer.hr', 'password':'pass123'})
        token = resp.data['access']
        client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        u.is_superuser = True
        u.save()
        
        resp = client.delete(reverse('delete', kwargs={'id':68}))
        
        self.assertEqual(resp.status_code, 204)
        
        resp = client.delete(reverse('delete', kwargs={'id':68}))
        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.content.decode('ascii'), "User doesn't exist")

    def test_update_data(self):
        
        url = '/auth/jwt/create'
        u = Korisnik.objects.create_user(email='user.user1@fer.hr', ime='user', prezime='useric',  password='pass123')
        u.is_active = True
        u.save()
        resp = self.client.post(url, {'email':'user.user1@fer.hr', 'password':'pass123'})
        token = resp.data['access']
        client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        u.is_superuser = True
        u.save()

        resp = client.post(reverse('update'), {'ime':'Fran', 'prezime':'Test', 'brkartice':'0101010101010101'}, format='json')
        self.assertEqual(resp.content.decode('ascii'), 'User successfully updated')

        resp = client.post(reverse('update'), {'ime':'Fr!an', 'password':'pass12345', 'brkartice':'0101!!0101010101'}, format='json')
        self.assertEqual(resp.status_code, 401)                   

        
        

        
        
                         

       
       
    

