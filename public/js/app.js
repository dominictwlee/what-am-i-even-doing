//Nav and search variables
var $selectThingsToDo = $("#things-to-do");
var $location = $("#location");
var $landingPageContainer = $("#landing-page-container");
var $logo = $("#logo");

// Layout variables
var $mainContent = $("#main");

//Handlebars Template variables
var source = $("#activities-template").html();
var template = Handlebars.compile(source);

// Format phone number
function formatNumber(phoneNumber) {
  phoneNumber = phoneNumber || "";
  return phoneNumber.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
}

// Reload page on click of logo
$logo.on('click', function() {
  location.reload(true);
})

// Clear location on click
$location.click(function() {
    $(this).val('')
  })

// Keep track of what slection is made
$selectThingsToDo.change(function(){
  var searchTerm = $(this).find('option:selected').attr('value');
  var locationInput = $location.val();
  searchStuff(locationInput, searchTerm);
  // Change heading text on selection
  var selectedText = $(this).find('option:selected').text();
  $landingPageContainer.html("<h2 class='landing-page'>" + selectedText + "</h2>");
});

// Activity Constructor
function Activity(options) {
  this.title = options.title;
  this.id = options.id;
  this.address = options.address;
  this.phone = options.phone;
  this.rating = options.rating;
  this.image = options.image;
  this.link = options.link;
}

// Activity Search
function searchStuff(queryLocation, queryTerm) {
  $mainContent.empty();
  // If location input is empty, show an error
  if ($location.val() == '') {
    alert("Please add a location.");
  // Else run specificed search
  } else {
      var query = $.param({
          term: queryTerm,
          location: queryLocation
      });

      var url = '/api/search/?' + query;
      $.ajax({
        url: url,
        success: function(response){
          var activityData = response.businesses
          var activityQueryParams = [];

          for (i = 0; i < activityData.length; i++) {
            var phoneNumber = activityData[i].phone;
            var formattedPhoneNumber = formatNumber(phoneNumber);
            // console.log(activityData[i])
            var activity = new Activity({
            title: activityData[i].name,
            id: activityData[i].id,
            address: activityData[i].location.display_address[0],
            phone: formattedPhoneNumber,
            rating: activityData[i].rating,
            image: activityData[i].image_url,
            link: activityData[i].url,
            });

            activityQueryParams.push({id: activity.id});
            $mainContent.append(template(activity));
        }
      },
      error: function () {
        console.log("Can't load because of error.");
      }
    })
  }
}
