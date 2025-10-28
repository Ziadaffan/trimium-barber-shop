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

  $(document).ready(function () {
    getBarbers();
    getServices();
  });

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
      })
      .fail(function (error) {
        console.log("Erreur chargement horaires disponibles:", error);
      });
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
    // Add isotope click function
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
