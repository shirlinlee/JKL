var Shipping = {
	instanceVue: undefined,
	Setup() {
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
				// buyingFee: 1,
			},
			computed: {
				computedVolume() {
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
				computedWeight() {
					// 計算 磅數
					const rateWeight = this.unitWeight[this.selectedWeight].rate;
					const weight = Math.ceil(this.weight);
					const result = Math.ceil(weight * rateWeight);
					return result;
				},
				computedShippingPound() {
					// 體積磅數 與 重量磅數 兩者的取最大值
					console.log(Math.max(
						this.selectedPlan === 0 ? 0 : this.computedVolume || 0,
						this.computedWeight
					))
					return Math.max(
						this.selectedPlan === 0 ? 0 : this.computedVolume || 0,
						this.computedWeight
					);
					

				},
				computedShippingCost() {
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

					// console.log(this.computedShippingPound <= plan.shipping.maximumPound
					// 	?  this.toTWLocalePrice(shipping)
					// 	: '請來信洽詢')
					return this.computedShippingPound <= plan.shipping.maximumPound
						?  this.toTWLocalePrice(shipping)
						: '請來信洽詢';
				},
				currentFee() {
					let result1 = Math.floor(this.currentRate * 100) / 100;
					let result2 = Math.floor((result1 + 0.25) * 2) / 2 + 0.5;
					return result2;
				},
				// cost() {
				// 	return Number(this.productPrice) + Number(this.shipping);
				// },
				totalCost() {
					// console.log(Number(this.computedShippingCost.replace(/[^0-9.-]+/g,"")), this.computedShippingCost);
					return Math.floor(Number(this.computedShippingCost.replace(/[^0-9.-]+/g,""))) + Number(this.buyingFeeNumber);
				},
				buyingFee() {
				
					if ( this.productPrice < 175 ) {
						return 300;
					} else if ( this.productPrice >= 175 && this.productPrice <= 500 ) {
						return 1.03;
					} else if ( this.productPrice > 500 && this.productPrice <= 1000 ) {
						return 1.01;
					}
					return  1
				},
				buyingFeeNumber() {
					
					if ( this.productPrice < 175 ) {
						return Math.floor( this.productPrice * this.currentFee + this.buyingFee );
					}
					return Math.floor(this.productPrice * this.currentFee * this.buyingFee);
				}
			},
			watch: {
				computedShippingPound(newValue) {
					// 當前對應的方案
					const plan = this.shippingPlan[this.selectedPlan];
					if (newValue > plan.shipping.maximumPound) {
						alert('請來信洽詢');
					}
				},
				productPrice() {
					if (this.productPrice < 0) this.productPrice = 0;
				},
				shipping() {
					if (this.shipping < 0) this.shipping = 0;
				},
			},
			created() {
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
						Shipping.instanceVue.currentRate = TWD;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			mounted() {

			},
			methods: {
				toTWLocalePrice(price) {
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
