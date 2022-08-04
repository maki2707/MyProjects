from datetime import datetime
from django.urls import path, register_converter
from . import views


class DateConverter:
    regex = '\d{2}-\d{2}-\d{4}'

    def to_python(self, value):
        return datetime.strptime(value, '%d-%m-%Y').date()

    def to_url(self, value):
        return value


register_converter(DateConverter, 'date')

urlpatterns = [
    path('stanice/', views.dohvati_stanice, name='stanice'),
    path('vlakovi/', views.dohvat_vlakove, name='vlakovi'),
    path('stanice/<int:stanica_id>/', views.stanica_ID, name='stanica_ID'),
    path('raspored/', views.vlakstanica, name='vlakstanica'),
    path(r'raspored/<int:stanica_id>/', views.raspored_by_vlakstanica_id, name='raspored_by_stanica'),
    path(r'raspored/<int:stanica_id>/dummy/', views.raspored_by_vlakstanica_id_dummy, name='dummy'),
    path('raspored/<int:polaziste_id>/<int:odrediste_id>/<date:datum>/', views.raspored_filter, name='raspored_filter'),
    path('karte/<int:korisnik_id>/', views.karte_by_korisnik_id, name='karte_by_korisnik_id'),
    path('karte/all/', views.karte_all, name='karte_all'),
    path('karte/me/', views.karte_me, name='karte_me'),
    path('karte/<date:pocetni_datum>/<date:konacni_datum>', views.karte_by_datum, name='raspored_by_datum'),
    path("kupi/", views.kupi, name='kupi')
]
