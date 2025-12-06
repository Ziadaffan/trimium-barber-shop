"use strict";

function desabledInputs() {
  $("#app_services").prop("disabled", true);
  $("#app_date").prop("disabled", true);
  $("#app_time_display").prop("disabled", true);
  $("#app_time").prop("disabled", true);
}

$(function () {
  var form = $("#appointment_form");

  var formMessages = $("#msg-status");

  $(form).submit(function (event) {
    event.preventDefault();

    $(".invalid-feedback").hide();
    $(".form-control").removeClass("is-invalid is-valid");

    if (!validateForm()) {
      $(formMessages).removeClass("alert-success");
      $(formMessages).addClass("alert-danger");
      $(formMessages).text("Please correct the errors below");
      return;
    }

    var formData = {
      name: $("#app_name").val(),
      email: $("#app_email").val(),
      phone: $("#app_phone").val(),
      date: $("#app_date").val(),
      time: $("#app_time_display").val(),
      serviceType: $("#app_services").val(),
      barberId: $("#app_barbers").val(),
    };

    $.ajax({
      type: "POST",
      url: `https://trimium-barber-shop-api.vercel.app/api/reservations`,
      data: formData,
    })
      .done(function (response) {
        $(formMessages).removeClass("alert-danger");
        $(formMessages).addClass("alert-success");
        $(formMessages).text("Thanks for your reservation!");
        $(formMessages).show();

        resetForm();
        desabledInputs();
      })
      .fail(function (data) {
        $(formMessages).removeClass("alert-success");
        $(formMessages).addClass("alert-danger");

        if (data.responseJSON && data.responseJSON.message) {
          $(formMessages).text(data.responseJSON.message);
        } else {
          $(formMessages).text(
            "Oops! An error occurred and your appointment could not be booked."
          );
        }
        desabledInputs();
      });
  });

  $(
    "#app_name, #app_email, #app_phone, #app_date, #app_time_display, #app_services, #app_barbers"
  ).on("input change", function () {
    const fieldId = $(this).attr("id");
    const errorId =
      fieldId.replace("app_", "").replace("_display", "") + "-error";
    $("#" + errorId).hide();
    $(this).removeClass("is-invalid is-valid");
  });
});

function resetForm() {
  $("#appointment_form")[0].reset();
  $("#app_time_display").val("");
  $("#app_time").val("");

  $("#app_services").prop("selectedIndex", 0);
  $("#app_barbers").prop("selectedIndex", 0);
  $("#app_services").niceSelect("update");
  $("#app_barbers").niceSelect("update");
}

const validateName = (name) => {
  return name.length > 0 && name.length <= 50;
};

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone) => {
  const cleanedPhone = phone.replace(/[^0-9]/g, "");

  return /^[0-9]{10}$/.test(cleanedPhone);
};

const validateDate = (date) => {
  const now = new Date();

  if (new Date(date) < now) {
    return false;
  }

  return true;
};

const validateTime = (time) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

const validateServiceName = (service) => {
  return service && service.length > 0;
};

const validateBarberName = (barber) => {
  return barber && barber.length > 0;
};

const validateForm = () => {
  const name = $("#app_name").val();
  const email = $("#app_email").val();
  const phone = $("#app_phone").val();
  const date = $("#app_date").val();
  const time = $("#app_time").val();
  const services = $("#app_services").val();
  const barbers = $("#app_barbers").val();
  let isFormValid = true;

  if (!validateName(name)) {
    isFormValid = false;
    $("#app_name").addClass("is-invalid");
    if (name.length === 0) {
      $("#name-error").text("Name is required").show();
    } else if (name.length > 50) {
      $("#name-error").text("Name must be less than 50 characters").show();
    }
  } else {
    $("#app_name").removeClass("is-invalid").addClass("is-valid");
  }

  if (!validateEmail(email)) {
    isFormValid = false;
    $("#app_email").addClass("is-invalid");
    if (email.length === 0) {
      $("#email-error").text("Email is required").show();
    } else {
      $("#email-error").text("Please enter a valid email address").show();
    }
  } else {
    $("#app_email").removeClass("is-invalid").addClass("is-valid");
  }

  if (!validatePhone(phone)) {
    isFormValid = false;
    $("#app_phone").addClass("is-invalid");
    if (phone.length === 0) {
      $("#phone-error").text("Phone number is required").show();
    } else {
      $("#phone-error")
        .text("Please enter a valid 10-digit phone number")
        .show();
    }
  } else {
    $("#app_phone").removeClass("is-invalid").addClass("is-valid");
  }

  if (!validateDate(date)) {
    isFormValid = false;
    $("#app_date").addClass("is-invalid");
    if (date.length === 0) {
      $("#date-error").text("Date is required").show();
    } else {
      $("#date-error").text("Please enter a valid date").show();
    }
  } else {
    $("#app_date").removeClass("is-invalid").addClass("is-valid");
  }

  if (!validateTime(time)) {
    isFormValid = false;
    $("#app_time_display").addClass("is-invalid");
    if (time.length === 0) {
      $("#time-error").text("Time is required").show();
    } else {
      $("#time-error").text("Please select a valid time").show();
    }
  } else {
    $("#app_time_display").removeClass("is-invalid").addClass("is-valid");
  }

  if (!validateServiceName(services)) {
    isFormValid = false;
    $("#app_services").addClass("is-invalid");
    $("#services-error").text("Please select a service").show();
  } else {
    $("#app_services").removeClass("is-invalid").addClass("is-valid");
  }

  if (!validateBarberName(barbers)) {
    isFormValid = false;
    $("#app_barbers").addClass("is-invalid");
    $("#barbers-error").text("Please select a barber").show();
  } else {
    $("#app_barbers").removeClass("is-invalid").addClass("is-valid");
  }

  return isFormValid;
};
