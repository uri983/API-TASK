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

        $$.ajax({
            url     : 'http://35.211.157.80/appmanager/api/project/index',
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
                html+= '<a href="projectDetail.html?projectId='+ value.PROY_PROYECTO +'">';
                html+= '                        <div class="card">';                        
                html+= '                            <div class="card-body">';
                html+= '                                <a href="projectDetail.html?projectId='+ value.PROY_PROYECTO +'" class="media">';
                html+= '                                    <div class="media-body">';
                html+= '                                        <h5>'+value.PROY_NOMBRE+' </h5>';
                html+= '                                        <p> Desde: '+value.PROY_FECHA_INICIO+'</p>';
                html+= '                                    </div>';
                html+= '                                    <div class="w-auto h-100">';
                html+= '                                        <span class="text-danger">En proceso</span>';
                html+= '                                    </div>'
                html+= '                                </a>';
                html+= '                            </div>';
               // html+= '                            <div class="card-footer">';
               // html+= '                                <div class="row">';
                //html+= '                                    <div class="col">';
                //html+= '                                        <i class="material-icons text-warning">star</i>';
                //html+= '                                        <span class="post-seconds">4.9 <span>(2)</span></span>';
               // html+= '                                    </div>';
               // html+= '                                    <div class="col">';
                //html+= '                                        <i class="material-icons text-grey">schedule</i>';
               // html+= '                                        <span class="post-seconds">254 <span>hrs</span></span>';
                //html+= '                                    </div>';
                //html+= '                                    <div class="col">';
                //html+= '                                        <i class="material-icons text-grey">monetization_on</i>';
                //html+= '                                        <span class="post-seconds">4000 <span>$</span></span>';
                //html+= '                                    </div>';
                //html+= '                                </div>';
               // html+= '                            </div>';                           
                html+= '                        </div>';
                html+= '                    </a>';

              });

              $('#'+DomElement).html(html);

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
            url     : 'http://35.211.157.80/appmanager/api/project/store',
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
            url     : 'http://35.211.157.80/appmanager/api/project/show',
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
                   SpinnerPlugin.activityStop();
           
            },
            error: function(xhr, status){
              
              //alert('Error: '+JSON.stringify(xhr));
              //alert('ErrorStatus: '+JSON.stringify(status));
            }
          });    

      }



  }
}();