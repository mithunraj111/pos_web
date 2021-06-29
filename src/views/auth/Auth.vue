<template>
  <div class="auth">
    <v-card v-if="signup" elevation="0">
      <v-card-title class="text-center justify-center title">
          <div>WELCOME<br/>
            <div class="grey--text body-1">Let's get you started with a <div>Business Management Account</div></div>
          </div>
      </v-card-title>
      <v-card-text>
        <v-text-field hide-details class="mb-3" label="Username"></v-text-field>
        <v-text-field hide-details class="mb-3" label="Email"></v-text-field>
        <v-text-field hide-details class="mb-3" label="Phone"></v-text-field>
        <v-text-field hide-details class="mb-5" label="Password"></v-text-field>
        <v-btn color="primary" block class="secondary--text" @click="auth('register')">SUBMIT</v-btn>
        <div class="caption text-center mt-5" @click="signup=false">Already have an account? <a class="font-weight-bold">LOGIN HERE</a></div>
      </v-card-text>
    </v-card>
    <v-card v-else elevation="0">
      <v-card-title class="text-center justify-center title">
          <div>Log in<br/>
            <div class="grey--text body-1">to your Business <div>Management Account</div></div>
          </div>
      </v-card-title>
      <v-card-text>
        <v-text-field hide-details class="mb-3" label="Email"></v-text-field>
        <v-text-field hide-details label="Password"></v-text-field>
        <a class="caption float-right mt-2 mb-3">FORGOT PASSWORD?</a>
        <v-btn color="primary" block class="secondary--text" @click="auth('login')">SUBMIT</v-btn>
        <div class="caption text-center mt-5" @click="signup=true">New here? <a class="font-weight-bold">REGISTER A NEW ACCOUNT</a></div>
      </v-card-text>
    </v-card>
    <v-dialog v-model="changeFloatDialog" width="300" max-width="90%" persistent>
      <v-card>
        <v-card-title>Enter Float Amount</v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" class="mb-3">
              <v-text-field label="Float Amount" v-model="floatAmount" outlined dense hide-details></v-text-field>
            </v-col>
            <v-col cols="4" v-for="n in 9" :key="n" class="px-3 py-2"><v-btn @click="enterAmount(n)" block>{{n}}</v-btn></v-col>
            <v-col class="px-3 py-2"><v-btn block @click="enterAmount('.')">.</v-btn></v-col>
            <v-col class="px-3 py-2"><v-btn block @click="enterAmount('0')">0</v-btn></v-col>
            <v-col class="px-3 py-2"><v-btn block @click="enterAmount('backspace')"><v-icon>mdi-backspace-outline</v-icon></v-btn></v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-0">
          <v-row no-gutters>
            <v-col cols="12"><v-btn x-large block class="rounded-0 primary" @click="changeFloatDialog=false;auth('register')" >Continue</v-btn></v-col>
            <v-col cols="12"><v-btn x-large block class="rounded-0">Cancel</v-btn></v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.auth{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  .v-card{ 
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 350px;
    max-width: 90%;
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import VueRouter from 'vue-router'

export default Vue.extend({
  data: () => {
    return {
      signup: false,
      changeFloatDialog: false,
      floatAmount: 0 as any
    }
  },
  methods: {
    auth: function (type: string){
      if(type == 'register'){
        this.$router.push({ name: 'Home' })
      } else{ 
        this.changeFloatDialog = true;
      }
    },
    enterAmount: function(input:any){
      if(input=='backspace'){
          if(this.floatAmount.length < 2){
              this.floatAmount = '0';
          } else {
              this.floatAmount = this.floatAmount.slice(0, -1);
          }
      } else {
          this.floatAmount = this.floatAmount=='0'?input:this.floatAmount.toString()+input
      }
    },
  }
})
</script>