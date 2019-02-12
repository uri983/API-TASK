// Initialize app
var myApp = new Framework7({swipeBackPage:false,
  swipePanel:false,
  fastClicks: false,
  pushState    : true,
  
});


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
    animateNavBackIcon: true,
    domCache: true
});



// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    jLogin.Init();
    jProyecto.Init();
});

document.addEventListener("backbutton", function(e){
            e.preventDefault();
 
            /* Si los menús laterales están abiertos */
            if ($$('.panel.active').length > 0) {
                myApp.closePanel();
                return;
            }
           
            /* Si hay un historial  */
            var view = myApp.getCurrentView();
            console.log(view);
            if (!view) return;
            if (view.history.length > 1) {
                view.router.back();
                return;
            }
            /* Si no se cumple nada de lo anterior, Cerramos App */
            myApp.confirm('¿Quiere salir de la aplicación?', 'Atención!', function () {
                navigator.app.exitApp();
            });
}, false);


myApp.onPageInit('index', function (page) {
   
   jProyecto.list_proyect('indexProjectList');

}).trigger();


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('projectDetail', function (page) {
   
   let projectId = page.query.projectId;
   jProyecto.projectGetDetail(projectId);
   jTablero.Init(projectId);
   jTablero.listTablero('TablerosList',projectId);
   

})


myApp.onPageInit('Addproject', function (page) {
   
    jProyecto.Init();
})

myApp.onPageInit('tareas', function (page) {

   let tableroId  = page.query.tableroId;
   let proyectoId = page.query.proyectoId;
   jTask.Init(tableroId,proyectoId);
   myApp.sortableOpen('.sortable');
   jTablero.tableroGetDetail(tableroId);
   jTask.list_task('taskList',tableroId);
})

myApp.onPageInit('tareaDetail', function (page) {
   
   let taskId = page.query.taskId;
   jTask.taskGetDetail(taskId);
   jTask.event_click(taskId);
   jTask.list_comments('comentList',taskId);



  var span = $('<span>').css('display','inline-block').css('word-break','break-all').appendTo('body').css('visibility','hidden');

  $('textarea').on({
        input: function(){
          var text = $(this).val();      
          span.text(text);      
          $(this).height(text ? span.height() : '1.1em');
        },
        focus: function(){
                span.text($(this).text())
                .width($(this).width())      
                .css('font',$(this).css('font'));
        },
        keypress: function(e){
            if(e.which == 13) e.preventDefault();
        }
  });






   /*$('#comentList').comments({
      profilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png',
      getComments: function(success, error) {
          var commentsArray = [{
              id: 1,
              created: '2015-10-01',
              textareaPlaceholderText:'Agrega un comentario',
              enableEditing: false,
              enableUpvoting: false,
              content: 'Lorem ipsum dolort sit amet',
              fullname: 'Simon Powell',
              upvote_count: 2,
              user_has_upvoted: false
          }];
          success(commentsArray);
      }
  });*/
})



// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"

    var page = e.detail.page;
    var navbar = page.navbarInnerContainer;
    $('#navmenu').html(navbar);

    //myApp.showNavbar(navbar, true);
})





