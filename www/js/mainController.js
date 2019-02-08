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

   let tableroId = page.query.tableroId;
   jTask.Init(tableroId);
   myApp.sortableOpen('.sortable');
   //jTablero.tableroGetDetail(tableroId);
})

myApp.onPageInit('tareaDetail', function (page) {
   
   let tableroId = page.query.tableroId;
   jTask.event_click();
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





