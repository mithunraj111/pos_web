<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" src="./app.ts"></script>

<style lang="scss">
html{
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}
.v-app-bar.v-app-bar--fixed {
  min-height: calc(48px + env(safe-area-inset-top))!important;
  padding-top: env(safe-area-inset-top);
}
.v-navigation-drawer--fixed {
  top: env(safe-area-inset-top)!important;
  height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important;
}
.v-overlay {
  margin-top: env(safe-area-inset-top)!important;
}
</style>