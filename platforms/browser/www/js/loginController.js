var jLogin = function () {
  return {

      Init : function(){

        var $this = this;
        this.user                = $("#lgnUser"); 
        this.password            = $("#lgnPassword");
        this.btn_login           = $("#btnLogin");


        this.verifyLoginScreen();
        this.click_init();
      
     
      }, 
      verifyLoginScreen: function () {

        if(window.localStorage.logged == undefined ) {
           myApp.loginScreen();      
        }else{
           myApp.closeModal();
        } 
        
      },
      click_init: function () {
        var $this = this;
        $this.btn_login.on('click',function(){
            $this.login();
            //alert('Here comes About page');
        });
      },
      login: function(){
        var $this = this;
        SpinnerPlugin.activityStart("Iniciando Sesión...");
        $$.ajax({
            url     : 'http://35.208.228.187/appmanager/api/user/login',
            method  : 'POST',
            dataType: 'json',
            data:{'email':$this.user.val(),'password':$this.password.val()},
            success: function(response){
                   if(response.success == true){
                       console.log(response);
                       window.localStorage.logged        = true;
                       window.localStorage.user_mail     = $this.user.val();
                       window.localStorage.user_password = $this.password.val(); 
                       window.localStorage.user_token    = response.data.token; 
                       window.localStorage.user_id       = response.data.id;
                       window.localStorage.user_name     = response.data.name;
                       $('#userNameMenu').html(window.localStorage.user_name);
                       $('#userName').html('<small style=" font-size: 80%;" >Bienvenido<br>'+ window.localStorage.user_name +'</small>');
                       myApp.closeModal();
                       jProyecto.list_proyect('indexProjectList'); 
                   }else{
                       myApp.alert(response.data.message,'Error');
                   }
                   SpinnerPlugin.activityStop();
            },
            error: function(xhr, status){
              SpinnerPlugin.activityStop();
              //alert('Error: '+JSON.stringify(xhr));
              //alert('ErrorStatus: '+JSON.stringify(status));
            }
          });     
      }



  }
}();