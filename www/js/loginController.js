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
            url     : 'http://192.168.1.33:8888/Friday/public/api/user/login',
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
                       myApp.closeModal();
                   }else{
                      alert(response.data.message);
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