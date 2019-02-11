var jTask = function () {
  return {

      Init : function(tableroId){

        var $this = this;
        this.tablero             = tableroId;


        
        this.click_init();
      
     
      },

      event_click: function(){

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

         $('#btnAddComentarios').on('click',function(){
             myApp.modal({
                title:  'Agregar una comentario',
                text: '',
                afterText: 
                           '<div class="form-group">'+
                           '<textarea class="form-control" id="inptProjectDescription" id="exampleFormControlTextarea1" rows="3"></textarea>'+
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

      }, 
      click_init: function () {
        var $this = this;
         $('#btnAddtarea').on('click',function(){
            myApp.modal({
              title:  'Agregar una tarea',
              text: '',
              afterText: '<div class="form-group"><label for="textinput">Nombre de proyecto</label>'+
                         '<input type="text" id="inptProjectName" class="form-control" >'+
                         '</div>'+
                         '<div class="form-group">'+
                         '<label for="exampleFormControlTextarea1">Descripción</label>'+
                         '<textarea class="form-control" id="inptProjectDescription" id="exampleFormControlTextarea1" rows="3"></textarea>'+
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
      }



  }
}();