$(function () {
    $('.calulate_02').on('click', function () {
        var cm_or_not = $('.volume_select option:selected').val();
        var kg_or_not = $('.weight_select option:selected').val();
        if (cm_or_not == 0 & kg_or_not == 0) {
            calculate(1, 1);
            console.log('1')
           
        } else if (cm_or_not == 1 & kg_or_not == 0) {
            calculate(2.54, 1);
            console.log('2')

            // alert('公分磅');
        } else if (cm_or_not == 0 & kg_or_not == 1) {
            calculate(1, 0.45359237);
            console.log('3')

            // alert('寸公斤');
        } else if (cm_or_not == 1 & kg_or_not == 1) {
            calculate(2.54, 0.45359237);
            console.log('4')

            // alert('公分公斤');
        }
    });
})

function calculate(cm, kg) {
    //以吋+磅 為單位
    var Length = Math.ceil($('.length').val() / cm);
    var Width = Math.ceil($('.width').val() / cm);
    var Height = Math.ceil($('.height').val() / cm);


    var Weight = Math.ceil($('.weight').val() / kg);
    var Volume = Math.ceil(Length * Width * Height / 139);

    console.log(Volume)

    var Final_No = Math.max(Volume, Weight) - 1;
    
    console.log(Final_No)


    var store_select = $('.store_select option:selected').val();

    if (store_select == 0) {
        // alert('加州');
        if (Final_No >= 75) {
            alert("每磅 NT$ 85 元");
            $('div.total').html("");
            return false;
        } else {
            var shipping = $('.spex:eq(' + Final_No + ')').html();
            $('div.total').html(shipping);
            $('.v_result').text(Volume);
            $('.w_result').text(Weight);
        }
    } else {
        if (Final_No >= 75) {
            alert("每磅 NT$ 85 元");
            $('div.total').html("");

            return false;
        } else {
            var shipping = $('.nick:eq(' + Final_No + ')').html();
            $('div.total').html(shipping);
            $('.v_result').text(Volume);
            $('.w_result').text(Weight);
        }
    }
}