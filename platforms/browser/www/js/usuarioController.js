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
      listProyectUser: function(DomElement,project){

        var $this = this;
        var token = window.localStorage.user_token;

        $$.ajax({
            url     : 'http://35.211.157.80/appmanager/api/projectmember/index',
            method  : 'POST',
            dataType: 'json',
            headers : {"Authorization": "Bearer " + token,
                       "Accept"       : "application/json ",
                       "Content-Type" : "application/x-www-form-urlencoded",},
            data    :{
                       'NUM_PROYECTO'        : project,
                     },
            success : function(response){
              var html = "";
              if(response.data.members.length > 0){
                  $.each(response.data.members, function( index, value ) {

                    html+= '<li id="userList_'+value.id+'" class="list-group-item">';
                    html+= '        <a href="javascript:void(0);" class="media">';
                    html+= '            <div class="media-body">';
                    html+= '                <h5>'+value.name+'</h5>';
                    html+= '                <p>'+value.alias+'</p>';
                    html+= '            </div>';
                    html+= '            <div class="w-auto"> ';               
                    html+= '            </div>';
                    html+= '        </a>';
                    html+= '</li>';

                  });

                  $('#'+DomElement).html(html);

              }else{
                  $('#'+DomElement).html('<p>Sin usuarios</p>');
              }
             
            },
            error: function(xhr, status){
              //alert('Error: '+JSON.stringify(xhr));
              //alert('ErrorStatus: '+JSON.stringify(status));
            }
          });

      },
      addUserProyect: function(userId){
            var  proyecto = $('#idProyectoUser').val();
            var $this = this;
            var token = window.localStorage.user_token;
        
            $$.ajax({
                url     : 'http://35.211.157.80/appmanager/api/projectmember/store',
                method  : 'POST',
                dataType: 'json',
                headers  : {"Authorization": "Bearer " + token,
                            "Accept": "application/json ",
                            "Content-Type": "application/x-www-form-urlencoded",},
                data:{
                      'USER_PROYECTO': proyecto,
                      'USER_USER'    : userId
                      },
                success: function(response){
                       if(response.success == true){
                          //myApp.alert(response.data.message,'Corecto');
                          //jProyecto.list_proyect('indexProjectList');
                          $('#userAdd_'+userId).hide();
                          jUser.listProyectUser('listUserProject',proyecto);
                       }else{
                          myApp.alert(response.data.message,'Error');
                       }
               
                },
                error: function(xhr, status){
                
                  //alert('Error: '+JSON.stringify(xhr));
                  //alert('ErrorStatus: '+JSON.stringify(status));
                }
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

                    html+= '<li id="userAdd_'+value.id+'" class="list-group-item">';
                    html+= '   <a href="#" class="media">';
                    html+= '       <div class="media-body">';
                    html+= '           <h5>'+value.name+'</h5>';
                    html+= '           <p>'+value.alias+'</p>';
                    html+= '       </div>';
                    html+= '       <div class="w-auto">';  
                    html+= '       <button id="btnAddUserProyect" onclick="jUser.addUserProyect('+value.id+');" style="margin: 20px 15px 20px 15px; font-size: 10px; line-height: 16px;" class="mb-2 btn btn-outline-primary open-prompt" data-toggle="modal" data-target="#addTableroModal">Añadir</button>';                
                    html+= '       </div>';
                    html+= '   </a>';
                    html+= '</li>';

                  });

                  $('#'+DomElement).html(html);

              }else{
                  $('#'+DomElement).html('<p>Sin coincidencia</p>');
              }
             
            },
            error: function(xhr, status){
              //alert('Error: '+JSON.stringify(xhr));
              //alert('ErrorStatus: '+JSON.stringify(status));
            }
          });  
        
      },



  }
}();