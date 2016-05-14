$(document).ready(function () {

  var file;
  $('input[type=file]').on('change', function (event) {
    file = event.target.files;
  });

  $('#file-form').on('submit', function () {
    event.stopPropagation();
    event.preventDefault();

    var data = new FormData();
    $.each(file, function (key, value) {
      data.append(key, value);
    });

    $.ajax({
      url: window.location.origin + '/analyse/',
      type: 'POST',
      data: data,
      cache: false,
      processData: false,
      contentType: false,
      error: function (jqXHR, textStatus, errorThrown) {
        alert('Error: '+ textStatus);
      },
      success: function (data) {
        var json = JSON.parse(data);
        alert('File Size: ' + json.size);
      }
    });

    return false;
  });
});