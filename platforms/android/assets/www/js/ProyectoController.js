var jProyecto = function () {
  return {

      Init : function(){

        var $this = this;
        this.projectName           = $("#inptProjectName"); 
        this.projectDetail         = $("#inptProjectDescription");
        this.projectIni            = $("#inptProjectIniDate");
        this.projectEnd            = $("#inptProjectEndDate");
        this.btn_add_proyect       = $("#btnAddProject");
        //this.labelProjectName      = $("#labelProjectName");
        this.click_init();


      
     
      }, 
      
      click_init: function () {
        var $this = this;
        $this.btn_add_proyect.on('click',function(){
             myApp.modal({
              title:  'Agregar un proyecto',
              text: 'Añade un nombre a tu proyecto',
              afterText: '<input type="text" id="inptProjectName" class="form-control" >',
              buttons: [
                {
                  text: 'Cancelar'
                },
                {
                  text: 'Añadir',
                  bold: true,
                  onClick: function () {
                    
                    $this.addProyect();
                  }
                },
              ]
            });
        });
      },
      list_proyect: function(DomElement) {

        var $this = this;
        var token = window.localStorage.user_token;
        var userId = window.localStorage.user_id;


        $$.ajax({
            url     : 'http://35.208.228.187/appmanager/api/project/index',
            method  : 'POST',
            dataType: 'json',
            headers : {"Authorization": "Bearer " + token,
                       "Accept"       : "application/json ",
                       "Content-Type" : "application/x-www-form-urlencoded",},
            data    :{},
            success : function(response){
              var html = "";
              $.each(response.data.projects, function( index, value ) {
                //alert( index + ": " + value );
              
                html+= '<div class="card mb-3">';
                html+= '                    <div class="card-header">';
                html+= '                        <div class="row" style="width: 100%;">';
                html+= '                            <div class="col-10">';
                html+= '                                <a href="projectDetail.html?projectId='+ value.PROY_PROYECTO +'" >';
                html+= '                                   <h5 class="card-title">'+value.PROY_NOMBRE+'</h5>';
                html+= '                                </a>';
                html+= '                            </div>';
                if(userId == value.PROY_USUARIO){
                  html+= '                         <div class="w-auto options-toogle"> '; 
                  html+= '                          <small class="text-primary effort-time" onclick="jProyecto.projectOption('+ value.PROY_PROYECTO +');"><i class="f7-icons">more_vertical_fill</i></small>';               
                  html+= '                        </div>';
                }
                
                //html+= '                            <div class="col-2 text-right" style="padding-right: 0px; padding-left: 50px;">';
                //html+= '                                <a href="javascript:void(0);" onclick="jProyecto.projectOption('+ value.PROY_PROYECTO +');"  >';
                //html+= '                                <i class="f7-icons">more_vertical_fill</i>';
                //html+= '                                </a>';
                //html+= '                            </div>';
                html+= '                        </div>';
                html+= '                    </div>';
                html+= '                    <div class="card-body ">';
                html+= '                        <p class="mb-0 text-secondary f-sm">Desde: '+value.PROY_CREATED_AT+' </p>';
                html+= '                    </div>';
                html+=  ' </div>';

               
              });

              $('#'+DomElement).html(html);

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
      addProyect: function(){
        var $this = this;
        var token = window.localStorage.user_token;
        
        $$.ajax({
            url     : 'http://35.208.228.187/appmanager/api/project/store',
            method  : 'POST',
            dataType: 'json',
            headers  : {"Authorization": "Bearer " + token,
                        "Accept": "application/json ",
                        "Content-Type": "application/x-www-form-urlencoded",},
            data:{
                  'PROY_NOMBRE'       : $('#inptProjectName').val(),
                  'PROY_DESCRIPCION'  : '',
                  'PROY_FECHA_INICIO' : '',
                  'PROY_FECHA_FINAL'  : ''
                  },
            success: function(response){
                   if(response.success == true){
                      myApp.alert(response.data.message,'Corecto');
                      jProyecto.list_proyect('indexProjectList');
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
      projectGetDetail:function(projectId){

        var $this = this;
        var token = window.localStorage.user_token;
        SpinnerPlugin.activityStart("Cargando...");
        $$.ajax({
            url     : 'http://35.208.228.187/appmanager/api/project/show',
            method  : 'POST',
            dataType: 'json',
            headers  : {"Authorization": "Bearer " + token,
                        "Accept": "application/json ",
                        "Content-Type": "application/x-www-form-urlencoded",},
            data:{
                  'PROY_PROYECTO'       : projectId,
                  },
            success: function(response){
                   $("#labelProjectName").html(response.data.project.PROY_NOMBRE);
                   if(response.data.project.PROY_USUARIO == window.localStorage.user_id){
                     window.localStorage.isOwner     = 1;
                   }else{
                     window.localStorage.isOwner     = 0;
                     $('#btnAddMiembro').hide();
                     $('#btnAddTablero').hide();
                     

                   }
                   
                   SpinnerPlugin.activityStop();
           
            },
            error: function(xhr, status){
              
              //alert('Error: '+JSON.stringify(xhr));
              //alert('ErrorStatus: '+JSON.stringify(status));
            }
          });    

      },
      projectOption:function(projectId){
          var $this   = this;
          var buttons = [
                {
                    text: 'Eliminar',
                    bold: true,
                    onClick: function () {
                           myApp.modal({
                                title:  '¿Deseas eliminar este proyecto?',
                                text: 'Todos los datos del proyecto seran borrados permanentemente',
                                buttons: [
                                  {
                                    text: 'Cancelar'
                                  },
                                  {
                                    text: 'Eliminar',
                                    bold: true,
                                    onClick: function () {
                                      
                                      $this.deleteProyect(projectId);
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
      deleteProyect:function(projectId){

        var $this = this;
        var token = window.localStorage.user_token;
        
        $$.ajax({
            url     : 'http://35.208.228.187/appmanager/api/project/destroy',
            method  : 'POST',
            dataType: 'json',
            headers  : {"Authorization" : "Bearer " + token,
                        "Accept"        : "application/json ",
                        "Content-Type"  : "application/x-www-form-urlencoded",},
            data:{
                  'PROY_PROYECTO'       : projectId,
                  },
            success: function(response){
                   if(response.success == true){
                      //myApp.alert(response.data.message,'Corecto');
                      jProyecto.list_proyect('indexProjectList');
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