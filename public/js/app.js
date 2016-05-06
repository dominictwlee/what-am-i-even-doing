//Nav and search variables
var $selectThingsToDo = $("#things-to-do");
var $location = $("#location");

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

// clear location on click
$location.click(function() {
    $(this).val('')
  })

// keep track of what slection is made
$selectThingsToDo.change(function(){
  var id = $(this).find("option:selected").attr("id");
  var locationInput = $location.val();

  switch (id){
    case "what":
      $mainContent.empty();
      $location.val('');
    break;
    case "pizza":
      searchStuff(locationInput, "pizza");
    break;
    case "climb":
      searchStuff(locationInput, "rock climbing");
    break;
    case "play":
      searchStuff(locationInput, "theatre");
    break;
    case "music":
      searchStuff(locationInput, "concert");
    break;
  }
});


function Activity(options) {
  this.title = options.title;
  this.address = options.address;
  this.phone = options.phone;
  this.rating = options.rating;
  this.image = options.image;
  this.link = options.link;
}

// Activity Search
function searchStuff(queryLocation, queryTerm) {
  $mainContent.empty();
  // $.get('/api/search/?' + query).then(function (data) {
  // console.log('got data', data);
  // })
  // var queryLocation = "washington dc";
  var query = $.param({
      term: queryTerm,
      location: queryLocation
    });
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
