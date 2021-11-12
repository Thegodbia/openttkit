
(function ($) {
    
    $.getJSON('/agent/chart', function(result) {
        if (result) {
            var ctx = document.getElementById('balanceChart').getContext('2d');
            var balanceChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                  labels: ["Subscription requests","Conversions"],
                  datasets: [{ 
                      data: result,
                      borderColor:[
                        "#F7931A",
                        "#2CA07A",
                      ],
                      backgroundColor: [
                        "#f1b44c",
                        "#34c38f"
                      ],
                      borderWidth:2,
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            gridLines: {
                              show: false
                            }
                          }],
                        yAxes:[{
                            gridLines: {
                              show: false
                            }
                          }]
                    }
                }
            });        
        }
      })
    
})(jQuery)

if($("home-chart-height")){
    (function ($) {
        var ctx = document.getElementById('agentchartx').getContext('2d');
        $.getJSON('/agent/linechart', function(result) {
            console.log(result);
            if (result) {
                var agentchartx = new Chart(ctx, {
                    type: 'line',
                    data: {
                      labels: result.date,
                      datasets: [{ 
                          data: result.data,
                          label: "Conversion",
                          borderColor: "rgb(62,149,205)",
                          backgroundColor: "#556ee6e8",
                          fill: true,
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
}