$(".slider").slick({
  // dots: true,
  arrows: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  fade: true,
  asNavFor: ".navx",
});

$(".navx").slick({
  arrows: true,
  slidesToShow: 2,
  slidesToScroll: 1,
  asNavFor: ".slider",
  centerMode: true,
  focusOnSelect: true,
  prevArrow: $(".prev"),
  nextArrow: $(".next"),
});
