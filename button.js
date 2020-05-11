// Make button
topbutton = document.getElementById("topbutton");
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 1700 || document.documentElement.scrollTop > 1700) {
    topbutton.style.display = "block";
  } else {
    topbutton.style.display = "none";
  }
}

// Define what happens on click
function topFunction() {
  document.body.scrollTo({top: 0, behavior: 'smooth'}); // For Safari
  document.documentElement.scrollTo({top: 0, behavior: 'smooth'}); // For Chrome, Firefox, IE and Opera
}