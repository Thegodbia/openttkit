//register
if($('#register-form').length){
    $('#submit').click(async ()=>{
      
    var o = new Object();
    var form = '#register-form';
      
    var first = $('#register-form .first').val();
    var last = $('#register-form .last').val();
    var msisdn = $('#register-form .msisdn').val();
    var password = $('#register-form .password').val();
    var state = $('#register-form .state').val();
      
      if(first == '' || last == '' || msisdn == '' || password == '' || state == '' )
      {
        $('#register-form .response').html('<div class="failed" style="color:red;" >Please fill the required fields.</div>');
        return false;
      }
            
      $.ajax({
          url:"/sign-up",
          method:"POST",
          data: $(form).serialize(),
          beforeSend:function(){
              $('#register-form .response').html('<div class="text-info"><i class="icofont-disc"></i> Loading...</div>');
          },
          //dataType: 'json',
          success:function(data){
            data = JSON.parse(JSON.stringify(data));
              $('form').trigger("reset");
              if(data.success == true){
                $('#register-form .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-check"></i></span>
                <p class="text-dark">kindly verify PIN</p>
                </div>`);

                setTimeout(function(){
                    $('#register-form .response').fadeOut("slow");
                }, 10000);

                window.location.href = `/verify-otp?clp=${data.clp}`;
              }
          },
          error:function(data){
            data = JSON.parse(JSON.stringify(data));
                $('#register-form .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-error"></i></span>
                <p style="color:red;">${data.responseJSON.message}</p>
                </div>`);
                setTimeout(function(){
                    $('#register-form .response').fadeOut("slow");
                }, 6000);
          }
      });
  });
  } 