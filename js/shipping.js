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
						? 'NT$ ' + this.toTWLocalePrice(shipping)
						: '請來信洽詢';
				},
			},
			watch: {
				computedShippingPound: function(newValue) {
					// 當前對應的方案
					const plan = this.shippingPlan[this.selectedPlan];
					if (newValue > plan.shipping.maximumPound) {
						alert('請來信洽詢');
					}
				},
			},
			created: function() {},
			mounted: function() {},
			methods: {
				toTWLocalePrice: function(price) {
					return parseInt(price, 10).toLocaleString('zh-TW', {
						currency: 'TWD',
					});
				},
				clickEstimate: function() {
					console.log('Ping Pong ~');
				},
			},
		});
	},
};

window.onload = function() {
	Shipping.Setup();
};
