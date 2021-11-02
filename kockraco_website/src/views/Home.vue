<template>
	<div class="home">
		<div class="carousel-section text-center">
			<div class="col-50 text-center py-50">
				<img src="../assets/logo_dark.png" alt="logo">
				<h1>FRESH CHARCOAL CHICKEN</h1>
				<h1>ORDER FROM DUNFERMLINE</h1>
			</div>
		</div>
		<OrangeLabelBanner />
		<!-- <div class="post-code">
			<div class="container">
				<div class="banner-orange">
					<div class="col-50">
						<div>START YOUR ONLINE ORDER NOW!</div>
						<div>JUST ENTER YOUR POSTCODE TO BEGIN YOUR ORDER!</div>
					</div>
					<div class="col-50">
						<div></div>
						<div>
							<div class="col-50"><button class="dark-btn">HOME DELIVERY</button></div>
							<div class="col-50"><button class="dark-btn">COLLECTION</button></div>
						</div>
					</div>
				</div>
			</div>
		</div> -->
		<div class="set-overflow">
			<div class="">
				<div class="card py-50">
					<div class="col-50 text-center" style="margin: 0 30px 0 50px">
						<h1>CHARCOAL GRILL</h1>
						<hr />
						<p class="pt-50">ALL OUR CHICKEN IS MARINATED WITH OUR SIGNATURE RECIPE THEN GRILLED TO PERFECTION WITH FRESH CHARCOAL. ORDER NOW FOR DELIVERY OR COLLECTION.</p>
					</div>
					<div class="col-50">
						<img src="https://www.kockraco.co.uk/myimages/978/KockcracoCharcoalImage.jpg" width="85%">
					</div>
				</div>
			</div>
		</div>
		<div class="message-banner">
			<div class="banner-orange">
				<div class="container text-center py-50">
					<h1>EARN LOYALTY POINTS</h1>
					<p class="py-20" style="font-weight:800;line-height:1.8;">WHEN YOU REGISTER YOUR DETAILS ON OUR WEBSITE TO BECOME A MEMBER YOU CAN EARN LOYALTY POINTS ON ALL YOUR ONLINE ORDERS, STARTING TODAY WITH YOUR VERY FIRST ORDER! THESE LOYALTY POINTS CAN BE REDEEMED AGAINST ALL YOUR FUTURE ORDERS AT KOCKRACO. SIMPLY REGISTER TODAY TO START COLLECTING.</p>
					<button class="dark-btn">BECOME A MEMBER</button>
					<button class="dark-btn">ORDER ONLINE</button>
				</div>
			</div>
		</div>
		<div class="white-banner">
			<div class="container">
				<p>FRESH CHARCOAL GRILLED CHICKEN IN OUR SIGNATURE MARINADE</p>
			</div>
		</div>
		<div class="white-banner">
			<div class="container">
				<p>FOLLOW US ON SOCIAL MEDIA FOR THE LATEST NEWS</p>
			</div>
		</div>
		<div class="message-banner">
			<div class="banner-orange">
				<div class="container text-center py-50">
					<h1>ABOUT KOCKRACO</h1>
					<p class="py-20" style="font-weight:800;line-height:1.8;">WE'RE KOCKRACO, DUNFERMLINE'S FIRST CHOICE FOR DELICIOUS NACHOS, TEX-MEX, CHICKEN, AND MORE! OUR ONLINE MENU HAS A HUGE VARIETY OF TASTY OPTIONS. HAVE YOU TRIED OUR CHARCOAL CHICKEN? WE MARINATE IT FOR 24 HOURS IN OUR SECRET SPICES, THEN STEAM IT ON OUR OPEN CHARCOAL GRILL, READY TO DELIVER IT TO YOUR DOOR. ORDER NOW!</p>
					<button class="dark-btn">ORDER ONLINE</button>
					<button class="dark-btn">CONTACT US</button>
				</div>
			</div>
		</div>
		<div class="white-banner">
			<div class="container">
				<p>FANCY A SWEET TREAT? TRY ONE OF OUR DELICIOUS MILKSHAKES</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import OrangeLabelBanner from "../components/OrangeBanner.vue";
export default Vue.extend({

    components: {
      OrangeLabelBanner,
    }
})
</script>

<style lang="scss" scoped>
.carousel-section{
	background-image: url('../assets/bg.jpeg');
}
.banner-orange{
	padding: 10px 0;
	color: #ffffff;
	background: #d17c19;
}
.post-code{
	padding: 125px 20px;
	.banner-orange{
		background-image: url('../assets/orange-bg.jpeg');
		background-size: cover;
		box-sizing: border-box;
		padding: 30px 20px 20px;
		border-radius: 10px;
	}
	.dark-btn{
		width: calc(100% - 20px);
	}
}
.post-code, .message-banner{
	.dark-btn{
		background: #232121;
		color: #ffffff;
		margin: 10px;
		border: none;
		padding: 10px 15px;
		border-radius: 5px;
	}
}
.message-banner p{ margin: 20px auto 10px;}
.set-overflow{
	background-image: url('../assets/bg.jpeg');
	// height: 250px;
	.card{
		// height: 250px;
		// margin-top: -50px;
		// position: absolute;
		display: flex;
		align-items: center;
	}
	h1{
		font-size: 42px;
	}
}
.white-banner{
	background-color: #FEFCE6;
	.container{
		overflow: hidden;
		text-align: center;
		padding: 30px 0;
		p{
			position: relative;
			display: inline;
			font-size: 20px;
			font-weight: 800;
			&:before,&:after{
				position: absolute;
				content: '';
				top: 50%;
				height: 3px;
				width: 100%;
				background: #d17c19;
			}
			&:before{
				left: -10px;
				transform: translate(-100%,-50%);
			}
			&:after{
				right: -10px;
				transform: translate(100%,-50%);
			}
		}
	}
}
.py-50, .pt-50{
	padding-top: 50px;
}
.py-50, .pb-50{
	padding-bottom: 50px;
}
.card{
	background: #fff;
    box-shadow: 0 0 10px 8px #00000030;
}
</style>