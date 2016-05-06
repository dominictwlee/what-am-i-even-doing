//Nav and search variables
var $dropdownButton = $(".dropdown-button");
var $dropdownMenu = $(".dropdown-menu");
var $nav = $("nav");
var $navItems = $("nav ul ul li");
var $searchButton = $("#search a");
var $search = $("#search");
var $searchBox = $("#search-box");
var $eat = $("#eat");
var $initialValue = $("#initial-value span");
var queryTerm = "pizza";
var queryLocation = "washington dc"
var query = $.param({
    term: queryTerm,
    location: queryLocation
  });

// Layout variables
var $mainContent = $("#main");
var $phoneNumber = $('.phone');

//Handlebars Template variables
var source = $("#activities-template").html();
var template = Handlebars.compile(source);

// Format phone number
// function formatNumber(){
// $phoneNumber.text(function(i, text) {
//         text = text.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "$1-$2-$3");
//         return text;
//     });
// }

$dropdownButton.hover(function () {
  $dropdownMenu.addClass("open");
});

$dropdownButton.click(function(){
  switch ($initialValue.text()) {
    case 'Eat Pizza':
      searchEat();
      break;
  }
})

function Activity(options) {
  this.title = options.title;
  this.address = options.address;
  this.phone = options.phone;
  this.rating = options.rating;
  this.image = options.image;
  this.link = options.link;
}

$eat.click(function() {
  $dropdownMenu.removeClass("open");
  $initialValue.text("Eat Pizza");
})

// Food Search
function searchEat() {
  $mainContent.empty();
  // $.get('/api/search/?' + query).then(function (data) {
  // console.log('got data', data);
  // })
  var url = '/api/search/?' + query;
$.ajax({
  url: url,
  success: function(response){
      var activityData = response.businesses
      for (i = 0; i < activityData.length; i++) {
        var activity = new Activity({
          title: activityData[i].name,
          address: activityData[i].location.address[0],
          phone: activityData[i].phone,
          rating: activityData[i].rating,
          image: activityData[i].image_url,
          link: activityData[i].url
        });
        // formatNumber();
        $mainContent.append(template(activity));
      }
  },
  error: function () {
    alert("Can't load because of error.");
  }
  })
}

// $(document).ready(function () {
//   var query = $.param({
//     term: 'pizza',
//     location: 'washington dc'
//   });
//
// })
