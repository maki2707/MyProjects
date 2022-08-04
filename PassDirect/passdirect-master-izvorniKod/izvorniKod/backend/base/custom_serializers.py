from rest_framework import serializers
from .models import Vlakstanica, Karta


class VlakStanicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vlakstanica
        depth = 2
        fields = '__all__'

class KartaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Karta
        depth = 1
        fields = '__all__'
