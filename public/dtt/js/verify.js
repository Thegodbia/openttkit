//verification
if($('#verify-form').length){
    $('#submit').click(async ()=>{
      
    var o = new Object();
    var form = '#verify-form';
      
    var code = $('#verify-form .code').val();
    var clp = $('#verify-form .clp').val();
      
      if(code == '' || code.length < 6|| clp == '')
      {
        $('#verify-form .response').html('<div class="failed" style="color:red;">Please fill the required fields.</div>');
        return false;
      }
            
      $.ajax({
          url:"/verify-otp",
          method:"POST",
          data: $(form).serialize(),
          beforeSend:function(){
              $('#verify-form .response').html('<div class="text-info"><i class="icofont-disc"></i> Loading...</div>');
          },
          //dataType: 'json',
          success:function(data){
            data = JSON.parse(JSON.stringify(data));
              $('form').trigger("reset");
              if(data.success == true){
        $('#verify-form .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-check"></i></span>
                <p class="text-dark">successfully verified! kindly login</p>
                </div>`);  
        setTimeout(function(){
                    $('#verify-form .response').fadeOut("slow");
                }, 500);
  
                window.location.href = `/sign-in`;
              }
          },
          error:function(data){
            data = JSON.parse(JSON.stringify(data));
            $('#verify-form .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-error"></i></span>
                <p style="color:red;">${data.responseJSON.message}</p>
                </div>`);
            setTimeout(function(){
                $('#verify-form .response').fadeOut("slow");
            }, 6000);    
          }
      });
  });
  }


  //resend
if($('#resend-form').length){
  $('#resendsubmit').click(async ()=>{
    
  var o = new Object();
  var form = '#resend-form';
  
  var clp = $('#resend-form .clp').val();
    
    if(clp == '')
    {
      $('#verify-form .response').html('<div class="failed" style="color:red;">An error occured.</div>');
      return false;
    }
          
    $.ajax({
        url:"/resend-otp",
        method:"POST",
        data: $(form).serialize(),
        beforeSend:function(){
            $('#verify-form .response').html('<div class="text-info"><i class="icofont-disc"></i> Loading...</div>');
        },
        //dataType: 'json',
        success:function(data){
          data = JSON.parse(JSON.stringify(data));
            $('form').trigger("reset");
            if(data.success == true){
              $('#verify-form .response').fadeIn().html(`<div class="identity-content">
                      <span class="icon"><i class="icofont-check"></i></span>
                      <p class="text-dark">OTP sent</p>
                      </div>`);  
              setTimeout(function(){
                          $('#verify-form .response').fadeOut("slow");
                      }, 500)
            }
        },
        error:function(data){
          data = JSON.parse(JSON.stringify(data));
          $('#verify-form .response').fadeIn().html(`<div class="identity-content">
              <span class="icon"><i class="icofont-error"></i></span>
              <p style="color:red;">${data.responseJSON.message}</p>
              </div>`);
          setTimeout(function(){
              $('#verify-form .response').fadeOut("slow");
          }, 6000);    
        }
    });
});
}