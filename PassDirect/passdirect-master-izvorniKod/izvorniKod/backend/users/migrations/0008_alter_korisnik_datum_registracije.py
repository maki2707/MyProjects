# Generated by Django 3.2.9 on 2021-11-18 13:09

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_alter_korisnik_datum_registracije'),
    ]

    operations = [
        migrations.AlterField(
            model_name='korisnik',
            name='datum_registracije',
            field=models.DateField(default=datetime.datetime(2021, 11, 18, 13, 9, 31, 585979, tzinfo=utc)),
        ),
    ]
