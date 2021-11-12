//  Preloader
jQuery(window).on("load", function () {
    $('#preloader').fadeOut(1000);
    $('#main-wrapper').addClass('show');
});


(function ($) {

    "use strict"

    //to keep the current page active
    $(function () {
        for (var nk = window.location,
            o = $(".settings-menu a, .menu a").filter(function () {
                return this.href == nk;
            })
                .addClass("active")
                .parent()
                .addClass("active"); ;) {
            // console.log(o)
            if (!o.is("li")) break;
            o = o.parent()
                .addClass("show")
                .parent()
                .addClass("active");
        }

    });

    //$('[data-toggle="tooltip"]').tooltip();

})(jQuery);




function themeToggle() {
    let element = document.body;
    element.classList.toggle("dark-theme");

    let theme = localStorage.getItem("theme");
    if (theme && theme === "dark-theme") {
        localStorage.setItem("theme", "");
    } else {
        localStorage.setItem("theme", "dark-theme");
    }
}

/*(function () {
    let onpageLoad = localStorage.getItem("theme") || "";
    let element = document.body;
    element.classList.add(onpageLoad);
    document.getElementById("theme").textContent = localStorage.getItem("theme") || "light";
})();*/



//send subscription request
if($('#subscribe-form').length){
    $('#submit').click(function(){
      
    var o = new Object();
    var form = '#subscribe-form';
      
    var service = $('#subscribe-form .service').val();
    var msisdn = $('#contact-form .msisdn').val();
    // var phone = $('#contact-form .phone').val();
      
      if(service == '' || msisdn == '')
      {
        $('#subscribe-form .response').html('<div class="failed">Please fill the required fields.</div>');
        return false;
      }
            
      $.ajax({
          url:"/agent/send-subscription",
          method:"POST",
          data: $(form).serialize(),
          beforeSend:function(){
              $('#subscribe-form .response').html('<div class="text-info"><i class="icofont-disc"></i> Loading...</div>');
          },
          success:function(data){
              data = JSON.parse(JSON.stringify(data));
              $('form').trigger("reset");
              if(data){
                $('#subscribe-form .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-check"></i></span>
                <p class="text-dark">${data}</p>
                </div>`);
              }
              setTimeout(function(){
                  $('#subscribe-form .response').fadeOut("slow");
                  location.reload();
              }, 10000);
          },
          error:function(data){
              data = JSON.parse(JSON.stringify(data));
              console.log(data);
              $('#subscribe-form .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-error"></i></span>
                <p class="text-dark">${data.responseText}</p>
                </div>`);
                setTimeout(function(){
                    $('#subscribe-form .response').fadeOut("slow");
                    
                }, 6000);
          }
      });
  });
  }


  //register
  if($('#register-form').length){
    $('#submit').click(async ()=>{
      
    var o = new Object();
    var form = '#register-form';
      
    var first = $('#register-form .first').val();
    var last = $('#register-form .last').val();
    var msisdn = $('#register-form .msisdn').val();
    var password = $('#register-form .password').val();
    // var phone = $('#contact-form .phone').val();
      
      if(first == '' || last == '' || msisdn == '' || password == '' )
      {
        $('#register-form .response').html('<div class="failed">Please fill the required fields.</div>');
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
                <p class="text-dark">success kindly login now</p>
                </div>`);

                setTimeout(function(){
                    $('#register-form .response').fadeOut("slow");
                }, 10000);

                window.location.href = '/sign-in';
              }
          },
          error:function(data){
            data = JSON.parse(JSON.stringify(data));
            $('#register-form .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-error"></i></span>
                <p class="text-dark">${data.responseJSON.message}</p>
                </div>`);
            setTimeout(function(){
                $('#register-form .response').fadeOut("slow");
            }, 6000);    
          }
      });
  });
  }  


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
        $('#login-form .response').html('<div class="failed">Please fill the required fields.</div>');
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
                <p class="text-dark">${data.responseText}</p>
                </div>`);
            setTimeout(function(){
                $('#login-form .response').fadeOut("slow");
            }, 6000);    
          }
      });
  });
  }

  //add region
  if($('#add-region').length){
    $('#submit').click(async ()=>{
      
    var o = new Object();
    var form = '#add-region';
      
    var region = $('#add-region .region').val();
    // var phone = $('#contact-form .phone').val();
      
      if(region == '' || region.length <= 3)
      {
        $('#add-region .response').html('<div class="failed">Please fill the required fields correctly.</div>');
        return false;
      }
            
      $.ajax({
          url:"/admin/settings-region-add",
          method:"POST",
          data: $(form).serialize(),
          beforeSend:function(){
              $('#add-region .response').html('<div class="text-info"><i class="icofont-disc"></i> Adding...</div>');
          },
          //dataType: 'json',
          success:function(data){
            data = JSON.parse(JSON.stringify(data));
              $('form').trigger("reset");
              if(data.success == true){
                $("#addRegion").remove();  
                $("#successRegionCard").modal('show');
                //$().fadeIn().html(``);
              }
              setTimeout(function(){
                location.reload();;
              }, 5000);
          },
          error:function(data){
            data = JSON.parse(JSON.stringify(data));
            $('#add-region .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-error"></i></span>
                <p class="text-dark">${data.responseText}</p>
                </div>`);
            setTimeout(function(){
                $('#add-region .response').fadeOut("slow");
            }, 6000);    
          }
      });
  });
  }

//delete region
if ($('#deleteRegion').length) {
  $('#deleteRegion').click(async ()=>{
    var id = $('#deleteRegion').val();
    const confam = confirm();
    if(confam){
      $.ajax({
        url:`/admin/settings-region-delete/${id}`,
        method:"DELETE",
        success:function(data){
            data = JSON.parse(JSON.stringify(data));
              //$('form').trigger("reset");
              if(data.success == true){
                $("#successRegionCard").modal('show');
               // $("#addRegion").remove();  
                //$("#successRegionCard").modal('show');
                //$().fadeIn().html(``);
              }else{
                  alert(data);
              }
              setTimeout(function(){
                location.reload();
              }, 5000);
          }
    })
    }

});
}




//get and populate editregion form
if($('#editRegion')){
  //get data and populate edit modal
  $('#editRegion').click(async ()=>{
    var id = $('#editRegion').val();
      $.ajax({
            url:`/admin/settings-region/${id}`,
            method:"GET",
            success:function(data){
                data = JSON.parse(JSON.stringify(data));
                  //$('form').trigger("reset");
                  if(data.success == true){
                      //alert('success');
                      $('#editregion .modal-body .g-3').html(`<input type="hidden" name="id" class="form-control" value="${data.region[0].id}">
                      <div class="col-xl-12">
                          <label class="form-label">Name of region </label>
                          <input type="text" name="region" class="form-control region" value="${data.region[0].name}">
                      </div>`)
                  $("#editregion").modal('show');
                   // $("#addRegion").remove();  
                    
                    //$().fadeIn().html(``);
                  }
                  /*setTimeout(function(){
                    location.reload();;
                  }, 5000);*/
              }
        })
  
  });
}

//update region
if($('#edit-region').length){
  $('#submitRegion').click(async ()=>{
    
  var o = new Object();
  var form = '#edit-region';
    
  var region = $('#edit-region .region').val();
  // var phone = $('#contact-form .phone').val();
    
    if(region == '' || region.length <= 3)
    {
      $('#edit-region .response').html('<div class="failed">Please fill the required fields correctly.</div>');
      return false;
    }
          
    $.ajax({
        url:"/admin/settings-region-edit",
        method:"PUT",
        data: $(form).serialize(),
        beforeSend:function(){
            $('#edit-region .response').html('<div class="text-info"><i class="icofont-disc"></i> Adding...</div>');
        },
        //dataType: 'json',
        success:function(data){
          data = JSON.parse(JSON.stringify(data));
            $('form').trigger("reset");
            if(data.success == true){ 
              $("#successRegionCard").modal('show');
              //$().fadeIn().html(``);
            }
            setTimeout(function(){
              location.reload();;
            }, 5000);
        },
        error:function(data){
          data = JSON.parse(JSON.stringify(data));
          $('#edit-region .response').fadeIn().html(`<div class="identity-content">
              <span class="icon"><i class="icofont-error"></i></span>
              <p class="text-dark">${data.responseText}</p>
              </div>`);
          setTimeout(function(){
              $('#edit-region .response').fadeOut("slow");
          }, 6000);   
        }
    });
});
}



  //add whitelist
  if($('#whitelist-add').length){
    $('#submit').click(async ()=>{
      
    var o = new Object();
    var form = '#whitelist-add';
      
    var msisdn = $('#whitelist-add .msisdn').val();
    var subregion = $('#whitelist-add .subregion').val();
      
      if(msisdn == '' || msisdn.length <= 10 || msisdn.length >= 12 || subregion == '')
      {
        $('#whitelist-add .response').html('<div class="failed">Please fill the required fields correctly.</div>');
        return false;
      }
            
      $.ajax({
          url:"/admin/settings-whitelist-add",
          method:"POST",
          data: $(form).serialize(),
          beforeSend:function(){
              $('#whitelist-add .response').html('<div class="text-info"><i class="icofont-disc"></i> Adding...</div>');
          },
          //dataType: 'json',
          success:function(data){
            data = JSON.parse(JSON.stringify(data));
              $('form').trigger("reset");
              if(data.success == true){
                $("#whitelist-add").remove();  
                $("#successRegionCard").modal('show');
                //$().fadeIn().html(``);
              }
              setTimeout(function(){
                location.reload();;
              }, 5000);
          },
          error:function(data){
            data = JSON.parse(JSON.stringify(data));
            $('#whitelist-add .response').fadeIn().html(`<div class="identity-content">
                <span class="icon"><i class="icofont-error"></i></span>
                <p class="text-dark">${data.responseText}</p>
                </div>`);
            setTimeout(function(){
                $('#whitelist-add .response').fadeOut("slow");
            }, 6000);    
          }
      });
  });
  }

//get and populate editregion form
if($('#editWhitelist')){
  //get data and populate edit modal
  $('#editWhitelist').click(async ()=>{
    var id = $('#editWhitelist').val();
      $.ajax({
            url:`/admin/settings-whitelist/${id}`,
            method:"GET",
            success:function(data){
                data = JSON.parse(JSON.stringify(data));
                  //$('form').trigger("reset");
                  if(data.success == true){
                      //alert('success');
                      $('#editregion .modal-body .g-3 .inputmsisdn').html(`
                      <input type="hidden" name="id" class="form-control" value="${data.whitelist[0].id}">
                          <label class="form-label">Phone number </label>
                          <input type="text" name="msisdn" class="form-control msisdn" value="${data.whitelist[0].name}">
                      </div>`)
                  $("#editwhitelist").modal('show');
                   // $("#addRegion").remove();  
                    
                    //$().fadeIn().html(``);
                  }
                  /*setTimeout(function(){
                    location.reload();;
                  }, 5000);*/
              }
        })
  
  });
}



//add subregion
if($('#addSubRegion').length){
  $('#submit').click(async ()=>{
    
  var o = new Object();
  var form = '#add-subregion';
    
  var subregion = $('#add-subregion .subregion').val();
  var region = $('#add-subregion .region').val();
  // var phone = $('#contact-form .phone').val();
    
    if(subregion == '' || region == '' )
    {
      $('#addSubRegion .response').html('<div class="failed">Please fill the required fields correctly.</div>');
      return false;
    }
          
    $.ajax({
        url:"/admin/settings-subregion-add",
        method:"POST",
        data: $(form).serialize(),
        beforeSend:function(){
            $('#addSubRegion .response').html('<div class="text-info"><i class="icofont-disc"></i> Adding...</div>');
        },
        //dataType: 'json',
        success:function(data){
          data = JSON.parse(JSON.stringify(data));
            $('form').trigger("reset");
            if(data.success == true){
              $("#addSubRegion").remove();  
              $("#successRegionCard").modal('show');
              //$().fadeIn().html(``);
            }
            setTimeout(function(){
              location.reload();;
            }, 5000);
        },
        error:function(data){
          data = JSON.parse(JSON.stringify(data));
          $('#add-region .response').fadeIn().html(`<div class="identity-content">
              <span class="icon"><i class="icofont-error"></i></span>
              <p class="text-dark">${data.responseText}</p>
              </div>`);
          setTimeout(function(){
              $('#add-region .response').fadeOut("slow");
          }, 6000);    
        }
    });
});
}



//add service
if($('#addService').length){
  $('#submit').click(async ()=>{
    
  var o = new Object();
  var form = '#add-service';
    
  var name = $('#add-service .name').val();
  var pid = $('#add-service .pid').val();
  var agid = $('#add-service .agid').val();
  var cost = $('#add-service .cost').val();
  // var phone = $('#contact-form .phone').val();
    
    if(name == '' || pid == '' || agid == '' || cost == '')
    {
      $('#addService .response').html('<div class="failed">Please fill the required fields correctly.</div>');
      return false;
    }
          
    $.ajax({
        url:"/admin/settings-service-add",
        method:"POST",
        data: $(form).serialize(),
        beforeSend:function(){
            $('#addService .response').html('<div class="text-info"><i class="icofont-disc"></i> Adding...</div>');
        },
        //dataType: 'json',
        success:function(data){
          data = JSON.parse(JSON.stringify(data));
            $('form').trigger("reset");
            if(data.success == true){
              $("#addService").remove();  
              $("#successRegionCard").modal('show');
              //$().fadeIn().html(``);
            }
            setTimeout(function(){
              location.reload();;
            }, 5000);
        },
        error:function(data){
          data = JSON.parse(JSON.stringify(data));
          $('#addService .response').fadeIn().html(`<div class="identity-content">
              <span class="icon"><i class="icofont-error"></i></span>
              <p class="text-dark">${data.responseText}</p>
              </div>`);
          setTimeout(function(){
              $('#addService .response').fadeOut("slow");
          }, 6000);    
        }
    });
});
}


//Edit Service
if($('#editService')){
  //get data and populate edit modal
  $('#editService').click(async ()=>{
    var id = $('#editService').val();
      $.ajax({
            url:`/admin/settings-service/${id}`,
            method:"GET",
            success:function(data){
                data = JSON.parse(JSON.stringify(data));
                  //$('form').trigger("reset");
                  if(data.success == true){
                      //alert('success');
                      $('#editservice .modal-body .g-3').html(`<div class="col-xl-12">
                      <label class="form-label">Name </label>
                      <input type="text" name="name" class="form-control name" value="${data.service[0].name}">
                  </div>
                  <div class="col-xl-12">
                      <label class="form-label">Product ID </label>
                      <input type="text" name="pid" class="form-control pid" value="${data.service[0].product_id}">
                  </div>
                  <div class="col-xl-12">
                      <label class="form-label">Aggregator ID </label>
                      <input type="text" name="agid" class="form-control agid" value="${data.service[0].agg_sid}">
                  </div>
                  <div class="col-xl-12">
                      <label class="form-label">Cost </label>
                      <input type="text" name="cost" class="form-control cost" value="${data.service[0].cost}">
                  </div>`)
                  $("#editservice").modal('show');
                   // $("#addRegion").remove();  
                    
                    //$().fadeIn().html(``);
                  }
                  /*setTimeout(function(){
                    location.reload();;
                  }, 5000);*/
              }
        })
  
  });
}









//add agent
if($('#addAgent').length){
  $('#submit').click(async ()=>{
    
  var o = new Object();
  var form = '#add-agent';
    
  var first = $('#add-agent .first').val();
  var last = $('#add-agent .last').val();
  var msisdn = $('#add-agent .msisdn').val();
  var role = $('#add-agent .role').val();
  var password = $('#add-agent .password').val();
  // var phone = $('#contact-form .phone').val();
    
    if(first == '' || last == '' || msisdn == '' || password == '' || role == '')
    {
      $('#addAgent .response').html('<div class="failed">Please fill the required fields correctly.</div>');
      return false;
    }
          
    $.ajax({
        url:"/admin/settings-agent-add",
        method:"POST",
        data: $(form).serialize(),
        beforeSend:function(){
            $('#addAgent .response').html('<div class="text-info"><i class="icofont-disc"></i> Adding...</div>');
        },
        //dataType: 'json',
        success:function(data){
          data = JSON.parse(JSON.stringify(data));
            $('form').trigger("reset");
            if(data.success == true){
              //$("#addAgent").modal('hide');  
              $("#successRegionCard").modal('show');
              //$().fadeIn().html(``);
            }
            setTimeout(function(){
              location.reload();;
            }, 5000);
        },
        error:function(data){
          data = JSON.parse(JSON.stringify(data));
          $('#addAgent .response').fadeIn().html(`<div class="identity-content">
              <span class="icon"><i class="icofont-error"></i></span>
              <p class="text-dark">${data.responseText}</p>
              </div>`);
          setTimeout(function(){
              $('#addAgent .response').fadeOut("slow");
          }, 6000);    
        }
    });
});
}


//support
if($('#support-form').length){
  $('#submit').click(function(){
  var o = new Object();
  var form = '#support-form';
    
  var message = $('#support-form .message').val();
  console.log(message);
  // var phone = $('#contact-form .phone').val();
    
    if(!message  || message == '')
    {
      $('#support-form .response').html('<div class="failed">Please fill the required fields.</div>');
      return false;
    }
          
    $.ajax({
        url:"/agent/support",
        method:"POST",
        data: $(form).serialize(),
        beforeSend:function(){
            $('#support-form .response').html('<div class="text-info"><i class="icofont-disc"></i> Loading...</div>');
        },
        success:function(data){
            data = JSON.parse(JSON.stringify(data));
            $('form').trigger("reset");
            if(data){
              $('#support-form .response').fadeIn().html(`<div class="identity-content">
              <span class="icon"><i class="icofont-check"></i></span>
              <p class="text-dark">Thank you for reaching out for help!</p>
              </div>`);
            }
            setTimeout(function(){
                $('#support-form .response').fadeOut("slow");
                location.reload();
            }, 10000);
        },
        error:function(){
            //data = JSON.parse(JSON.stringify(data));
            //console.log(data);
            $('#support-form .response').fadeIn().html(`<div class="identity-content">
              <span class="icon"><i class="icofont-error"></i></span>
              <p class="text-dark">failed request kindly try again later</p>
              </div>`);
              setTimeout(function(){
                  $('#support-form .response').fadeOut("slow");
                  
              }, 5000);
        }
    });
});
}