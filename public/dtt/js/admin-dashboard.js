
(function ($) {
    var ctx = document.getElementById('adminchartx').getContext('2d');
    $.getJSON('/admin/chart', function(result) {
        console.log(result);
        if (result) {
            var adminchartx = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: result.date,
                  datasets: [{ 
                      data: result.request,
                      label: "Request",
                      borderColor: "#f46a6aa6",
                      backgroundColor: "#f46a6a",
                      fill: false,
                    },
                    {data: result.data,
                      label: "Conversion",
                      borderColor: "rgb(62,149,205)",
                      backgroundColor: "#556ee6e8",
                      fill: false,
                    }
                  ]
                },
                options: {
                    responsive: true,
                }
              });
        }

    })
      
})(jQuery);