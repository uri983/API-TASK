var jUser = function () {
  return {

      Init : function(){

        var $this = this;
        this.user                = $("#lgnUser"); 
        this.password            = $("#lgnPassword");
        this.btn_login           = $("#btnLogin");


        
      
     
      }, 
      click_init: function () {
        var $this = this;

        $("#search_user").keyup(function() {
          $this.search_user("list_user", $("#search_user").val());
        });

      },
      search_user: function(DomElement,search_inpt) {

        var $this = this;
        var token = window.localStorage.user_token;

        $$.ajax({
            url     : 'http://35.211.157.80/appmanager/api/user/index',
            method  : 'POST',
            dataType: 'json',
            headers : {"Authorization": "Bearer " + token,
                       "Accept"       : "application/json ",
                       "Content-Type" : "application/x-www-form-urlencoded",},
            data    :{
                       'SEARCH'        : $('#search_user').val(),
                     },
            success : function(response){
              var html = "";
              if(response.data.users.length > 0){
                  $.each(response.data.users, function( index, value ) {

                  html+= '<a href="" class="projectCard">';
                  html+= '  <div class="card ">';                        
                  html+= '      <div class="card-body">';
                  html+= '          <a href="" class="media">';
                  html+= '               <div class="media-body">';
                  html+= '                    <h5>'+value.name+' </h5>';
                  html+= '                    <p>'+value.alias+'</p>';
                  html+= '                </div>';
                  html+= '                <div class="w-auto h-100">';
                  //html+= '                                        <span class="text-danger">En proceso</span>';
                  html+= '                </div>'
                  html+= '           </a>';
                  html+= '       </div>';                   
                  html+= '  </div>';
                  html+= '</a>';

                  });

                  $('#'+DomElement).html(html);

              }else{
                  $('#'+DomElement).html('<p>Sin coincidencia</p>');
              }
              

             

              /*$('.card-body').Longtap({
                timeout: 1000,
                onStartDelay: 250,
                onStart: (event, self) => {
  
                },
                onSuccess: (event, self) => {

                   myApp.pickerModal('.picker-options-project');
                  
                },
                onStop: (event, self) => {

                },
                onReject: (event, self) => {

                   myApp.pickerModal('.picker-options-project');

                  
                },


              });*/

            },
            error: function(xhr, status){
              //alert('Error: '+JSON.stringify(xhr));
              //alert('ErrorStatus: '+JSON.stringify(status));
            }
          });  
        
      },



  }
}();