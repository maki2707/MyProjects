import random
from datetime import timezone, timedelta, datetime
import json

from django.core import serializers
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework_simplejwt.authentication import JWTAuthentication, InvalidToken
from .custom_serializers import VlakStanicaSerializer, KartaSerializer
from .models import Stanica, Vlak, Vlakstanica, Karta
from .sensors import SensorService
from users.models import Korisnik
from .payment_service import PaymentService
from .email_service import EmailService
from .tasks import provjeri_i_posalji


def dohvati_stanice(request):
    stanice_list = Stanica.objects.all().order_by('idstanica')
    return HttpResponse(serializers.serialize('json', stanice_list, fields=('idstanica', 'naziv')))


def dohvat_vlakove(request):
    vlakovi_list = Vlak.objects.all()
    return HttpResponse(
        serializers.serialize('json', vlakovi_list, fields=(
            'idvlak', 'naziv', 'brvagona', 'brputnikavagon', 'idkrajnjastanica', 'kolosijek')))


def stanica_ID(request, stanica_id):
    stanica = [Stanica.objects.get(idstanica=stanica_id)]
    return HttpResponse(serializers.serialize('json', stanica, fields=('idstanica', 'naziv')))


def vlakstanica(request):
    vlak_stanica_list = Vlakstanica.objects.all().order_by('vrijemepolazak')
    return HttpResponse(serializers.serialize('json', vlak_stanica_list, fields=(
        'idvlakstanica', 'vrijemedolazak', 'vrijemepolazak', 'idvlak', 'idstanica')))


def raspored_by_vlakstanica_id(request, stanica_id):
    filtrirani_raspored = list(Vlakstanica.objects.filter(idstanica=stanica_id).order_by('vrijemepolazak'))
    data = VlakStanicaSerializer(filtrirani_raspored, many=True).data
    # ukloni sve vlakove kojima je ovo posljednja stanica
    for i, pdtk in enumerate(data):
        vrijeme_polazak = pdtk['vrijemepolazak']
        if vrijeme_polazak == '00:00:00':
            data.pop(i)

    kasnjenja = SensorService().vrati_kasnjenja(data, timedelta(minutes=1))
    res_dict = json.loads(JSONRenderer().render(data).decode("utf-8"))
    for pdtk in res_dict:
        idvlakstanica = pdtk['idvlakstanica']
        if pdtk['idvlakstanica'] in kasnjenja:
            pdtk['kasnjenje'] = str(kasnjenja[idvlakstanica])
            vrijemedolazak = datetime.strptime(pdtk['vrijemedolazak'], '%H:%M:%S')
            pdtk['vrijemedolazak_s_kasnjenjem'] = str((kasnjenja[idvlakstanica] + vrijemedolazak).time())

    return HttpResponse(json.dumps(res_dict))


def raspored_by_vlakstanica_id_dummy(request, stanica_id):
    filtrirani_raspored = list(Vlakstanica.objects.filter(idstanica=stanica_id).order_by('vrijemepolazak'))
    data = VlakStanicaSerializer(filtrirani_raspored, many=True).data
    # ukloni sve vlakove kojima je ovo posljednja stanica
    for i, pdtk in enumerate(data):
        vrijeme_polazak = pdtk['vrijemepolazak']
        if vrijeme_polazak == '00:00:00':
            data.pop(i)

    kasnjenja = SensorService.vrati_kasnjenja(data, timedelta(minutes=1))
    res_dict = json.loads(JSONRenderer().render(data).decode("utf-8"))
    for pdtk in res_dict:
        idvlakstanica = pdtk['idvlakstanica']
        if pdtk['idvlakstanica'] in kasnjenja:
            dummy_kasnjenje = kasnjenja[idvlakstanica] + timedelta(minutes=random.randint(1, 3))
            pdtk['kasnjenje'] = str(dummy_kasnjenje)
            vrijemedolazak = datetime.strptime(pdtk['vrijemedolazak'], '%H:%M:%S')
            pdtk['vrijemedolazak_s_kasnjenjem'] = str((dummy_kasnjenje + vrijemedolazak).time())

    return HttpResponse(json.dumps(res_dict))


def raspored_filter(request, polaziste_id, odrediste_id, datum):
    filtrirani_raspored = list(Vlakstanica.objects.filter(idstanica=polaziste_id).order_by('vrijemepolazak'))
    data = VlakStanicaSerializer(filtrirani_raspored, many=True).data
    trenutni_datum = datetime.now(tz=timezone(name='UTC', offset=timedelta(hours=1))).date()
    if polaziste_id == odrediste_id:
        res = HttpResponse()
        res.status_code = 406
        res.write("Polazište i odredište ne mogu biti jednaki.")
        return res
    if polaziste_id > odrediste_id:
        res = HttpResponse()
        res.status_code = 406
        res.write("Polazište ne može biti poslije odredišta.")
        return res
    if polaziste_id < 1 or polaziste_id > 5:
        res = HttpResponse()
        res.status_code = 406
        res.write("Polazište ne postoji.")
        return res
    if odrediste_id < 1 or odrediste_id > 5:
        res = HttpResponse()
        res.status_code = 406
        res.write("Odredište ne postoji.")
        return res
    filtered_data_list = []
    for pdtk in data:
        krajnja_stanica = pdtk['idvlak']['idkrajnjastanica']['idstanica']
        if odrediste_id <= krajnja_stanica:
            filtered_data_list.append(pdtk)
    res_dict = json.loads(JSONRenderer().render(filtered_data_list).decode("utf-8"))
    for pdtk in res_dict:
        vrijemedolazak = datetime.strptime(pdtk['vrijemedolazak'], '%H:%M:%S')
        pdtk['cijena'] = PaymentService.izracunaj_cijenu(polaziste_id, odrediste_id)
        # vrijemepolazak = datetime.strptime(pdtk['vrijemepolazak'], '%H:%M:%S')
        pdtk['vrijemedolazak_odrediste'] = str(SensorService.izracunaj_vrijeme_dolaska_na_odrediste(polazisteid=polaziste_id,
                                                                                      odredisteid=odrediste_id,
                                                                                      pocetno_vrijeme=vrijemedolazak).time())
    if trenutni_datum == datum:
        kasnjenja = SensorService.vrati_kasnjenja(filtered_data_list, timedelta(minutes=1))
        for pdtk in res_dict:
            idvlakstanica = pdtk['idvlakstanica']
            if idvlakstanica in kasnjenja:
                vrijemedolazak = datetime.strptime(pdtk['vrijemedolazak'], '%H:%M:%S')
                pdtk['kasnjenje'] = str(kasnjenja[idvlakstanica])
                pdtk['vrijemedolazak_s_kasnjenjem'] = str((kasnjenja[idvlakstanica] + vrijemedolazak).time())

    return HttpResponse(json.dumps(res_dict))



def karte_by_korisnik_id(request, korisnik_id):
    jwt = JWTAuthentication()
    usertoken = jwt.authenticate(request)
    if usertoken is not None:
        user, token = usertoken
        if not user.is_superuser:
            res = HttpResponse()
            res.status_code = 401
            res.write("User is not administrator.")
            return res
        karte_list = list(Karta.objects.filter(idkorisnik=korisnik_id))
        data = KartaSerializer(karte_list, many=True).data
        return HttpResponse(JSONRenderer().render(data))
    res = HttpResponse()
    res.status_code = 401
    res.write("Token invalid.")
    return res


def karte_me(request):
    jwt = JWTAuthentication()
    usertoken = jwt.authenticate(request)
    if usertoken is not None:
        user, token = usertoken
        karte_list = list(Karta.objects.filter(idkorisnik=user.idkorisnik))
        data = KartaSerializer(karte_list, many=True).data
        return HttpResponse(JSONRenderer().render(data))
    res = HttpResponse()
    res.status_code = 401
    res.write("Token invalid.")
    return res


def karte_all(request):
    jwt = JWTAuthentication()
    usertoken = jwt.authenticate(request)
    if usertoken is not None:
        user, token = usertoken
        if not user.is_superuser:
            res = HttpResponse()
            res.status_code = 401
            res.write("User is not administrator.")
            return res
        karte_list = list(Karta.objects.all())
        data = KartaSerializer(karte_list, many=True).data
        return HttpResponse(JSONRenderer().render(data))
    res = HttpResponse()
    res.status_code = 401
    res.write("Token invalid.")
    return res


def karte_by_datum(request, pocetni_datum, konacni_datum):
    jwt = JWTAuthentication()
    usertoken = jwt.authenticate(request)
    poc_dt = datetime.combine(pocetni_datum, datetime.min.time())
    kon_dt = datetime.combine(konacni_datum, datetime.max.time())
    if usertoken is not None:
        user, token = usertoken
        if user.is_superuser:
            karte_list = list(Karta.objects.filter(vrijemepolazak__gte=poc_dt, vrijemepolazak__lte=kon_dt))
            data = KartaSerializer(karte_list, many=True).data
            return HttpResponse(JSONRenderer().render(data))

        else:
            res = HttpResponse()
            res.status_code = 401
            res.write("User is not administrator.")
            return res
    res = HttpResponse()
    res.status_code = 401
    res.write("Token invalid.")
    return res


@csrf_exempt
def kupi(request):
    res = HttpResponse()
    if request.method != "POST":
        res.status_code = 406
        res.write("This endpoint accepts only POST requests")
        return res

    jwt = JWTAuthentication()
    try:
        usertoken = jwt.authenticate(request)
    except InvalidToken:
        res = HttpResponse()
        res.status_code = 401
        res.write("No token in Authentication header or token is invalid.")
        return res

    if usertoken is None:
        res = HttpResponse()
        res.status_code = 401
        res.write("No token in Authentication header or token is invalid.")
        return res
    user, token = usertoken
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    korisnik = Korisnik.objects.filter(idkorisnik=user.idkorisnik).get()
    if korisnik.idkorisnik != int(body["idkorisnik"]):
        res.status_code = 401
        res.write("'idkorisnik' doesn't match 'idkorisnik' from token!")
        return res

    karta = Karta()
    karta.idkorisnik = korisnik
    karta.idvlak = Vlak.objects.filter(idvlak=int(body["idvlak"])).get()
    karta.polaziste = Stanica.objects.filter(idstanica=int(body["pocetna"])).get()
    karta.odrediste = Stanica.objects.filter(idstanica=int(body["odrediste"])).get()
    karta.kolosijek = int(body["kolosijek"])
    karta.vrijemedolazak = datetime.strptime(body["vrijemedolazak"], "%Y-%m-%dT%H:%M:%S.%fZ")
    karta.vrijemepolazak = datetime.strptime(body["vrijemepolazak"], "%Y-%m-%dT%H:%M:%S.%fZ")
    karta.cijena = PaymentService.izracunaj_cijenu(karta.polaziste.idstanica, karta.odrediste.idstanica)
    karta.save()

    korisnik = Korisnik.objects.filter(idkorisnik=user.idkorisnik).get()
    korisnik.brkartice = body["brkartice"]
    korisnik.save()
    EmailService.posalji_potvrdu_o_kupnji(korisnik, karta)
    zakazi_poruku_s_detaljima(korisnik, karta)
    res.write("Uspjeh!")
    return res


def zakazi_poruku_s_detaljima(korisnik: Korisnik, karta: Karta):
    vrijeme_dolazak_vlaka = karta.vrijemepolazak - timedelta(minutes=5)
    vrijeme_polazak_prethodnog = karta.vrijemepolazak - timedelta(minutes=15)  # 5minuta za stajanje 10min za voznju
    vrijeme_provjere = vrijeme_polazak_prethodnog - timedelta(hours=1) + timedelta(minutes=3)  # poravnato za euw vremensku zonu
    provjeri_i_posalji.apply_async((vrijeme_polazak_prethodnog.__str__(),
                                    vrijeme_dolazak_vlaka.__str__(),
                                    karta.idvlak.idvlak,
                                    karta.polaziste.idstanica - 1,
                                    karta.polaziste.naziv,
                                    korisnik.email,
                                    korisnik.ime),
                                   eta=vrijeme_provjere)

    # provjeri_i_posalji(vrijeme_polazak_prethodnog.__str__(),
    #                                 vrijeme_dolazak_vlaka.__str__(),
    #                                 karta.idvlak.idvlak,
    #                                 karta.polaziste.idstanica - 1,
    #                                 karta.polaziste.naziv,
    #                                 korisnik.email,
    #                                 korisnik.ime)
