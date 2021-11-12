//send subscription request
if($('#subscribe-form').length){
    $('#submit').click(function(){
      
    var o = new Object();
    var form = '#subscribe-form';
      
    var service = $('#subscribe-form .service').val();
    var msisdn = $('#subscribe-form .msisdn').val();
    var id = $('#subscribe-form .id').val();
    // var phone = $('#contact-form .phone').val();
      if(service == '' || msisdn == '' || id == '')
      {
        $('#subscribe-form .response').html('<div class="failed" style="color:red">Please fill the required fields.</div>');
        return false;
      }
            
      $.ajax({
          url:"/agent/subscription",
          method:"POST",
          data: $(form).serialize(),
          beforeSend:function(){
              $('#subscribe-form .response').html('<div class="text-info"><i class="icofont-disc"></i> Loading...</div>');
          },
          success:function(data){
              data = JSON.parse(JSON.stringify(data));
              $('form').trigger("reset");
              if(data.success == true){
                $('#subscribe-form .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-check"></i></span>
                <p class="text-dark">subscription request sent successfully</p>
                </div>`);
              }
              setTimeout(function(){
                  $('#subscribe-form .response').fadeOut("slow");
                  location.reload();
              }, 10000);
          },
          error:function(data){
              data = JSON.parse(JSON.stringify(data));
              $('#subscribe-form .response').fadeIn().html(`<div class="identity-content">
              <span class="icon"><i class="icofont-error"></i></span>
              <p style="color:red;">${data.responseJSON.message}</p>
              </div>`);
                setTimeout(function(){
                    $('#subscribe-form .response').fadeOut("slow");
                }, 6000);
          }
      });
  });
  }