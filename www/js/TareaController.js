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
            /*myApp.modal({
              title:  'Agregar una tarea',
              text: '',
              afterText: '<div class="form-group"><label for="inptTaskName">Nombre de la tarea</label>'+
                         '<input type="text" id="inptTaskName" name="inptTaskName" class="form-control" >'+
                         '</div>'+
                         '<div class="form-group">'+
                         '<label for="inptTaskDescription">Descripción</label>'+
                         '<textarea class="form-control" id="inptTaskDescription"  name="inptTaskDescription" rows="3"></textarea>'+
                         '</div>',
              buttons: [
                {
                  text: 'Cancelar'
                },
                {
                  text: 'Añadir',
                  bold: true,
                  onClick: function () {
                    
                    $this.addTask();
                  }
                },
              ]
            });*/
            /*$("#inptTaskDescription").smention("http://localhost/Friday%20Api%20Task/www/lib/smention/get_users.php",{
             extraParams : {"akey" : "avalue"}
            });*/


            /*$("#inptTaskDescription").mentiony({
              popoverOffset:      {
               x: 0,
               y: 0
              },
              applyInitialSize:   true,
              popover: '<div id="mentiony-popover-[ID]" style="left:0;" class="mentiony-popover"></div>',
              listItem: '<li class="mentiony-item" data-item-id="">' +
                        '<div class="row">' +
                        '<div class="pl0 col-xs-9 col-sm-9 col-md-9 col-lg-9">' +
                        '<p class="title">Company name</p>' +
                        '<p class="help-block">Addition information</p>' +
                        '</div>' +
                        '</div>' +
                        '</li>',

              onDataRequest: function (mode, keyword, onDataRequestCompleteCallback) {
                  var data = [
                      { id:1, name:'Jose Luis Ku Salazar', 'avatar':'img/user4.png', 'info':'wicho' , href: '#'},
                      { id:2, name:'Daniel Puc Aguilar', 'avatar':'img/user4.png', 'info':'labonita' , href: '#'},
                      { id:3, name:'Wendy Jarillo', 'avatar':'img/user4.png', 'info':'wendy' , href: '#'},
                      { id:3, name:'Jorge Chora', 'avatar':'img/user4.png', 'info':'chorita' , href: '#'},
                  ];
                  data = jQuery.grep(data, function( item ) {
                      return item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
                  });
                  // Call this to populate mention.
                  onDataRequestCompleteCallback.call(this, data);
              },

              });*/

              $('#inptTaskDescription').atwho({
                  at: "@",
                  data:['Peter', 'Tom', 'Anne']
              })



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