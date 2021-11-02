<template>
  <div class="members">
		<OrangeLabelBanner />
	  	<div v-if="!registered" class="container" style="display:flex;justify-content:space-evenly">
			<div class="col-60" style="padding: 0 20px 0">
				<div class="card">
					<div class="card-header">Register now, it's free!</div>
					<div class="card-body">
						<form>
							<div class="row mb-10">
								<div class="col-30 text-right">Title</div>
								<div class="col-70">
									<div class="form-field text-left">
										<select name="" id="">
											<option value="Mr" label="Mr"></option>
											<option value="Mrs" label="Mrs"></option>
											<option value="Miss" label="Miss"></option>
											<option value="Ms" label="Ms"></option>
											<option value="Dr" label="Dr"></option>
											<option value="Fr" label="Fr"></option>
										</select>
									</div>
								</div>
							</div>
							<div class="row mb-10">
								<div class="col-30 text-right">First Name</div>
								<div class="col-70">
									<div class="form-field text-left">
										<input type="text">
									</div>
								</div>
							</div>
							<div class="row mb-10">
								<div class="col-30 text-right">Surname</div>
								<div class="col-70">
									<div class="form-field text-left">
										<input type="text">
									</div>
								</div>
							</div>
							<div class="row mb-10">
								<div class="col-30 text-right">Date of Birth</div>
								<div class="col-70">
									<div class="form-field text-left">
										<input type="text">
										<p class="hint--text">Optional</p>
									</div>
								</div>
							</div>
							<div class="row mb-10">
								<div class="col-30 text-right">Email</div>
								<div class="col-70">
									<div class="form-field text-left">
										<input type="text">
									</div>
								</div>
							</div>
							<div class="row mb-10">
								<div class="col-30 text-right">Mobile Number</div>
								<div class="col-70">
									<div class="form-field text-left">
										<input type="text">
										<p class="hint--text">No spaces please</p>
									</div>
								</div>
							</div>
							<div class="row mb-10">
								<div class="col-30 text-right">Landline Number</div>
								<div class="col-70">
									<div class="form-field text-left">
										<input type="text">
										<p class="hint--text">No spaces please</p>
									</div>
								</div>
							</div>
							<div class="row mb-10">
								<div class="col-30 text-right">Password</div>
								<div class="col-70">
									<div class="form-field text-left">
										<input :type="showRegPwd?'text':'password'">
										<span class="append-icon"><i @click="showRegPwd=!showRegPwd" class="fa fa-eye"></i></span>
										<p class="hint--text">Min 6 characters</p>
									</div>
								</div>
							</div>
							<div class="row mb-10">
								<div class="col-30 text-right">Postcode</div>
								<div class="col-70">
									<div class="form-field text-left">
										<input type="text">
									</div>
								</div>
							</div>
							<div class="row mb-10">
								<div class="col-30 text-right">Delivery Address Line 1</div>
								<div class="col-70">
									<div class="form-field text-left">
										<input type="text">
									</div>
								</div>
							</div>
							<div class="row mb-10">
								<div class="col-30 text-right">Delivery Address Line 2</div>
								<div class="col-70">
									<div class="form-field text-left">
										<input type="text">
									</div>
								</div>
							</div>
							<div class="row mb-10">
								<div class="col-30 text-right">Town/City</div>
								<div class="col-70">
									<div class="form-field text-left">
										<input type="text">
									</div>
								</div>
							</div>
							<div class="row mb-10">
								<div class="col-30 text-right">County</div>
								<div class="col-70">
									<div class="form-field text-left">
										<input type="text">
									</div>
								</div>
							</div>
							<div class="row mb-10">
								<div class="col-30 text-right"></div>
								<div class="col-70">
									<div class="form-field text-left">
										<input type="checkbox" name="tandc" id="tandc"> <label for="tandc">I accept the terms & conditions</label><br/>
										<input type="checkbox" name="eSubs" id="eSubs"> <label for="eSubs">I want to receive promotional emails</label><br/>
										<input type="checkbox" name="smsSubs" id="smsSubs"> <label for="smsSubs">I want to receive promotional SMS</label>
									</div>
								</div>
							</div>
							<div class="row">
								<button class="reg-btn" @click="register()">Register</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div class="col-40">
				<div class="card">
					<div class="card-header">Already a member? Sign in here</div>
					<div class="card-body">
						<form>
							<div class="row mb-10">
								<div class="col-30 text-right">Email</div>
								<div class="col-70">
									<div class="form-field text-left">
										<input type="text">
									</div>
								</div>
							</div>
							<div class="row mb-10">
								<div class="col-30 text-right">Password</div>
								<div class="col-70">
									<div class="form-field text-left">
										<input :type="showLoginPwd?'text':'password'">
										<span class="append-icon"><i @click="showLoginPwd=!showLoginPwd" class="fa fa-eye"></i></span>
										<p class="hint--text">Forgot Password</p>
									</div>
								</div>
							</div>
							<div class="row">
								<button class="reg-btn" @click="register()">Sign in</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div v-else>

		</div>
  </div>
</template>

<style lang="scss" scoped>
.card{
	text-align: center;
	margin-top: 30px;
	background-image: url('https://www.kockraco.co.uk/myimages/978/zpos-bg-Kockraco_WhiteBG3.jpg');
	border: 1px solid #fff;
	.card-header{
		background: #303034;
		color: #ffffff;
		font-weight: 800;
		padding: 30px 15px;
	}
	.card-body{
		padding: 15px;
		line-height: 1.6;
	}
}
.form-field{
	select, input{
		height: 30px;
		// display: flex;
		margin-left: 20px;
		border: 1px solid #ccc;
		color: #222;
		padding: 0 15px;
		border-radius: 5px;
		box-shadow: 0 1px 3px inset #ccc;
	}
	select{
		width: 250px;
	}
	input{
		width: 220px;
	}
	input[type="checkbox"]{
		height: unset;
		width: unset;
		display: inline;
	}
	.hint--text{
		color: #777;
		font-size: 10px;
		margin-left: 20px;
		margin-top: 2px;
		text-transform: uppercase;
		letter-spacing: 0.8px;
	}
	.append-icon{
		position: relative;
		right: 25px;
		top: 2px;
		cursor: pointer;
	}
}
.mb-10{
	margin-bottom: 10px;
}
.text-left{
	text-align: left;
}
.reg-btn{
	color: #fff;
	background: #1E802E;
	border: 0;
	outline: 0;
	padding: 8px 16px;
	border-radius: 3px;
	cursor: pointer;
	margin: auto;
}
</style>

<script lang="ts">
import Vue from 'vue'
import OrangeLabelBanner from "../components/OrangeBanner.vue";
export default Vue.extend({
    components: {
      OrangeLabelBanner,
    },
	data(){
		return {
			showRegPwd: false,
			showLoginPwd: false,
			registered: false
		}
	},
	methods: {
		register: function(){
			localStorage.name = 'Mithunraj A';
			localStorage.registered = true;
			this.registered = true;
		},
	}
})
</script>