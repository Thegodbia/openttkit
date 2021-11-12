$('.datepicker').datepicker();

$('.dropdown-menu').click(function (e) {
    e.stopPropagation();
    e.preventDefault();
});
$('.input-daterange input').each(function() {
    $(this).datepicker('clearDates');
});
$(function() {
    $("#exporttable").click(function(e){
        var table = $("#reporttable");
        if(table && table.length){
        $(table).table2excel({
        exclude: ".noExl",
        name: "Excel Document Name",
        filename: "Agent_Report_" + new Date().toISOString().split('T')[0] + ".xls",
        fileext: ".xls",
        exclude_img: true,
        exclude_links: true,
        exclude_inputs: true,
        preserveColors: false
        });
        }
    })
});