var Product = {
	instanceVue: undefined,
	Setup: function() {
		Product.instanceVue = new Vue({
			el: '#app',
			data: {
				productPrice: '',
				shipping: '',
				currentRate: 33,
			},
			watch: {
				productPrice: function() {
					if (this.productPrice < 0) this.productPrice = 0;
				},
				shipping: function() {
					if (this.shipping < 0) this.shipping = 0;
				},
			},
			created: function() {
				axios
					.get('https://api.coinbase.com/v2/exchange-rates?currency=USD')
					.then(function(response) {
						const {
							data: {
								data: {
									rates: { TWD },
								},
							},
						} = response;
						Product.instanceVue.currentRate = TWD;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			computed: {
				currentFee: function() {
					let result1 = Math.floor(this.currentRate * 100) / 100;
					let result2 = Math.floor((result1 + 0.25) * 2) / 2 + 0.5;
					return result2;
				},
				cost: function() {
					return Number(this.productPrice) + Number(this.shipping);
				},
				totalCost: function() {
					return this.cost * Number(this.currentFee);
				},
				resultHtml: function() {
					if( Number(this.productPrice) !== 0) {

						return `$ <font class='f_blue f_b f24'>${this.cost} </font> x ${
							this.currentFee
						}(當前匯率) x 1 (免代買費)=<br> NT$ <font class="f_blue f_b f24">${
							this.totalCost
						}</font> 元整 + 國際運費`;
					}
					return `<span class="f_grey">請填寫商品總價</span>    `
				},
			},
			mounted: function() {
				// console.log(this.currentRate ,this.currentFee)
			},
			methods: {},
		});
	},
};

window.onload = function() {
	Product.Setup();
};
