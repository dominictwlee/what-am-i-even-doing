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

// Variable for CRUD
var Comment_MAC = new ParseObjectType('Comment_MAC');

// Format phone number
function formatNumber(phoneNumber) {
  phoneNumber = phoneNumber || "";
  return phoneNumber.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
}

// Reload page on click of logo
$logo.on('click', function() {
  location.reload(true);
})

// clear location on click
$location.click(function() {
    $(this).val('')
  })

// keep track of what slection is made
$selectThingsToDo.change(function(){
  var searchTerm = $(this).find('option:selected').attr('value');
  var locationInput = $location.val();
  searchStuff(locationInput, searchTerm);
  // change heading text on selection
  var selectedText = $(this).find('option:selected').text();
  $landingPageContainer.html("<h2 class='landing-page'>" + selectedText + "</h2>");
});

// activity constructor
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
  // if location input is empty, show an error
  if ($location.val() == '') {
    alert("Please add a location.");
  // else run specificed search
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
      for (i = 0; i < activityData.length; i++) {
        var phoneNumber = activityData[i].phone;
        var formattedPhoneNumber = formatNumber(phoneNumber);
        console.log(activityData[i])
        var activity = new Activity({
          title: activityData[i].name,
          id: activityData[i].id,
          address: activityData[i].location.address[0],
          phone: formattedPhoneNumber,
          rating: activityData[i].rating,
          image: activityData[i].image_url,
          link: activityData[i].url,
        });

        $mainContent.append(template(activity));
        var businessId = Activity.id;
        // get comments where id is activitityData[i].id
        // Comment_MAC.where({id:"pier-six-concert-pavilion-baltimore"}, function(err, results){
        //   console.log(results)
        // })

        // Comment_MAC.get(objectId, businessId, function(err, comment) {
        //     // check for error
        //     console.log(comment);
        // });
        // for each comment
        // append to the templated activity
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
        var id = $activity.find("[name='yelp-id']").val();
        $activity.find(".comment-list ul").append("<li>" + comment + "<a href='#' class='delete'>Delete</a><a href='#' class='update'>Update</a></li>");
        $activity.find($messageText).val('');

        var commentData = {text: comment, id: id}
        Comment_MAC.create(commentData, function(err, result) {
        // if an error exists, read it in the console
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
      })
    })

    // Need Help with this

    // Comment_MAC.getAll(function(err, allComments) {
    //    // check for error
    //    console.log(allComments);
    // });
    // Comment_MAC.update(objectId, { text: comment }, function(err, result) {
    //       // check for the error
    //
    //       console.log(result); // { updatedAt: 'some date string' }
    // });
    // Comment_MAC.remove(objectId, function(err){
    //     // check for err
    // })
  },
  error: function () {
    alert("Can't load because of error.");
  }
  })
}
}


Comment_MAC.where({id:"pier-six-concert-pavilion-baltimore"}, function(err, results){
  console.log(results)
})
