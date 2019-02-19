var jTablero = function () {
  return {

      Init : function(projectId){

        var $this = this;
        this.user                = $("#lgnUser"); 
        this.password            = $("#lgnPassword");
        this.btn_add_tablero     = $("#btnAddTablero");
        this.proyecto            = projectId;
        this.click_init();

        $("#btnAddMiembro").attr("href", "projectUsuario.html?projectId="+ $this.proyecto);
      
     
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
               
               

                html+= '<div class="card mb-3">';
                html+= '                    <div class="card-header">';
                html+= '                        <div class="row" style="width: 100%;">';
                html+= '                            <div class="col-10">';
                html+= '                                <a href="tareas.html?tableroId='+value.TABL_TABLERO+'&proyectoID='+value.TABL_PROYECTO+'" >';
                html+= '                                   <h5 class="card-title">'+value.TABL_NOMBRE+'</h5>';
                html+= '                                </a>';
                html+= '                            </div>';
                html+= '                            <div class="col-2 text-right" style="padding-right: 0px; padding-left: 50px;">';
                html+= '                                <a href="javascript:void(0);" onclick="jTablero.tableroOption('+ value.TABL_TABLERO +','+value.TABL_PROYECTO+');"  >';
                html+= '                                <i class="f7-icons">more_vertical_fill</i>';
                html+= '                                </a>';
                html+= '                            </div>';
                html+= '                        </div>';
                html+= '                    </div>';
                //html+= '                    <div class="card-body ">';
                //html+= '                        <p class="mb-0 text-secondary f-sm">Desde: '+value.PROY_CREATED_AT+' </p>';
                //html+= '                    </div>';
                html+=  ' </div>';
                

              });

              $('#'+DomElement).html(html);

            },
            error: function(xhr, status){
              //alert('Error: '+JSON.stringify(xhr));
              //alert('ErrorStatus: '+JSON.stringify(status));
            }
          }); 

      },
      tableroOption:function(tableroId,proyectoId){
          var $this   = this;
          var buttons = [
                {
                    text: 'Editar',
                    bold: true,
                    onClick: function () {
                        myApp.alert('editando');
                    }
                },
                {
                    text: 'Eliminar',
                    bold: true,
                    onClick: function () {
                           myApp.modal({
                                title:  '¿Deseas eliminar este tablero?',
                                text: 'Todos los datos del tablero seran borrados permanentemente',
                                buttons: [
                                  {
                                    text: 'Cancelar'
                                  },
                                  {
                                    text: 'Eliminar',
                                    bold: true,
                                    onClick: function () {
                                      
                                      $this.deleteProyect(tableroId,proyectoId);
                                    }
                                  },
                                ]
                          });
                            
                    }
                },
                {
                    text: 'Cancelar',
                    color: 'red'
                },
            ];
            myApp.actions(buttons);
       
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
      deleteProyect: function(tableroId,proyectoId){

        var $this = this;
        var token = window.localStorage.user_token;
        
        $$.ajax({
            url     : 'http://35.211.157.80/appmanager/api/board/destroy',
            method  : 'POST',
            dataType: 'json',
            headers  : {"Authorization" : "Bearer " + token,
                        "Accept"        : "application/json ",
                        "Content-Type"  : "application/x-www-form-urlencoded",},
            data:{
                  'TABL_TABLERO'       : tableroId,
                  },
            success: function(response){
                   if(response.success == true){
                      //myApp.alert(response.data.message,'Corecto');
                      jTablero.listTablero('TablerosList',proyectoId);
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



  }
}();