'use strict'

// API key
const API_KEY = 'H7CF2IHbEc6QIrMVwb2zfd9VI14HHGAfYax1eHEUsJ4voYuqWF2oWvByUOhERva_';

// Helpers
var imageErrorMobile = '../img/flightBoston.jpg' || 'http://via.placeholder.com/384x288';
var imageErrorPad = 'http://via.placeholder.com/720x405' || '../img/flightBoston.jpg';
var imageErrorDesktop = 'http://via.placeholder.com/360x202' || '../img/flightBoston.jpg';

var screenWidth = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var screenHeight = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

// Handle Data
// Axios to handle the API request
(function getRequest() {
  var targetDOMElement = document.getElementById('main');
  targetDOMElement.innerHTML = '';

  axios.get('https://api.zype.com/videos/?api_key=' + API_KEY)
    .then(function (response) {
      var responseArray = response.data.response;
      generateHTMLOutput(responseArray, targetDOMElement);
    })
    .catch(function (error) {
      if(error.response) {
        console.log(error.response.status);
      }
      console.log(error);
    });
})();

// Use the data that's passed to render the template
function generateHTMLOutput(responseArray, targetDOMElement) {

  responseArray.map(function(result) {

    var title = result.title;
    var responsiveThumb = 'http://via.placeholder.com/720x405';
    var thumbArray = result.thumbnails;

    // Handle custom thumbnail images depending on screen size, and the handling of the 404 image.
    for(var i = 0; i < thumbArray.length; i++) {
      if(screenWidth <= 500) {
        // console.log(screenWidth + ' mobile ' + thumbArray[2].url);
        responsiveThumb = (thumbArray[2].url === "https://i.ytimg.com/vi/jhz862KOstA/hqdefault.jpg") ? imageErrorMobile : thumbArray[2].url;
      }
      if(screenWidth > 500 && screenWidth < 990) {
        // console.log(screenWidth + ' ipad ' + thumbArray[3].url);
        responsiveThumb = (thumbArray[3].url === "https://i.ytimg.com/vi/jhz862KOstA/sddefault.jpg") ? imageErrorPad : thumbArray[3].url;
      }
      if(screenWidth >= 990) {
        // console.log(screenWidth + ' desktop ' + thumbArray[4].url);
        responsiveThumb = (thumbArray[4].url === "https://i.ytimg.com/vi/jhz862KOstA/maxresdefault.jpg") ? imageErrorDesktop : thumbArray[4].url;
      }
    }

    var markupContent = '<div class="col-xs-12 col-sm-6 col-md-4">' +
                          '<div class="parallax" style="background-image: url(' + responsiveThumb + ');">' +
                              '<div class="zype-title parallax">' + title + '</div>' +
                          '</div>' +
                        '</div>';

    targetDOMElement.innerHTML += markupContent;

// Custom parallax effect start
    // helper function to detect if element is within our viewport
    function isElementInViewport(el) {
        //special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
    }

    // Parallax effect, and using requestAnimationFrame to optimize the effect, limit the repainting cause it's expensive.
    var parallax = document.querySelectorAll(".parallax"),
        speed = 0.2;

    var latestKnownScrollY = 0,
        ticking = true;

    function onScroll() {
      latestKnownScrollY = window.scrollY;
      requestTick();
    }

    function requestTick() {
      if(!ticking) {
        requestAnimationFrame(update);
      }
      ticking = false;
    }

    function update() {
      ticking = true;
      var currentScrollY = latestKnownScrollY;

      if(screenWidth <= 500) {                                        // limiting the parallax to only screen sizes 500px or below
        Array().slice.call(parallax).map(function(el) {
          var windowYOffset = window.pageYOffset,                     // The how much you've scrolled in the Y direction, may come in handy
              elementsTopHeight = el.getBoundingClientRect().top,
              elBackgrounPos = "0 " + (elementsTopHeight * speed) + "px";
          // if(isElementInViewport(el)) {                            // use this if you want the parallax effect to happen when images are in view. Also less expensive on the browser
            el.style.backgroundPosition = elBackgrounPos;
          // }
        });
      }
    }
    requestAnimationFrame(update);
    window.addEventListener('scroll', onScroll, false);
  });
}

// Use to handle the 404 (works but need to work on it)
// $(function() {
//   var url = thumbArray[i].url;
//   $.ajax(url,
//   {
//     statusCode: {
//       404: function() {
//         console.log('error found');
//       }
//     }
//   });
// });