from rest_framework import serializers
from .models import User, Movie, Theater, Seat, Booking
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("name", "email", "username", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            name=validated_data["name"],
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Please provide the valid credentials")


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = "__all__"


class TheaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theater
        fields = "__all__"


class SeatSerializer(serializers.ModelSerializer):
    theater = TheaterSerializer()
    movie = MovieSerializer()

    class Meta:
        model = Seat
        fields = "__all__"


class SeatUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ["category", "price"]


# # serializers.py
class BookingSerializer(serializers.ModelSerializer):
    seats = SeatSerializer(many=True, read_only=True)

    class Meta:
        model = Booking
        fields = "__all__"
