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
      url: "http://localhost:3000/api/barbers",
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
      url: "http://localhost:3000/api/services",
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
      url: `http://localhost:3000/api/reservations/available-times`,
      type: "POST",
      cache: false,
      data: {
        date: date,
        barberId: $("#app_barbers").val(),
        serviceType: $("#app_services").val(),
      },
    })
      .done(function (response) {
        console.log(response);
        displayAvailableTimes(response);
      })
      .fail(function (error) {
        console.log("Erreur chargement horaires disponibles:", error);
        clearTimeOptions();
      });
  }

  function displayAvailableTimes(availableTimes) {
    const timeOptionsContainer = $("#time-options");

    if (timeOptionsContainer.length === 0) {
      console.log("Time selector not found on this page");
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
        '<div class="time-option" style="padding: 10px; text-align: center; color: #999;">Aucun horaire disponible</div>'
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
	Sticky Header
=========================================================================*/
  $("#header").after('<div class="header-height"></div>');
  function headerHeight() {
    var height = $("#header").height();
    $(".header-height").css("height", height + "px");
  }
  $(function () {
    var header = $("#header"),
      yOffset = 0,
      triggerPoint = 80;
    headerHeight();
    $(window).resize(headerHeight);
    $(window).on("scroll", function () {
      yOffset = $(window).scrollTop();

      if (yOffset >= triggerPoint) {
        header.addClass("navbar-fixed-top animated slideInDown");
      } else {
        header.removeClass("navbar-fixed-top animated slideInDown");
      }
    });
  });

  /*=========================================================================
    Mobile Menu
=========================================================================*/
  $(".menu-wrap ul.nav").slicknav({
    prependTo: ".header-section .navbar",
    label: "",
    allowParentLinks: true,
  });

  /*=========================================================================
        Vdeo Background
=========================================================================*/
  $(".video_bg").YTPlayer();

  /*=========================================================================
    Main Slider
=========================================================================*/
  $("#main-slider").owlCarousel({
    loop: true,
    autoplay: true,
    smartSpeed: 500,
    items: 1,
    nav: true,
    navText: [
      '<i class="arrow_carrot-left"></i>',
      '<i class="arrow_carrot-right"></i>',
    ],
  });

  $("#main-slider").on("translate.owl.carousel", function () {
    $(".main_slide .slider_content h3")
      .removeClass("animated fadeInUp")
      .css("opacity", "0");
    $(".main_slide .slider_content h1")
      .removeClass("animated fadeInUp")
      .css("opacity", "0");
    $(".main_slide .slider_content p, .main_slide .slider_content .default_btn")
      .removeClass("animated fadeInUp")
      .css("opacity", "0");
  });

  $("#main-slider").on("translated.owl.carousel", function () {
    $(".main_slide .slider_content h3")
      .addClass("animated fadeInUp")
      .css("opacity", "1");
    $(".main_slide .slider_content h1")
      .addClass("animated fadeInUp")
      .css("opacity", "1");
    $(".main_slide .slider_content p, .main_slide .slider_content .default_btn")
      .addClass("animated fadeInUp")
      .css("opacity", "1");
  });

  /*=========================================================================
    Gallery Slider
=========================================================================*/
  $("#gallery-slide").owlCarousel({
    loop: true,
    autoplay: true,
    smartSpeed: 500,
    items: 1,
    dots: false,
    nav: true,
    navText: [
      '<i class="arrow_carrot-left"></i>',
      '<i class="arrow_carrot-right"></i>',
    ],
  });

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
    Testimonial Carousel
=========================================================================*/
  $("#testimonial_carousel").owlCarousel({
    loop: true,
    autoplay: true,
    smartSpeed: 500,
    items: 1,
    nav: false,
  });

  /*=========================================================================
    Products Carousel
=========================================================================*/
  $("#products_carousel").owlCarousel({
    loop: true,
    autoplay: true,
    smartSpeed: 500,
    margin: 30,
    nav: true,
    navText: [
      '<i class="arrow_carrot-left"></i>',
      '<i class="arrow_carrot-right"></i>',
    ],
    dots: false,
    responsive: {
      0: {
        items: 1,
      },
      480: {
        items: 2,
      },
      768: {
        items: 3,
      },
      1024: {
        items: 4,
      },
    },
  });

  /*=========================================================================
    Active Nice Select
=========================================================================*/
  $("select:not(#app_barbers, #app_services)").niceSelect();

  /*=========================================================================
    Food Carousel
=========================================================================*/
  $("#food_carousel").imagesLoaded(function () {
    $("#food_carousel").owlCarousel({
      loop: true,
      margin: 10,
      autoplay: true,
      smartSpeed: 500,
      nav: false,
      dots: false,
      responsive: true,
      responsive: {
        0: {
          items: 1,
        },
        480: {
          items: 3,
        },
        768: {
          items: 4,
        },
      },
    });
  });

  /*=========================================================================
    Sponsor Carousel
=========================================================================*/
  $("#sponsor_carousel").imagesLoaded(function () {
    $("#sponsor_carousel").owlCarousel({
      loop: true,
      margin: 10,
      autoplay: true,
      smartSpeed: 500,
      nav: false,
      dots: false,
      responsive: true,
      responsive: {
        0: {
          items: 2,
        },
        480: {
          items: 3,
        },
        768: {
          items: 6,
        },
      },
    });
  });

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
  /*=========================================================================
    Scroll To Top
=========================================================================*/
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 100) {
      $("#scroll-to-top").fadeIn();
    } else {
      $("#scroll-to-top").fadeOut();
    }
  });

  /*=========================================================================
    MAILCHIMP
=========================================================================*/

  if ($(".subscribe_form").length > 0) {
    /*  MAILCHIMP  */
    $(".subscribe_form").ajaxChimp({
      language: "es",
      callback: mailchimpCallback,
      url: "//alexatheme.us14.list-manage.com/subscribe/post?u=48e55a88ece7641124b31a029&amp;id=361ec5b369",
    });
  }

  function mailchimpCallback(resp) {
    if (resp.result === "success") {
      $("#subscribe-result").addClass("subs-result");
      $(".subscription-success").text(resp.msg).fadeIn();
      $(".subscription-error").fadeOut();
    } else if (resp.result === "error") {
      $("#subscribe-result").addClass("subs-result");
      $(".subscription-error").text(resp.msg).fadeIn();
    }
  }
  $.ajaxChimp.translations.es = {
    submit: "Submitting...",
    0: "We have sent you a confirmation email",
    1: "Please enter your email",
    2: "An email address must contain a single @",
    3: "The domain portion of the email address is invalid (the portion after the @: )",
    4: "The username portion of the email address is invalid (the portion before the @: )",
    5: "This email address looks fake or invalid. Please enter a real email address",
  };
})(jQuery);
