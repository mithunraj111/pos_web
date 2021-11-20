<template>
  <div>
    <v-app-bar clipped-left app dense elevation="0">
      <span class="primary--text lighten-4 font-weight-medium" style="letter-spacing: 1px;font-size: 12px">
        <span class="primary--text font-weight-black">B</span>USINESS&nbsp;
        <span class="primary--text font-weight-black">M</span>ANAGEMENT
      </span>
      <v-spacer></v-spacer>
      <v-btn class="hidden-md-and-up" icon @click="menuSidebar=!menuSidebar"><v-icon>mdi-menu</v-icon></v-btn>
      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item>
            <v-list-item-title><v-icon small left>mdi-battlenet</v-icon>Adjust Float</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="changeTheme();">
            <v-list-item-title><v-icon small left>mdi-theme-light-dark</v-icon>Theme</v-list-item-title>
          </v-list-item>
          <v-list-item @click="changePwdDialog=true">
            <v-list-item-title><v-icon small left>mdi-cog-outline</v-icon>Change Pin</v-list-item-title>
          </v-list-item>
          <v-list-item to="/auth" link>
            <v-list-item-title><v-icon small left>mdi-logout</v-icon>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer app clipped :permanent="checkIfPermanent" :mini-variant="true" v-model="menuSidebar" :style="checkIfPermanent?'top:48px!important':''">
      <v-list>
        <v-list-item v-for="(link,key) in navigationList" :key="key" :to="link.to" link>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">{{link.shape}}</v-icon>
            </template>
            <span>{{link.name}}</span>
          </v-tooltip>
        </v-list-item>
        <!-- <v-list-item to="/auth" link>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">mdi-logout</v-icon>
            </template>
            <span>Logout</span>
          </v-tooltip>
        </v-list-item> -->
      </v-list>
    </v-navigation-drawer>
    <div class="pa-3">
      <router-view></router-view>
    </div>
    <v-dialog v-model="changePwdDialog" width="300" max-width="90%">
      <v-card>
        <v-card-title>Change Password</v-card-title>
        <v-card-text>
          <v-text-field v-model="currentpwd" label="Enter Current Password" outlined dense hide-details></v-text-field>
          <v-text-field v-model="newpwd" label="Enter New Password" outlined dense hide-details class="my-3"></v-text-field>
          <v-text-field v-model="reenterpwd" label="Re-enter Password" outlined dense hide-details></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-0">
          <v-row no-gutters>
            <v-col cols="12"><v-btn block x-large class="rounded-0 primary" @click="changePwdDialog=false">Continue</v-btn></v-col>
            <v-col cols="12"><v-btn block x-large class="rounded-0" @click="changePwdDialog=false">Cancel</v-btn></v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Main",

  components: {
    //
  },

  data: ()=>{
    return {
      navigationList: [
        {name: 'Home', shape: 'mdi-home' , to: '/home'},
        {name: 'Summary', shape: 'mdi-information' , to: '/summary'},
        {name: 'Till', shape: 'mdi-cash-register' , to: '/close-till'},
        {name: 'Categories', shape: 'mdi-sitemap' , to: '/categories'},
        {name: 'Products', shape: 'mdi-archive' , to: '/products'},
        {name: 'Mcp', shape: 'mdi-archive' , to: '/mcp'},

      ],
      menuSidebar: false,
      changePwdDialog: false,
      currentpwd: '',
      newpwd: '',
      reenterpwd: '',
    }
  },
  computed: {
    checkIfPermanent: function() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return false
        case 'sm': return false
        case 'md': return true
        case 'lg': return true
        case 'xl': return true
      }
    }
  },
  methods:{
    changeTheme: function(){
        console.log(localStorage.theme);
        if(localStorage.theme && localStorage.theme == 'dark'){
          this.$vuetify.theme.dark = false;
          localStorage.theme = 'light';
        } else{
          this.$vuetify.theme.dark = true;
          localStorage.theme = 'dark';
        }
    }
  }

});
</script>

<style lang="scss">
.v-app-bar.v-sheet.theme--light {
  border-bottom: 1px solid rgba(0,0,0,0.12) !important;
  background-color: white !important;
}
.v-navigation-drawer__content {
  .v-list{
    padding: 0;
    .v-list-item--active {
      color: var(--v-primary-base);
    }
  }
}
.transparent-card {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px 16px;
}
</style>