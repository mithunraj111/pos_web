<template>
    <div class="settings-section">
        <v-row no-gutters align="center">
            <v-col cols="12" md="4" class="pa-3">
                <v-card>
                    <v-card-title>Users <v-spacer></v-spacer> <v-icon>mdi-plus-box-outline</v-icon></v-card-title>
                    <v-card-text class="pa-0">
                        <v-simple-table dense>
                            <thead>
                                <tr><th>Name</th><th>Role</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                                <tr v-for="(user,key) in userList" :key="key">
                                    <td>{{user.name}}</td>
                                    <td>{{user.role}}</td>
                                    <td>
                                        <v-icon small left>mdi-eye</v-icon>
                                        <v-icon small left>mdi-pencil</v-icon>
                                        <v-icon small>mdi-delete</v-icon>
                                    </td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data: ()=> ({
        userList: [
            {name: 'Karthik Kannan', role: 'Admin'}
        ]
    })
})
</script>