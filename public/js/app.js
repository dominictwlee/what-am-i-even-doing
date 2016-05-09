//Nav and search variables
var $selectThingsToDo = $("#things-to-do");
var $location = $("#location");

// Layout variables
var $mainContent = $("#main");

//Handlebars Template variables
var source = $("#activities-template").html();
var template = Handlebars.compile(source);

// Variable for CRUD
var Message_MAC = new ParseObjectType('Message_MAC');

// Format phone number
function formatNumber(phoneNumber) {
  phoneNumber = phoneNumber || "";
  return phoneNumber.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
}

// clear location on click
$location.click(function() {
    $(this).val('')
  })

// keep track of what slection is made
$selectThingsToDo.change(function(){
  var searchTerm = $(this).find('option:selected').attr('value');
  var locationInput = $location.val();
  searchStuff(locationInput, searchTerm);
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
  // if location input is empty, show an error
  if ($location.val() == '') {
    alert("Please add a location.");
  // else run specificed search
  } else {
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
        var phoneNumber = activityData[i].phone;
        var formattedPhoneNumber = formatNumber(phoneNumber);

        var activity = new Activity({
          title: activityData[i].name,
          address: activityData[i].location.address[0],
          phone: formattedPhoneNumber,
          rating: activityData[i].rating,
          image: activityData[i].image_url,
          link: activityData[i].url
        });

        $mainContent.append(template(activity));
      }
      // Commenting
      var $commentLink = $(".comment");
      var $form = $("form");
      $commentLink.on('click', function (e) {
        e.preventDefault();
        var $activity = $(this).closest(".activity");
        var $messageText = $activity.find(".message");
        $activity.find($form).toggleClass("hidden");
        $messageText.focus();

      })
      $form.submit(function (e) {
        e.preventDefault();
        var $activity = $(this).closest(".activity");
        var $messageText = $activity.find(".message");
        var comment = $activity.find($messageText).val();
        $activity.find(".comment-list ul").append("<li>" + comment + "<a href='#' class='delete'>Delete</a><a href='#' class='update'>Update</a></li>");
        $activity.find($messageText).val('');

      })
  },
  error: function () {
    alert("Can't load because of error.");
  }
  })
}
}
