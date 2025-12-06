/*
	BarberShop Theme Scripts
*/

(function ($) {
  "use strict";

  $(window).on("load", function () {
    $("body").addClass("loaded");
  });

  $("#app_date").on("change", function () {
    getAvailableTimes($("#app_date").val());
  });

  $(document).on("change", "#app_barbers", function () {
    const selectedBarber = $("#app_barbers").val();
    if (selectedBarber) {
      enableServiceInputs();
    }
  });

  $(document).on("change", "#app_services", function () {
    const selectedService = $("#app_services").val();
    if (selectedService) {
      enableDateInputs();
    }
  });

  $(document).on("change", "#app_barbers, #app_services", function () {
    const selectedDate = $("#app_date").val();
    if (selectedDate) {
      getAvailableTimes(selectedDate);
    }
  });

  $(document).ready(function () {
    desabledInputs();
    getBarbers();
    getServices();
    resetForm();
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

  function enableServiceInputs() {
    $("#app_services").prop("disabled", false);
    $("#app_services").niceSelect("update");
  }

  function enableDateInputs() {
    $("#app_date").prop("disabled", false);
    $("#app_time_display").prop("disabled", false);
    $("#app_time").prop("disabled", false);
    $("#app_date").niceSelect("update");
    $("#app_time_display").niceSelect("update");
    $("#app_time").niceSelect("update");
  }

  function desabledInputs() {
    $("#app_services").prop("disabled", true);
    $("#app_date").prop("disabled", true);
    $("#app_time_display").prop("disabled", true);
    $("#app_time").prop("disabled", true);
  }

  function getBarbers() {
    $.ajax({
      url: `https://trimium-barber-shop-api.vercel.app/api/barbers`,
      type: "GET",
      cache: false,
      success: function (response) {
        const barbers = response;
        const barberSelect = $("#app_barbers");

        barberSelect.find("option:not(:first)").remove();

        barbers.forEach((barber) => {
          barberSelect.append(
            `<option value="${barber.id}">${barber.name}</option>`
          );
        });

        barberSelect.niceSelect();
      },
      error: function (error) {
        console.log("Erreur chargement barbiers:", error);
        $("#app_barbers").niceSelect();
      },
    });
  }
  function getServices() {
    $.ajax({
      url: `https://trimium-barber-shop-api.vercel.app/api/services`,
      type: "GET",
      cache: false,
      success: function (response) {
        const services = response;
        const servicesSelect = $("#app_services");

        servicesSelect.find("option:not(:first)").remove();

        services.forEach((service) => {
          servicesSelect.append(
            `<option value="${service.type}">${service.name}</option>`
          );
        });

        servicesSelect.niceSelect();
      },
      error: function (error) {
        console.log("Erreur chargement services:", error);
        $("#app_services").niceSelect();
      },
    });
  }

  function getAvailableTimes(date) {
    $.ajax({
      url: `https://trimium-barber-shop-api.vercel.app/api/reservations/available-times`,
      type: "POST",
      cache: false,
      data: {
        date: date,
        barberId: $("#app_barbers").val(),
        serviceType: $("#app_services").val(),
      },
    })
      .done(function (response) {
        displayAvailableTimes(response);
      })
      .fail(function (error) {
        clearTimeOptions();
      });
  }

  function displayAvailableTimes(availableTimes) {
    const timeOptionsContainer = $("#time-options");

    if (timeOptionsContainer.length === 0) {
      return;
    }

    timeOptionsContainer.empty();

    let times = [];
    if (Array.isArray(availableTimes)) {
      times = availableTimes;
    } else if (availableTimes && Array.isArray(availableTimes.times)) {
      times = availableTimes.times;
    } else if (availableTimes && Array.isArray(availableTimes.availableTimes)) {
      times = availableTimes.availableTimes;
    }

    if (times.length === 0) {
      timeOptionsContainer.append(
        `<div class="time-option" style="padding: 10px; text-align: center; color: #999;">Aucun horaire disponible. Au cas d'urgence veuillez appeler le 418-555-5555</div>`
      );
      return;
    }

    times.forEach(function (time) {
      const timeValue =
        typeof time === "string" ? time : time.time || time.value;
      const timeDisplay = formatTimeDisplay(timeValue);

      const timeOption = $(
        '<div class="time-option" data-value="' +
          timeValue +
          '" onclick="selectTime(\'' +
          timeValue +
          "', '" +
          timeDisplay +
          "')\">" +
          timeDisplay +
          "</div>"
      );

      timeOptionsContainer.append(timeOption);
    });
  }

  function clearTimeOptions() {
    const timeOptionsContainer = $("#time-options");
    if (timeOptionsContainer.length > 0) {
      timeOptionsContainer.empty();
    }
  }

  function formatTimeDisplay(time) {
    if (!time || typeof time !== "string") return time;

    const parts = time.split(":");
    if (parts.length !== 2) return time;

    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    if (isNaN(hours)) return time;

    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    return `${displayHours.toString().padStart(2, "0")}:${minutes} ${period}`;
  }

  /*=========================================================================
    Isotope Active
=========================================================================*/
  $(".portfolio_items").imagesLoaded(function () {
    $(".gallery_filter li").on("click", function () {
      $(".gallery_filter li").removeClass("active");
      $(this).addClass("active");

      var selector = $(this).attr("data-filter");
      $(".portfolio_items").isotope({
        filter: selector,
        animationOptions: {
          duration: 750,
          easing: "linear",
          queue: false,
        },
      });
      return false;
    });

    $(".portfolio_items").isotope({
      itemSelector: ".single_item",
      layoutMode: "fitRows",
    });
  });

  /*=========================================================================
    Initialize smoothscroll plugin
=========================================================================*/
  smoothScroll.init({
    offset: 60,
  });

  /*=========================================================================
    Products Carousel
=========================================================================*/
  $("#products_carousel").owlCarousel({
    loop: true,
    autoplay: true,
    smartSpeed: 500,
    margin: 15,
    nav: true,
    navText: [
      '<i class="arrow_carrot-left"></i>',
      '<i class="arrow_carrot-right"></i>',
    ],
    dots: false,
    responsive: {
      0: {
        items: 1,
        margin: 10,
      },
      640: {
        items: 1,
        margin: 15,
      },
      768: {
        items: 2,
        margin: 20,
      },
      1024: {
        items: 3,
        margin: 25,
      },
      1280: {
        items: 4,
        margin: 30,
      },
    },
  });

  /*=========================================================================
    Active Nice Select
=========================================================================*/
  $("select:not(#app_barbers, #app_services)").niceSelect();

  /*=========================================================================
    Active venobox
=========================================================================*/
  $(".img_popup").venobox({
    numeratio: true,
    infinigall: true,
  });

  /*=========================================================================
	WOW Active
=========================================================================*/
  new WOW().init();
})(jQuery);
