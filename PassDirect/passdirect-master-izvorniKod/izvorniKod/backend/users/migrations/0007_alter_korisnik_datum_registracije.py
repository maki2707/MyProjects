# Generated by Django 3.2.9 on 2021-11-17 17:07

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_korisnik_datum_registracije'),
    ]

    operations = [
        migrations.AlterField(
            model_name='korisnik',
            name='datum_registracije',
            field=models.DateField(default=datetime.datetime(2021, 11, 17, 17, 7, 16, 25262, tzinfo=utc)),
        ),
    ]
