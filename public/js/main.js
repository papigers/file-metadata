$('#searchForm').submit(function(){
  window.location.href += '/search/' + $('#query').val();
  return false;
});