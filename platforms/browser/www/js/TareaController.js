var jTask = function () {
  return {

      Init : function(tableroId,proyectoId){

        var $this = this;
        this.tablero             = tableroId;
        this.proyecto            = proyectoId;
        this.click_init();
      },

      event_click: function(taskId){
          var $this = this;
         $('#btnAddDocumento').on('click',function(){

           myApp.modal({
                title:  'Agregar una documento',
                text: 'Carga un documento anexo a la tarea',
                afterText: '<div class="form-group">'+
                                '<input type="file" class="form-control" id="file">'+
                            '</div>',
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

         $('#btnComment').on('click',function(){
          if($('#inptComment').val() == ""){
            myApp.alert('Escribe un comentario antes de enviar','Error');
          }else{
            $this.addComment(taskId);
          }
          
         });
             

      }, 
      click_init: function () {
        var $this = this;
         $('#btnAddtarea').on('click',function(){

            myApp.pickerModal('.picker-task');
          
              var issues = [
                { name: "JoseKu", content: "Jose Luis Ku"},
                { name: "DanielPuc", content: "Daniel Puc"},
                { name: "JorgeChora", content: "Jorge Chora"},
                { name: "WendyJarillo", content: "Wendy Ruby"},
              ];

              $('#inptTaskDescription').atwho({
                 at: "@",
                 displayTpl: '<li>${name} <small>${content}</small></li>',
                 data: issues
              })



         });


         $('#btnSaveTask').on('click',function(){


            if($('#inptTaskName').val() == ""){
               myApp.alert("Introduce el nombre de la tarea",'Error');
            }else if($('#inptTaskDescription').val() == ""){
              myApp.alert("Introduce la descripción de la tarea",'Error');
            }else{
              $this.addTask();
            }
          
            
         });

         
         

        


      },
      addTask: function(){
        var $this = this;
        var token = window.localStorage.user_token;
        
        $$.ajax({
            url     : 'http://35.211.157.80/appmanager/api/task/store',
            method  : 'POST',
            dataType: 'json',
            headers  : {"Authorization": "Bearer " + token,
                        "Accept": "application/json ",
                        "Content-Type": "application/x-www-form-urlencoded",},
            data:{
                  'TARE_PROYECTO'   : $this.proyecto,
                  'TARE_TABLERO'    : $this.tablero,
                  'TARE_NOMBRE'     : $('#inptTaskName').val(),
                  'TARE_DESCRIPCION': $('#inptTaskDescription').val(), 
                  },
            success: function(response){
                   if(response.success == true){
                      myApp.alert(response.data.message,'Corecto');
                      myApp.closeModal('.picker-task');
                      $('#inptTaskName').val() = "";
                      $('#inptTaskDescription').val() = "";
                      jTask.list_task('taskList',$this.tablero);
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
      list_task: function(DomElement,tableroId){

        var $this = this;
        var token = window.localStorage.user_token;

        $$.ajax({
            url     : 'http://35.211.157.80/appmanager/api/task/index',
            method  : 'POST',
            dataType: 'json',
            headers : {"Authorization": "Bearer " + token,
                       "Accept"       : "application/json ",
                       "Content-Type" : "application/x-www-form-urlencoded",},
            data    : {'TARE_TABLERO' : tableroId},
            success : function(response){
              var html = "";
              $.each(response.data.tasks, function( index, value ) {
               
               html+='<li class="list-group-item">';
               html+='   <a href="tareaDetail.html?taskId='+value.TARE_TAREA+'" class="media item-content">';
               html+='        <div class="media-body">';
               html+='            <h5>'+value.TARE_NOMBRE+'</h5>';
               html+='            <p>Fecha de inicio: '+value.TARE_CREATED_AT+'</p>';
               html+='            <p class="text-danger "> Pendiente </p>';
               html+='         </div>';
               html+='   </a>';
               html+='   <div class="sortable-handler"></div>';
               html+='</li>';
              
                

              });

              $('#'+DomElement).html(html);

            },
            error: function(xhr, status){
              //alert('Error: '+JSON.stringify(xhr));
              //alert('ErrorStatus: '+JSON.stringify(status));
            }
          }); 

      },
      taskGetDetail:function (taskId){

        var $this = this;
        var token = window.localStorage.user_token;
        SpinnerPlugin.activityStart("Cargando...");
        $$.ajax({
            url     : 'http://35.211.157.80/appmanager/api/task/show',
            method  : 'POST',
            dataType: 'json',
            headers  : {"Authorization": "Bearer " + token,
                        "Accept"       : "application/json ",
                        "Content-Type" : "application/x-www-form-urlencoded",},
            data:{
                        'TARE_TAREA'   : taskId,
                  },
            success: function(response){
                   console.log(response);

                   $("#labelTaskName").html(response.data.task.TARE_NOMBRE);
                   $("#labelTaskDate").html(response.data.task.TARE_CREATED_AT);
                   $("#taskDetail").html(response.data.task.TARE_DESCRIPCION);
                   
                   SpinnerPlugin.activityStop();
           
            },
            error: function(xhr, status){

            }
          });   

      },
      addComment: function(taskId){
          var $this = this;
          var token = window.localStorage.user_token;
          var user_id = window.localStorage.user_id;
          
          $$.ajax({
              url     : 'http://35.211.157.80/appmanager/api/comment/store',
              method  : 'POST',
              dataType: 'json',
              headers  : {"Authorization": "Bearer " + token,
                          "Accept": "application/json ",
                          "Content-Type": "application/x-www-form-urlencoded",},
              data:{
                    'COME_TAREA'  : taskId,
                    'COME_USUARIO': user_id,
                    'COME_TEXTO'  : $('#inptComment').val(),
 
                    },
              success: function(response){
                     if(response.success == true){
                        $('#inptComment').val('');
                        jTask.list_comments('comentList',taskId);
                        //myApp.alert(response.data.message,'Corecto');

                        
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
      list_comments: function(DomElement,taskId){
        var $this = this;
        var token = window.localStorage.user_token;

          $$.ajax({
              url     : 'http://35.211.157.80/appmanager/api/comment/index',
              method  : 'POST',
              dataType: 'json',
              headers : {"Authorization": "Bearer " + token,
                         "Accept"       : "application/json ",
                         "Content-Type" : "application/x-www-form-urlencoded",},
              data    : {'COME_TAREA' : taskId},
              success : function(response){
                var html = "";
                $.each(response.data.comments, function( index, value ) {
                 
                 html+=' <li class="list-group-item">';
                 html+='    <a href="#" class="media">';
                 html+='        <div class="w-auto h-100">';
                 html+='             <figure class="avatar avatar-40"><img src="img/user4.png" alt=""> </figure>';
                 html+='        </div>';
                 html+='         <div class="media-body">';
                 html+='          <h5>'+value.name+' </h5>';
                 html+='           <p>'+value.COME_TEXTO+'</p>';
                 html+='         </div>';
                 html+='    </a>';
                 html+='</li>';
                
                
                  

                });

                $('#'+DomElement).html(html);

              },
              error: function(xhr, status){
                //alert('Error: '+JSON.stringify(xhr));
                //alert('ErrorStatus: '+JSON.stringify(status));
              }
            }); 
      },



  }
}();