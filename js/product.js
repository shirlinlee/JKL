var Product = {
	instanceVue: undefined,
	Setup: function() {
		Product.instanceVue = new Vue({
			el: '#app',
			data: {
				productPrice: 0,
				shipping: 0,
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
					console.log(this.productPrice, this.shipping);
					return Number(this.productPrice) + Number(this.shipping);
				},
				totalCost: function() {
					return this.cost * Number(this.currentFee);
				},
				resultHtml: function() {
					return `$ <font class='f_blue f_b f24'>${this.cost} </font> x ${
						this.currentFee
					}(當前匯率) x 1 (免代買費)=<br> NT$ <font class="f_blue f_b f24">${
						this.totalCost
					}</font> 元整 + 國際運費`;
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
