import json

from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from rest_framework_simplejwt.authentication import JWTAuthentication, InvalidToken
from . import models


@csrf_exempt
def delete(request, id):
    if request.method == "DELETE":
        jwt = JWTAuthentication()
        usertoken = jwt.authenticate(request)
        if usertoken is not None:
            user, token = usertoken
            if user.is_superuser:
                try:
                    korisnik = models.Korisnik.objects.filter(idkorisnik=id).get()
                    korisnik.delete()
                    res = HttpResponse()
                    res.status_code = 204
                    res.write("User successfully deleted")
                    return res
                except:
                    res = HttpResponse()
                    res.status_code = 401
                    res.write("User doesn't exist")
                    return res
            res = HttpResponse()
            res.status_code = 401
            res.write("User is not a superuser")
            return res
        res = HttpResponse()
        res.status_code = 401
        res.write("Token invalid.")
        return res
    res = HttpResponse()
    res.write("Method is not DELETE")
    res.status_code = 401
    return res


@csrf_exempt
def delete_me(request):
    res = HttpResponse()
    if request.method == "DELETE":
        jwt = JWTAuthentication()
        usertoken = jwt.authenticate(request)
        if usertoken is not None:
            user, token = usertoken
        else:
            res.status_code = 401
            res.write("User token doesn't exist")
            return res
        try:
            korisnik = models.Korisnik.objects.filter(idkorisnik=user.idkorisnik).get()
            korisnik.delete()
            res.write("User successfully deleted")
            return res
        except:
            res.status_code = 401
            res.write("User doesn't exist")
            return res

    res.write("Method is not DELETE")
    res.status_code = 401
    return res


@csrf_exempt
def get_all(request):
    try:
        jwt = JWTAuthentication()
        usertoken = jwt.authenticate(request)
    except InvalidToken:
        res = HttpResponse()
        res.status_code = 401
        res.write("Invalid or expired token")
        return res

    user, token = usertoken
    if user is None:
        res = HttpResponse()
        res.status_code = 401
        res.write("Invalid token")
        return res

    if not user.is_superuser:
        res = HttpResponse()
        res.status_code = 401
        res.write("User is not superuser")
        return res

    usersList = models.Korisnik.objects.all()
    return HttpResponse(serializers.serialize('json', usersList,
                                              fields=(
                                                  'idkorisnik', 'email', 'ime', 'prezime', 'brkartice', 'is_active',
                                                  'is_superuser', 'datum_registracije')))


@csrf_exempt
def get(request, id):
    try:
        jwt = JWTAuthentication()
        usertoken = jwt.authenticate(request)
    except InvalidToken:
        res = HttpResponse()
        res.status_code = 401
        res.write("Invalid or expired token")
        return res

    user, token = usertoken
    if user is None:
        res = HttpResponse()
        res.status_code = 401
        res.write("Invalid token")
        return res

    if not user.is_superuser:
        res = HttpResponse()
        res.status_code = 401
        res.write("User is not superuser")
        return res

    user = [models.Korisnik.objects.get(idkorisnik=id)]
    return HttpResponse(serializers.serialize('json', user,
                                              fields=(
                                                  'idkorisnik', 'email', 'ime', 'prezime', 'brkartice', 'is_active',
                                                  'is_superuser', 'datum_registracije')))



@csrf_exempt
def update_user_data(request):
    res = HttpResponse()
    if request.method == "POST":
        jwt = JWTAuthentication()
        usertoken = jwt.authenticate(request)
        if usertoken is not None:
            user, token = usertoken
        else:
            res.status_code = 401
            res.write("User token doesn't exist")
            return res
        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            korisnik = models.Korisnik.objects.filter(idkorisnik=user.idkorisnik).get()
            korisnik.ime = body["ime"]
            korisnik.prezime = body["prezime"]
            korisnik.brkartice = body["brkartice"]
            korisnik.save()
            res.write("User successfully updated")
            return res
        except Exception as e:
            res.status_code = 401
            res.write("User doesn't exist or error during decoding \n" + str(e) + body_unicode)
            return res

    res.write("Method is not POST")
    res.status_code = 401
    return res
