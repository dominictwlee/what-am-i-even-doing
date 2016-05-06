$(document).ready(function () {
  var query = $.param({
    term: 'pizza',
    location: 'washington dc'
  });

  $.get('/api/search/?' + query).then(function (data) {
    console.log('got data', data);
  })
})
