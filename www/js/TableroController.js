var jTablero = function () {
  return {

      Init : function(projectId){

        var $this = this;
        this.user                = $("#lgnUser"); 
        this.password            = $("#lgnPassword");
        this.btn_add_tablero     = $("#btnAddTablero");
        this.proyecto            = projectId;
        this.click_init();
      
     
      }, 
      click_init: function () {
        var $this = this;
        $("#btnAddTablero").on('click',function(){
           myApp.modal({
              title:  'Agregar un tablero',
              text: 'Añade un nombre a tu tablero',
              afterText: '<input type="text" id="inptTableroName" class="form-control" >',
              buttons: [
                {
                  text: 'Cancelar'
                },
                {
                  text: 'Añadir',
                  bold: true,
                  onClick: function () {
                    
                    $this.addTablero();
                  }
                },
              ]
            });
            
        });
      },
      addTablero: function(){
        var $this = this;
        var token = window.localStorage.user_token;
        
        $$.ajax({
            url     : 'http://35.211.157.80/appmanager/api/board/store',
            method  : 'POST',
            dataType: 'json',
            headers  : {"Authorization": "Bearer " + token,
                        "Accept": "application/json ",
                        "Content-Type": "application/x-www-form-urlencoded",},
            data:{
                  'TABL_PROYECTO'     : $this.proyecto,
                  'TABL_NOMBRE'       : $('#inptTableroName').val(),
                  'TABL_DESCRIPCION'  : ''
                  },
            success: function(response){
                   if(response.success == true){
                      myApp.alert(response.data.message,'Corecto');
                      jTablero.listTablero('TablerosList',$this.proyecto);
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
      listTablero: function(DomElement,idProject){
        var $this = this;
        var token = window.localStorage.user_token;

        $$.ajax({
            url     : 'http://35.211.157.80/appmanager/api/board/index',
            method  : 'POST',
            dataType: 'json',
            headers : {"Authorization": "Bearer " + token,
                       "Accept"       : "application/json ",
                       "Content-Type" : "application/x-www-form-urlencoded",},
            data    : {'TABL_PROYECTO' : idProject},
            success : function(response){
              var html = "";
              $.each(response.data.boards, function( index, value ) {
               
               html+='<a href="tareas.html?tableroId='+value.TABL_TABLERO+'&proyectoID='+value.TABL_PROYECTO+'" data-view=".view-main">';
               html+='    <div class="card">';
               html+='       <div class="card-body">';
               html+='            <div class="media-body">';
               html+='                 <h5>'+value.TABL_NOMBRE+' </h5>';
               html+='            </div>';
               html+='            <div class="w-auto h-100">';
               html+='                 <span class="text-danger">En proceso</span>';
               html+='            </div>'; 
               html+='       </div>';  
               html+='     </div>';
               html+='</a>';
                

              });

              $('#'+DomElement).html(html);

            },
            error: function(xhr, status){
              //alert('Error: '+JSON.stringify(xhr));
              //alert('ErrorStatus: '+JSON.stringify(status));
            }
          }); 

      },
      tableroGetDetail:function (tableroId){

        var $this = this;
        var token = window.localStorage.user_token;
        SpinnerPlugin.activityStart("Cargando...");
        $$.ajax({
            url     : 'http://35.211.157.80/appmanager/api/board/show',
            method  : 'POST',
            dataType: 'json',
            headers  : {"Authorization": "Bearer " + token,
                        "Accept"       : "application/json ",
                        "Content-Type" : "application/x-www-form-urlencoded",},
            data:{
                        'TABL_TABLERO'   : tableroId,
                  },
            success: function(response){
                   console.log(response);
                   $("#labelBoardName").html(response.data.board.TABL_NOMBRE);
                   SpinnerPlugin.activityStop();
           
            },
            error: function(xhr, status){

            }
          });   

      },



  }
}();