# Generated by Django 3.2.9 on 2022-01-03 11:09

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0014_alter_korisnik_datum_registracije'),
    ]

    operations = [
        migrations.AlterField(
            model_name='korisnik',
            name='datum_registracije',
            field=models.DateField(default=datetime.datetime(2022, 1, 3, 11, 9, 31, 492765, tzinfo=utc)),
        ),
    ]
