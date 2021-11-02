<template>
  <div class="orange-label-benner"> 
			<div class="container">
				<div class="col-50 text-center" v-html="welcomeMsg"></div>
				<div class="col-50 text-right">Your local Kockraco is: Dunfermline, 26 Bruce Street, KY12 7AG.</div>
			</div>
		</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'OrangeLabelBanner',
  props: {
    // msg: String,
  },
  data(){
		return {
			welcomeMsg: 'Welcome Guest! Please Login or register so we can know who you are.'
		}
	},
	mounted() {
		if(localStorage.registered){
			this.welcomeMsg = `Welcome back ${localStorage.name} [ <a class="link-text" href="/members">My Account</a> | <span class="link-text" @click="logout()">Logout</span> ]`
		}
	},
  methods:{
    logout: function(){
			this.welcomeMsg = 'Welcome Guest! Please <a class="link-text" href="/members">Login or register</a> so we can know who you are.';
      localStorage.name = '';
      localStorage.registered = false;
    }
  }
});
</script>

<style lang="scss">
.orange-label-benner{
  	padding: 10px 0;
    color: #ffffff;
    background: #d17c19;
    .link-text{
      text-decoration: none;
      cursor: pointer;
      color: #ffffff;
    }
}
</style>
