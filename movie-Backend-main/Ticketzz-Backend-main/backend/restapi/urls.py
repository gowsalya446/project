from django.urls import path
from .views import *

urlpatterns = [
    path("users/create/", Register.as_view(), name="register"),
    path("users/get/", UserDetailView.as_view(), name="get-user-details"),
    path("users/update/", UserUpdateView.as_view(), name="update-user-details"),
    path("users/delete/", UserDeleteView.as_view(), name="delete-user"),
    path("users/forgot_password/", ResetPasswordView.as_view(), name="reset-password"),
    path("users/update_password/", UpdatePassword.as_view(), name="update-password"),
    path("auth/", Login.as_view(), name="login"),
    path("refresh/", RefreshTokenView.as_view(), name="generate-access-token"),
    path("movies/", GetMovies.as_view(), name="get-all-movies"),
    path("movies/create/", CreateMovieView.as_view(), name="create-movie"),
    path(
        "movies/update/<int:movie_id>/", MovieUpdateView.as_view(), name="update-movie"
    ),
    path(
        "movies/delete/<int:movie_id>/", MovieDeleteView.as_view(), name="delete-movie"
    ),
    path("movies/search/", MultipleFilteredMovie.as_view(), name="get-search-movies"),
    path("theaters/<int:movie_id>/", GetTheaters.as_view(), name="get-all-theaters"),
    path("theater/create/", CreateTheaterView.as_view(), name="create-theater"),
    path("tickets/create/", CreateTicket.as_view(), name="create-ticket"),
    path(
        "bookings/",
        AllTickets.as_view(),
        name="get-all-booking-summary",
    ),
    path(
        "bookings/<int:booking_id>/delete/",
        DeleteBooking.as_view(),
        name="delete-booking",
    ),
    path("seats/create/", SeatCreateView.as_view(), name="create-seats"),
    path("seats/", AllSeatsView.as_view(), name="get-all-seats"),
    path(
        "theaters/<int:theater_id>/seats/",
        TheaterSeatsView.as_view(),
        name="get-all-theater-seats",
    ),
    path(
        "seats/reserve/create/",
        CreateReserveSeats.as_view(),
        name="create-reserve-seats",
    ),
    path("seats/reserve/", GetReservedSeats.as_view(), name="get-all-reserve-seats"),
    path(
        "seats/<int:seat_id>/update_reservation/",
        UpdateReservation.as_view(),
        name="update-seat-reserves",
    ),
]
