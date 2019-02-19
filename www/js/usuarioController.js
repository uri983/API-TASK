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

                    html+= '<li class="list-group-item">';
                    html+= '   <a href="#" class="media">';
                    html+= '       <div class="media-body">';
                    html+= '           <h5>'+value.name+'</h5>';
                    html+= '           <p>'+value.alias+'</p>';
                    html+= '       </div>';
                    html+= '       <div class="w-auto">';  
                    html+= '       <button id="btnAddTablero" style="margin: 20px 15px 20px 15px; font-size: 10px; line-height: 16px;" class="mb-2 btn btn-outline-primary open-prompt" data-toggle="modal" data-target="#addTableroModal">Añadir</button>';                
                    html+= '       </div>';
                    html+= '   </a>';
                    html+= '</li>';

                    

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