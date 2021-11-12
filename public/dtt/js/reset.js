//register
if($('#greset-form').length){
    $('#resetSubmit').click(async ()=>{
      
    var o = new Object();
    var form = '#greset-form';
      
    var msisdn = $('#greset-form .msisdn').val();
    var password = $('#greset-form .password').val();
      
      if(msisdn == '' || password == '' )
      {
        $('#greset-form .response').html('<div class="failed" style="color:red;" >Please fill the required fields.</div>');
        return false;
      }
            
      $.ajax({
          url:"/greset-pin",
          method:"POST",
          data: $(form).serialize(),
          beforeSend:function(){
              $('#greset-form .response').html('<div class="text-info"><i class="icofont-disc"></i> Loading...</div>');
          },
          //dataType: 'json',
          success:function(data){
            data = JSON.parse(JSON.stringify(data));
              $('form').trigger("reset");
              if(data.success == true){
                $('#greset-form .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-check"></i></span>
                <p class="text-dark">kindly verify PIN</p>
                </div>`);

                setTimeout(function(){
                    $('#greset-form .response').fadeOut("slow");
                }, 10000);

                window.location.href = `/verify-otp?clp=${data.clp}`;
              }
          },
          error:function(data){
            data = JSON.parse(JSON.stringify(data));
                $('#greset-form .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-error"></i></span>
                <p style="color:red;">${data.responseJSON.message}</p>
                </div>`);
                setTimeout(function(){
                    $('#greset-form .response').fadeOut("slow");
                }, 6000);
          }
      });
  });
  }



  if($('#areset-form').length){
    $('#aresetSubmit').click(async ()=>{
      
    var o = new Object();
    var form = '#areset-form';
      
    var opassword = $('#areset-form .opassword').val();
    var password = $('#areset-form .password').val();
      
      if(opassword == '' || password == '' )
      {
        $('#areset-form .response').html('<div class="failed" style="color:red;" >Please fill the required fields.</div>');
        return false;
      }
            
      $.ajax({
          url:"/agent/reset-pin",
          method:"POST",
          data: $(form).serialize(),
          beforeSend:function(){
              $('#areset-form .response').html('<div class="text-info"><i class="icofont-disc"></i> Loading...</div>');
          },
          //dataType: 'json',
          success:function(data){
            data = JSON.parse(JSON.stringify(data));
              $('form').trigger("reset");
              if(data.success == true){
                $('#areset-form .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-check"></i></span>
                <p class="text-dark">kindly verify PIN</p>
                </div>`);

                setTimeout(function(){
                    $('#areset-form .response').fadeOut("slow");
                }, 10000);

                window.location.href = `/agent/verify-otp?clp=${data.clp}`;
              }
          },
          error:function(data){
            data = JSON.parse(JSON.stringify(data));
                $('#areset-form .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-error"></i></span>
                <p style="color:red;">${data.responseJSON.message}</p>
                </div>`);
                setTimeout(function(){
                    $('#areset-form .response').fadeOut("slow");
                }, 6000);
          }
      });
  });
  }  