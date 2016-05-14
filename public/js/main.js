$(document).ready(function () {

  var files;
  $('input[type=file]').on('change', function (event) {
    files = event.target.files;
  });

  $('#file-form').on('submit', function () {
    event.stopPropagation();
    event.preventDefault();

    var data = new FormData();
    $.each(files, function (key, value) {
      data.append(key, value);
    });

    $.ajax({
      url: window.location.origin + '/analyze/',
      type: 'POST',
      data: data,
      cache: false,
      processData: false,
      contentType: false,
      error: function (jqXHR, textStatus, errorThrown) {
        alert('ERRORS: ' + textStatus);
      },
      success: function (data) {
        alert('FILE SIZE: ' + data.fileSize);
      }
    });

    return false;
  });
});