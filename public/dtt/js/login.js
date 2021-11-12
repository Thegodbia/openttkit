 //login
 if($('#login-form').length){
    $('#submit').click(async ()=>{
      
    var o = new Object();
    var form = '#login-form';
      
    var msisdn = $('#login-form .msisdn').val();
    var password = $('#login-form .password').val();
    // var phone = $('#contact-form .phone').val();
      
      if(msisdn == '' || password == '')
      {
        $('#login-form .response').html('<div class="failed" style="color:red;">Please fill the required fields.</div>');
        return false;
      }
            
      $.ajax({
          url:"/sign-in",
          method:"POST",
          data: $(form).serialize(),
          beforeSend:function(){
              $('#login-form .response').html('<div class="text-info"><i class="icofont-disc"></i> Loading...</div>');
          },
          //dataType: 'json',
          success:function(data){
            data = JSON.parse(JSON.stringify(data));
              $('form').trigger("reset");
              if(data.success == true && data.user.role === 'Administrator'){
                $('#login-form .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-check"></i></span>
                <p class="text-dark">success</p>
                </div>`);

                setTimeout(function(){
                    $('#login-form .response').fadeOut("slow");
                }, 10000);

                window.location.href = '/admin/home';
              }
              if(data.success == true && data.user.role === 'Agent'){
                $('#login-form .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-check"></i></span>
                <p class="text-dark">success</p>
                </div>`);

                setTimeout(function(){
                    $('#login-form .response').fadeOut("slow");
                }, 10000);

                window.location.href = '/agent/home';
              }
              
              
          },
          error:function(data){
            data = JSON.parse(JSON.stringify(data));
            $('#login-form .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-error"></i></span>
                <p style="color:red;">${data.responseJSON.message}</p>
                </div>`);
            setTimeout(function(){
                $('#login-form .response').fadeOut("slow");
            }, 6000);    
          }
      });
  });
  }