from django.http import JsonResponse, HttpResponseBadRequest
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.paginator import Paginator
from django.db.models import Q
from .serializers import *
from .models import *
import json


# for user registration
class Register(APIView):
    def post(self, request):
        data = json.loads(request.body)
        exist_user = User.objects.filter(email=data["email"]).first()
        if not exist_user:
            serialized = UserSerializer(data=data)
            if serialized.is_valid():
                user = serialized.save()
                return JsonResponse(
                    {"msg": "Registration Successful"}, status=status.HTTP_201_CREATED
                )
            return JsonResponse(
                {"msg": "Registration Failed"}, status=status.HTTP_400_BAD_REQUEST
            )
        return JsonResponse(
            {"msg": "user is already exist"}, status=status.HTTP_208_ALREADY_REPORTED
        )


# for user login
class Login(APIView):
    def post(self, request):
        data = json.loads(request.body)
        serialized = LoginSerializer(data=data)
        if serialized.is_valid():
            user = serialized.validated_data
            refresh = RefreshToken.for_user(user)
            return JsonResponse(
                {
                    "msg": "Login Successful",
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                },
                status=status.HTTP_200_OK,
            )
        return JsonResponse(
            {"msg": "Login failed. Try again"}, status=status.HTTP_401_UNAUTHORIZED
        )


# to get user details
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


# for user profile update
class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        data = request.data
        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#  for user profile delete
class UserDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response(
            {"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT
        )


# to reset the password
class ResetPasswordView(APIView):
    def post(self, request):
        username = request.data.get("username")
        new_password = request.data.get("newPassword")

        try:
            user = User.objects.get(username=username)
            user.set_password(new_password)
            user.save()

            return Response(
                {"success": True, "message": "Password updated successfully."}
            )
        except User.DoesNotExist:
            return Response(
                {"success": False, "message": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )


# to update the password
class UpdatePassword(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user

        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not user.check_password(old_password):
            return Response(
                {"detail": "Incorrect old password"}, status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"detail": "Password updated successfully"}, status=status.HTTP_200_OK
        )


# for generate access token from refresh token
class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            refresh_token = RefreshToken(refresh_token)
            access_token = refresh_token.access_token
        except Exception as e:
            return Response(
                {"detail": "Invalid refresh token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return Response({"access_token": str(access_token)}, status=status.HTTP_200_OK)


#  get all movies
class GetMovies(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        page_num = request.GET.get("page", 1)
        movies = Movie.objects.all().order_by("id")
        paginator = Paginator(movies, 6)
        page = paginator.get_page(page_num)
        movie_obj = page.object_list
        serialized_movies = MovieSerializer(movie_obj, many=True).data
        return JsonResponse(
            {
                "data": serialized_movies,
                "total_movies": movies.count(),
                "total_pages": paginator.num_pages,
            }
        )


# create a movie
class CreateMovieView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# update the movie
class MovieUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def put(self, request, movie_id):
        movie = Movie.objects.filter(id=movie_id).first()
        if movie is None:
            return Response(
                {"message": "Movie not found."}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = MovieSerializer(movie, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# delete a movie
class MovieDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def delete(self, request, movie_id):
        movie = Movie.objects.filter(id=movie_id).first()
        if movie is None:
            return Response(
                {"message": "Movie not found."}, status=status.HTTP_404_NOT_FOUND
            )

        movie.delete()
        return Response(
            {"msg": "delete movie successfully"}, status=status.HTTP_204_NO_CONTENT
        )


# get filtered movie or searched movie
class MultipleFilteredMovie(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        page_num = request.GET.get("page", 1)
        search_text = request.GET.get("search_text", None)
        genre = request.GET.get("genre", None)
        language = request.GET.get("language", None)
        rating = request.GET.get("rating", None)

        movies = Movie.objects.all().order_by("id")
        if search_text:
            movies = movies.filter(Q(title__icontains=search_text))
        if genre:
            movies = movies.filter(Q(genre__icontains=genre))
        if language:
            movies = movies.filter(Q(language__icontains=language))
        if rating:
            movies = movies.filter(Q(rating__icontains=float(rating)))

        paginator = Paginator(movies, 6)
        page = paginator.get_page(page_num)
        movie_obj = page.object_list
        serialized_movies = MovieSerializer(movie_obj, many=True).data
        return JsonResponse(
            {
                "data": serialized_movies,
                "total_movies": movies.count(),
                "total_pages": paginator.num_pages,
            }
        )


# get all theaters for a movie
class GetTheaters(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, movie_id):
        theaters = Theater.objects.filter(movie=movie_id)
        if theaters:
            serializer = TheaterSerializer(theaters, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# create a theater for a movie
class CreateTheaterView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        serializer = TheaterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# get all tickets or bookings for a user
class AllTickets(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        bookings = Booking.objects.filter(user=user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# get single ticket or booking for a user
class SingleTicket(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ticket_id):
        user = request.user
        try:
            booking = Booking.objects.get(user=user, id=ticket_id)
        except Booking.DoesNotExist:
            return Response(
                {"msg": "Ticket not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_200_OK)


# create a ticket or booking for a user
class CreateTicket(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = json.loads(request.body)
        user_id = request.user.id
        movie_id = data.get("movie")
        seat_ids = data.get("seats", [])

        try:
            movie = Movie.objects.get(id=movie_id)
        except Movie.DoesNotExist:
            return Response(
                {"msg": "Movie not found"}, status=status.HTTP_404_NOT_FOUND
            )

        seats = []
        total_cost = 0.0
        for seat_id in seat_ids:
            try:
                seat = Seat.objects.get(id=seat_id)
            except Seat.DoesNotExist:
                return Response(
                    {"msg": f"Seat with ID {seat_id} not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            seats.append(seat)
            total_cost += seat.price

        booking_data = {
            "user": user_id,
            "movie": movie_id,
            "total_cost": total_cost,
        }
        serializer = BookingSerializer(data=booking_data)

        if serializer.is_valid():
            booking = serializer.save()
            booking.seats.set(seats)  # Associate seats with booking

            response_data = {
                "user": user_id,
                "movie": movie_id,
                "seats": SeatSerializer(seats, many=True).data,
                "total_cost": total_cost,
            }

            return Response(
                {
                    "msg": "Congrats! Your tickets are booked successfully",
                    "data": response_data,
                },
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# delete a ticket or booking for a user
class DeleteBooking(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response(
                {"msg": "Booking not found"}, status=status.HTTP_404_NOT_FOUND
            )

        booking.delete()
        return Response(
            {"msg": "Booking deleted successfully"}, status=status.HTTP_204_NO_CONTENT
        )


# create a seat for a theater
class SeatCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        data = request.data

        try:
            theater_id = data.get("theater")
            movie_id = data.get("movie")

            theater_instance = Theater.objects.get(id=theater_id)
            movie_instance = Movie.objects.get(id=movie_id)

            seat_data = {
                "theater": theater_instance,
                "movie": movie_instance,
                "seat_number": data.get("seat_number"),
                "is_reserved": data.get("is_reserved", False),
                "category": data.get("category"),
                "price": data.get("price", 0.00),
            }
            Seat.objects.create(**seat_data)
            return Response(
                {"message": "Seats created successfully"},
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# get all seats
class AllSeatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            seats = Seat.objects.all()
            # print(seats)
            serializer = SeatSerializer(seats, many=True)
            return Response(serializer.data)
        except Seat.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


# get all seats for a theater
class TheaterSeatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, theater_id):
        try:
            seats = Seat.objects.filter(theater=theater_id)
            # print(seats)
            serializer = SeatSerializer(seats, many=True)
            return Response(serializer.data)
        except Seat.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


# create seat reservation
class CreateReserveSeats(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        seat_ids = request.data.get("seats", [])

        if not seat_ids:
            return Response(
                {"message": "No seat IDs provided for reservation."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reserved_seats = []
        already_reserved_seats = []

        for seat_id in seat_ids:
            try:
                seat_instance = Seat.objects.get(id=seat_id)
                if seat_instance.is_reserved:
                    already_reserved_seats.append(seat_instance.seat_number)
                else:
                    serializer = SeatSerializer(
                        seat_instance, data={"is_reserved": True}, partial=True
                    )

                    if serializer.is_valid():
                        serializer.save()
                        reserved_seats.append(serializer.data)
                    else:
                        return Response(
                            serializer.errors, status=status.HTTP_400_BAD_REQUEST
                        )
            except Seat.DoesNotExist:
                return Response(
                    {"message": f"Seat with ID {seat_id} does not exist."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        response_data = {"data": reserved_seats}

        if already_reserved_seats:
            response_data[
                "message"
            ] = f"The following seats are already reserved: {', '.join(already_reserved_seats)}"
        else:
            response_data["message"] = "Seats reserved successfully."

        return Response(response_data, status=status.HTTP_201_CREATED)


# get all reserved seats
class GetReservedSeats(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            seats = Seat.objects.filter(Q(is_reserved__in=[True]))
            print(seats)
            serializer = SeatSerializer(seats, many=True)
            return Response(serializer.data)
        except Seat.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


# update the seat reservation
class UpdateReservation(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, seat_id):
        try:
            update_data = json.loads(request.body)
            serialized_update_data = SeatUpdateSerializer(
                data=update_data, partial=True
            )

            if serialized_update_data.is_valid():
                updated_seat = Seat.objects.get(id=seat_id)

                # Update the fields based on the valid serialized data
                for key, value in serialized_update_data.validated_data.items():
                    setattr(updated_seat, key, value)
                updated_seat.save()

                return JsonResponse(
                    {
                        "msg": "Updated successfully",
                        "data": serialized_update_data.data,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return JsonResponse(
                    {"msg": "Update failed. Invalid data."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            return HttpResponseBadRequest(str(e))
