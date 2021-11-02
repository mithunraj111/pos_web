<template>
  <div id="app">
    <div class="nav">
      <div class="menu">
		<router-link class="menu-item" to="/" tag="a">HOME</router-link>
        <div style="position:relative">
		<router-link class="menu-item" to="/order" tag="a">MENU</router-link>
			<!-- <a class="menu-item" @click="showOrderType=!showOrderType" href="/order">MENU</a>
			<ul class="menu-item__sub-section" v-if="showOrderType">
				<li><router-link class="menu-item-sub" to="/order" tag="a">ORDER FOR HOME DELIVERY</router-link></li>
				<li><a class="menu-item-sub">ORDER FOR COLLECTION</a></li>
			</ul> -->
		</div>
        <a class="menu-item logo">
			<img src="./assets/logo.png" alt="Kockroco Logo">
		</a>
		<router-link class="menu-item" to="/members" tag="a">MEMBERS</router-link>
		<router-link class="menu-item" to="/contact" tag="a">CONTACT US</router-link>
      </div>
    </div>
    <router-view />
	<div class="footer">

	</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	data(){
		return{
			showOrderType: false
		}
	},
	methods:{
		//
	}
})

</script>

<style lang="scss">
* {
	padding: 0;
	margin: 0;
}
body{
	color: #232121;
	font-family: 'Josefin Sans';
	font-size: 16px;
	background-color: #303034;
	background-image: url("//cdn1.zfood.co.uk/978/images/zpos-bg-Kockraco_BodyBG.jpg?auto=compress");
	background-repeat: repeat;
	background-attachment: scroll;
	background-size: cover;
}
.container{
	max-width: 1170px;
	margin: auto;
}
.text-left{
	text-align: left;
}
.text-center{
	text-align: center;
}
.text-right{
	text-align: right;
}
.row{
	display: flex;
	align-items: center;
}
.col-30, .col-40, .col-50, .col-60, .col-70, .col-90, .col-100{
    display: inline-block;
}
.col-30{
    width: 30%;
}
.col-40{
    width: 40%;
}
.col-50{
	width: 50%;
}
.col-60{
    width: 60%;
}
.col-70{
    width: 70%;
}
.col-90{
	width: 90%;
}
.col-100{
	width: 100%;
}
.nav {
	background: #303034;
	.menu {
		font-family: "Oswald";
		height: 120px;
		padding: 30px 0;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		max-width: 1000px;
		margin: auto;
		.menu-item{
			color: #fff;
			font-size: 26px;
			font-weight: 500;
			cursor: pointer;
			text-decoration: none;
			&:hover {
				color: #d17c19;
			}
			&.router-link-exact-active {
				color: #d17c19;
			}
		}
		.menu-item__sub-section{
			background: #000000;
			position: absolute;
			padding: 10px;
			color: #ffffff;
			list-style: none;
			.menu-item-sub{
				cursor: pointer;
				&:hover,.menu-item__active {
					color: #d17c19;
				}
			}
		}
		.menu-item.logo{
			img{
				max-width: 120px;
				max-height: 170px;
			}
		}
	}
}

</style>
