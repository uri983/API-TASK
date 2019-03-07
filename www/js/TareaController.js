var jTask = function () {
  return {

      Init : function(tableroId,proyectoId){

        var $this = this;
        this.tablero             = tableroId;
        this.proyecto            = proyectoId;
        this.click_init(tableroId,proyectoId);

      },

      event_click: function(taskId){
          var $this = this;
         $('#btnAddDocumento').on('click',function(){

           myApp.modal({
                title:  'Agregar una documento',
                text: 'Carga un documento anexo a la tarea',
                afterText: '<form id="docForm"  enctype="multipart/form-data"><div class="form-group">'+
                                '<input type="file" class="form-control" id="file_task">'+
                            '</div></form>',
                buttons: [
                  {
                    text: 'Cancelar'
                  },
                  {
                    text: 'Añadir',
                    bold: true,
                    onClick: function () {
                    $this.addDocument(taskId);  
                      
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
      click_init: function (tableroId,proyectoId) {
        var $this = this;

         $('#btnAddtarea').on('click',function(){

            var token = window.localStorage.user_token;

            $$.ajax({
                url     : 'http://35.211.157.80/appmanager/api/projectmember/index',
                method  : 'POST',
                dataType: 'json',
                headers : {"Authorization": "Bearer " + token,
                           "Accept"       : "application/json ",
                           "Content-Type" : "application/x-www-form-urlencoded",},
                data    :{
                           'NUM_PROYECTO'        : proyectoId,
                         },
                success : function(response){
                  var issues = [
                  ];


                 $.each(response.data.members, function( index, value ) {
                   issues.push({ "name": value.alias.replace('@',''), "content": value.name}); 
                 });
                 

                  myApp.pickerModal('.picker-task');
                  console.log(issues);
                  
                  $('#inptTaskDescription').atwho({
                     at: "@",
                     displayTpl: '<li>${name} <small>${content}</small></li>',
                     data: issues
                  })

                  
                },
                error: function(xhr, status){
                  //alert('Error: '+JSON.stringify(xhr));
                  //alert('ErrorStatus: '+JSON.stringify(status));
                }
              });

                


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
                      $('#inptTaskName').val("");
                      $('#inptTaskDescription').val("");
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
               html+= '       <div class="w-auto options-toogle"> '; 
               html+= '         <small class="text-primary effort-time" onclick="jTask.taskOption('+value.TARE_TAREA+','+value.TARE_TABLERO+');"><i class="f7-icons">more_vertical_fill</i></small>';               
               html+= '       </div>';
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
      taskOption:function(taskId,tableroId){
          var $this   = this;
          var buttons = [
                {
                    text: 'Eliminar',
                    bold: true,
                    onClick: function () {
                           myApp.modal({
                                title:  '¿Deseas eliminar esta tarea?',
                                text:   '',
                                buttons: [
                                  {
                                    text: 'Cancelar'
                                  },
                                  {
                                    text: 'Eliminar',
                                    bold: true,
                                    onClick: function () {
                                      
                                      $this.deleteTask(taskId,tableroId);
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
      deleteTask:function(taskId,tableroId){

        var $this = this;
        var token = window.localStorage.user_token;
        
        $$.ajax({
            url     : 'http://35.211.157.80/appmanager/api/task/destroy',
            method  : 'POST',
            dataType: 'json',
            headers  : {"Authorization" : "Bearer " + token,
                        "Accept"        : "application/json ",
                        "Content-Type"  : "application/x-www-form-urlencoded",},
            data:{
                        'TARE_TAREA'       : taskId,
                  },
            success: function(response){
                   if(response.success == true){
                      //myApp.alert(response.data.message,'Corecto');
                       jTask.list_task('taskList',tableroId);
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
      addDocument: function(taskId){

          var $this    = this;
          var token    = window.localStorage.user_token;
          var user_id  = window.localStorage.user_id;
          var form     = $('#docForm')[0];
          var formData = new FormData(form);

          var file_upload = $('#file_task');
          formData.append('FILE_TAREA', taskId);
          formData.append('FILE',   file_upload[0].files[0]);

          
          $$.ajax({
              url     : 'http://35.211.157.80/appmanager/api/file/store',
              method  : 'POST',
              dataType: 'json',
              headers  : {"Authorization": "Bearer " + token,
                          "Accept": "application/json ",
                          },
              data:formData,
              processData: false,
              contentType: false,
              cache:false,
              success: function(response){
                     if(response.success == true){

                        myApp.alert(response.data.message,'Corecto');

                        
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
                 
                 html+='<li class="list-group-item">';
                 html+='    <a href="#" class="media">';
                 html+='        <div class="w-auto h-100">';
                 html+='             <figure class="avatar avatar-40"><img src="img/user4.png" alt=""> </figure>';
                 html+='        </div>';
                 html+='         <div class="media-body">';
                 html+='          <h5>'+value.name+' </h5>';
                 html+='           <p>'+value.COME_TEXTO+'</p>';
                 html+='         </div>';
                 html+= '       <div class="w-auto "> '; 
                 html+= '         <small class="text-primary effort-time" onclick="jTask.commentOption('+value.COME_COMENTARIO+','+taskId+')"><i class="f7-icons">more_vertical_fill</i></small>';               
                 html+= '       </div>';
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
      list_documents: function(DomElement,taskId){
        var $this = this;
        var token = window.localStorage.user_token;

          $$.ajax({
              url     : 'http://35.211.157.80/appmanager/api/file/index',
              method  : 'POST',
              dataType: 'json',
              headers : {"Authorization": "Bearer " + token,
                         "Accept"       : "application/json ",
                         "Content-Type" : "application/x-www-form-urlencoded",},
              data    : {'FILE_TAREA' : taskId},
              success : function(response){
                var html = "";
                $.each(response.data.files, function( index, value ) {
                  var doc_color = "#007aff";
                  if(value.FILE_TYPE == "pdf"){
                    doc_color = "#ff3b30";
                  }else if(value.FILE_TYPE == "docx"){
                    doc_color = "#007aff";
                  }
                  else if(value.FILE_TYPE == "xlsx"){
                    doc_color = "#28a745";
                  }
                 
                   html+='<li class="list-group-item">';

                   if(value.FILE_TYPE.toLowerCase() == 'jpg' || value.FILE_TYPE.toLowerCase() == 'png' || value.FILE_TYPE.toLowerCase() == 'jpeg' ){
                    html+='    <a href="'+value.FILE_LINK+'" target="_blank" class="media">';
                   html+='       <img src="'+value.FILE_LINK+'" alt="" style="    width: 100%; height: 100%;"> '
                   html+='    </a>';
                   
                   }else{

                   html+='    <a href="'+value.FILE_LINK+'" target="_blank" class="media">';
                   html+='        <div class="w-auto h-100">';
                   html+='             <i class="f7-icons" style="color:'+doc_color+';"> document_text</i>';
                   html+='        </div>';
                   html+='         <div class="media-body">';
                   html+='          <h5>'+value.FILE_NAME+' </h5>';
                   html+='           <p>'+value.FILE_SIZE+'</p>';
                   html+='         </div>';
                   html+='    </a>';

                   }

                   

                   html+= '       <div class="w-auto   options-toogle "> '; 
                   html+= '         <small class="text-primary effort-time" onclick="jTask.commentOption('+value.FILE_ID+','+taskId+')"><i class="f7-icons">more_vertical_fill</i></small>';               
                   html+= '       </div>';
                   
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
      commentOption:function(commentId,taskId){
          var $this   = this;
          var buttons = [
                {
                    text: 'Eliminar',
                    bold: true,
                    onClick: function () {
                           myApp.modal({
                                title:  '¿Deseas eliminar este comentario?',
                                text:   '',
                                buttons: [
                                  {
                                    text: 'Cancelar'
                                  },
                                  {
                                    text: 'Eliminar',
                                    bold: true,
                                    onClick: function () {
                                      
                                      $this.deleteComment(commentId,taskId);
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
      deleteComment:function(commentId,taskId){

        var $this = this;
        var token = window.localStorage.user_token;
        
        $$.ajax({
            url     : 'http://35.211.157.80/appmanager/api/comment/destroy',
            method  : 'POST',
            dataType: 'json',
            headers  : {"Authorization" : "Bearer " + token,
                        "Accept"        : "application/json ",
                        "Content-Type"  : "application/x-www-form-urlencoded",},
            data:{
                  'COME_COMENTARIO'       : commentId,
                  },
            success: function(response){
                   if(response.success == true){
                      //myApp.alert(response.data.message,'Corecto');
                       jTask.list_comments('comentList',taskId);
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
      sortableToggle: function(){
        myApp.sortableToggle('.sortable');

        if ($('.options-toogle').is(':visible')) {
            $('.options-toogle').hide();
        } else {
            $('.options-toogle').show();
        }

      },



  }
}();