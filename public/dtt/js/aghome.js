
$.ajax({
    url: "/agent/donut",
    dataType: 'json',
    success: result => {
        var ctx = document.getElementById('balanceChart').getContext('2d');
            var balanceChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                  labels: ["Subscription requests","Conversions"],
                  datasets: [{ 
                      data: result,
                      backgroundColor: [
                        "#ffcb06",
                        "#556ee6"
                      ],
                      borderWidth:2,
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false,
                                drawBorder: false,
                            }
                          }],
                        yAxes:[{
                            gridLines: {
                                display: false,
                                drawBorder: false,
                            }
                          }]
                    }
                }
            });
    }
});