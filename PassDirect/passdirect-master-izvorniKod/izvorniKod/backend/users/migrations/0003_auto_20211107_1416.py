# Generated by Django 3.2.9 on 2021-11-07 13:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20211106_1821'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='korisnik',
            name='lozinka',
        ),
        migrations.AddField(
            model_name='korisnik',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
    ]
