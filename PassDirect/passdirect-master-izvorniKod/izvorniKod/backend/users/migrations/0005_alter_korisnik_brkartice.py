# Generated by Django 3.2.9 on 2021-11-16 13:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_remove_korisnik_uloga'),
    ]

    operations = [
        migrations.AlterField(
            model_name='korisnik',
            name='brkartice',
            field=models.CharField(blank=True, default=None, max_length=16, null=True),
        ),
    ]
