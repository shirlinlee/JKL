var Shipping = {
	instanceVue: undefined,
	Setup: function() {
		Shipping.instanceVue = new Vue({
			el: '#app',
			data: {
				selectedPlan: 0,
				shippingPlan: data_shipping.plan,
				selectedVolume: 0,
				unitVolume: data_shipping.unit.volume,
				selectedWeight: 0,
				unitWeight: data_shipping.unit.weight,
				length: '',
				width: '',
				height: '',
				weight: '',
				noTitle: false,
				productPrice: 0,
				shipping: 0,
				currentRate: 33,
				buyingFee: 1,
			},
			computed: {
				computedVolume: function() {
					// 計算 體積磅數
					const rateVolume = this.unitVolume[this.selectedVolume].rate;
					const length = Math.ceil(this.length);
					const width = Math.ceil(this.width);
					const height = Math.ceil(this.height);
					const result = Math.ceil(
						(length * width * height * rateVolume) / 139
					);
					return result;
				},
				computedWeight: function() {
					// 計算 磅數
					const rateWeight = this.unitWeight[this.selectedWeight].rate;
					const weight = Math.ceil(this.weight);
					const result = Math.ceil(weight * rateWeight);
					return result;
				},
				computedShippingPound: function() {
					// 體積磅數 與 重量磅數 兩者的取最大值
					return Math.max(
						this.selectedPlan === 0 ? 0 : this.computedVolume || 0,
						this.computedWeight
					);
				},
				computedShippingCost: function() {
					// 當前對應的方案
					const plan = this.shippingPlan[this.selectedPlan];

					// 是否有超過對應磅數的限制
					const isOverLimit =
						plan.shipping.limitPound &&
						this.computedShippingPound > plan.shipping.limitPound;

					// 計算運費
					const shipping = isOverLimit
						? this.computedShippingPound * plan.shipping.limitRatio
						: plan.shipping.pricing[this.computedShippingPound];

					return this.computedShippingPound <= plan.shipping.maximumPound
						?  this.toTWLocalePrice(shipping)
						: '請來信洽詢';
				},
				currentFee: function() {
					let result1 = Math.floor(this.currentRate * 100) / 100;
					let result2 = Math.floor((result1 + 0.25) * 2) / 2 + 0.5;
					return result2;
				},
				cost: function() {
					return Number(this.productPrice) + Number(this.shipping);
				},
				totalCost: function() {
					// return this.cost * Number(this.currentFee);
					// if()
					console.log(typeof this.computedShippingCost);

					return Number(this.computedShippingCost) + this.buyingFeeNumber;
				},
				// resultHtml: function() {
				// 	if( Number(this.productPrice) !== '') {

				// 		return `$ <font class='f_blue f_b f24'>${this.cost} </font> x ${
				// 			this.currentFee
				// 		}(當前匯率) x 1 (免代買費)=<br> NT$ <font class="f_blue f_b f24">${
				// 			this.totalCost
				// 		}</font> 元整 + 國際運費`;
				// 	}
				// 	return `<span class="f_grey">請填寫商品總價</span>    `
				// },
				buyingFeeNumber: function() {
					console.log(this.buyingFee, this.productPrice, this.currentRate)
					return this.buyingFee * this.productPrice * this.currentRate;
				}
			},
			watch: {
				computedShippingPound: function(newValue) {
					// 當前對應的方案
					const plan = this.shippingPlan[this.selectedPlan];
					if (newValue > plan.shipping.maximumPound) {
						alert('請來信洽詢');
					}
				},
				productPrice: function() {
					if (this.productPrice < 0) this.productPrice = 0;
				},
				shipping: function() {
					if (this.shipping < 0) this.shipping = 0;
				},
			},
			created: function() {
				if(window.location.hash === '#notitle') this.noTitle = true;
				
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
			mounted: function() {

			},
			methods: {
				toTWLocalePrice: function(price) {
					return parseInt(price, 10).toLocaleString('zh-TW', {
						currency: 'TWD',
					});
				},
			},
		});
	},
};

window.onload = function() {
	Shipping.Setup();
};
