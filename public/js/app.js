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
/**
* Add a single comment to the comments list element (on form submission)
*/
function addComment(yelpId, comment) {
  var $activity = $('#' + yelpId);
  $activity.find("ul.comment-list").append('<li id="' + comment.objectId + '">' + comment.text + "<a href='#' class='delete'>Delete</a>");

  var $delete = $activity.find('.delete');

  $delete.on('click', function(e) {
    e.preventDefault();
    removeComment($(this).closest('li'));
    // var $activity = $(this).closest(".activity");
    // var $commentToDelete = $activity.find("li");
  });
}

function removeComment($commentToRemove){
  var commentId = $commentToRemove.attr('id');
  Comment_MAC.remove(commentId, function(err, result){
    // check for err
    if (err) {
        console.log(err);
    } else {
        console.log(result);
        $commentToRemove.remove();
    }
  })
}

/**
* Initialize the comments-list element from an array of comments objects
* (when the yelp activity is first loaded)
*/
function setComments(yelpId, comments) {
  var $activity = $('#' + yelpId);
  var commentElements = comments.map(function (comment) {
    return (
      '<li id="' + comment.objectId + '">' + comment.text +
        '<a href="#" class="delete">Delete</a>' +
      '</li>'
    );
  });

  $activity.find("ul.comment-list").html(commentElements);
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
      var activityQueryParams = [];

      for (i = 0; i < activityData.length; i++) {
        var phoneNumber = activityData[i].phone;
        var formattedPhoneNumber = formatNumber(phoneNumber);
        // console.log(activityData[i])
        var activity = new Activity({
          title: activityData[i].name,
          id: activityData[i].id,
          address: activityData[i].location.address[0],
          phone: formattedPhoneNumber,
          rating: activityData[i].rating,
          image: activityData[i].image_url,
          link: activityData[i].url,
        });

        activityQueryParams.push({id: activity.id});

        $mainContent.append(template(activity));

        // get comments where id is activitityData[i].id


        // Comment_MAC.get(objectId, businessId, function(err, comment) {
        //     // check for error
        //     console.log(comment);
        // });
        // for each comment
        // append to the templated activity
      }

      /**
      * commentsById = {
      *  'earth-treks-climbing-centers-timonium-timonium': [
      *     {... text: 'my comment'},
      *     {... text: 'another comment'}
      *  ]
      * }
      */
      var commentsById = {};

      Comment_MAC.where({$or: activityQueryParams}, function(err, comments){
        if (!Array.isArray(comments)) return;

        /**
        * Iterate over comments in API response, grouping them by ID
        */
        comments.forEach(function (comment) {
          if (Array.isArray(commentsById[comment.id])) {
            commentsById[comment.id].push(comment);
          } else {
            commentsById[comment.id] = [comment];
          }
        });

        /**
        * Iterate over commentsById and append the comments
        * to their corresponding DOM elements
        */
        for (var id in commentsById) {
          var comments = commentsById[id] || [];
          setComments(id, comments);
          // comments.forEach(function (comment) {
          //   addComment(id, comment.text);
          // });
        }
        var $delete = $(".delete");
        $delete.on('click', function(e) {
          e.preventDefault();
          removeComment($(this).closest('li'));
          // var $activity = $(this).closest(".activity");
          // var $commentToDelete = $activity.find("li");
        })
      })

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
        $messageText.val('');

        var commentData = {text: comment, id: id}
        Comment_MAC.create(commentData, function(err, comment) {
        // if an error exists, read it in the console
        if (err) {
            console.log(err);
        } else {
            comment.text = commentData.text;
            comment.id = commentData.id;

            console.log(comment);
            addComment(id, comment);
        }
      })
    })
  },
  error: function () {
    alert("Can't load because of error.");
  }
  })
}
}
