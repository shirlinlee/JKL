$(function () {
    $('.calulate_01').on('click', function () {
        //匯率
        var Rate = 33.0;

        //代買費
        var Fee = 1.03;
        var Fee_500 = 1.01;
        var Fee_1000 = 1;

        //門檻
        var Limit = 175;

        var Price = Number($('.price').val());
        var Shipping = Number($('.shipping').val());
        var together = Shipping + Price;
        console.log(Price);
        console.log(Shipping);


        if (Price < 0 || Shipping < 0) {
            alert('金額不可小於0');
            $('input').val("");
        } else {
            if (together < Limit) {
                var Total = (Price + Shipping) * Rate + 300;
                $('.total').html("$" + together + " x " + Rate +
                    "(當前匯率) + $300(代買費)<br/> = 台幣 <span>$" + Math.floor(Total) +
                    "</span>元整 + 國際運費");
            } else {
                if (together >= 500) {
                    var fee_des = "代買費";
                    fee(Fee_500, fee_des);
                    if (together >= 1000) {
                        var no_fee = "免代買費";
                        fee(Fee_1000, no_fee);
                    }
                } else {
                    var fee_des = "代買費";
                    fee(Fee, fee_des);
                }

                function fee(fee_num, fee_des) {
                    var Total = (Price + Shipping) * Rate * fee_num;

                    $('.total').html("$" + together + " x " + Rate + "(當前匯率) x " + fee_num +
                        "(" + fee_des + ")<br/> = 台幣 <span>$" + Math.floor(Total) +
                        "</span>元整 + 國際運費");
                }

            }

        }
    });

})