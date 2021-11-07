<template>
    <div class="summary-section pa-3">
        <v-row justify="end" align="center">
            <v-col cols="12" sm="3">
                <v-select :items="transactionStatus" outlined dense hide-details label="Transaction Status"></v-select>
            </v-col>
            <v-col cols="12" sm="3">
                <v-menu v-model="startDateToggle">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="startDate" 
                            outlined dense hide-details
                            label="Start Date" readonly 
                            append-icon="mdi-calendar" 
                            v-bind="attrs" v-on="on">
                        </v-text-field>
                    </template>
                    <v-date-picker v-model="startDate" @input="startDateToggle = false"></v-date-picker>
                </v-menu>
            </v-col>
            <v-col cols="12" sm="3">
                <v-menu v-model="endDateToggle">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="endDate" 
                            outlined dense hide-details
                            label="End Date" readonly 
                            append-icon="mdi-calendar" 
                            v-bind="attrs" v-on="on">
                        </v-text-field>
                    </template>
                    <v-date-picker v-model="endDate" @input="endDateToggle = false"></v-date-picker>
                </v-menu>
            </v-col>
            <v-col cols="6" sm="1"><v-btn block>filter</v-btn></v-col>
            <v-col cols="6" sm="1"><v-btn block>Clear</v-btn></v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-data-table :headers="summaryTableHeaders" :items="summaryList" :server-items-length="totalRows" :loading="loading">
                    <template v-slot:[`item.diningId`]="{ item }">
                        <span>{{item.diningId=='1'?'Dine In':item.diningId=='2'?'Take Away':'Delivery'}}</span>
                    </template>
                    <template v-slot:[`item.orderstatus`]="{ item }">
                        <span>{{item.orderstatus=='1'?'Ordered':item.orderstatus=='2'?'Deleted':item.orderstatus=='3'?'Pending':item.orderstatus=='4'?'Hold':'Paid'}}</span>
                    </template>
                    <template v-slot:[`item.action`]="{ item }">
                        <v-btn icon @click="editOrderSummary(item)"><v-icon>mdi-pencil</v-icon></v-btn>
                        <v-btn icon @click="deleteOrderSummary(item)"><v-icon>mdi-delete</v-icon></v-btn>
                    </template>
                </v-data-table>
                <!-- <v-pagination v-model="page" :length="totalRows" :total-visible="5" @input="findEvent()"></v-pagination> -->
            </v-col>
        </v-row>
        <v-alert :value="showAlert" :type="alertType" border="left" transition="scale-transition" class="alertPos" >{{alertText}}</v-alert>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import axios from 'axios';
import store from '../../../store'
export default Vue.extend({
    data: () => ({
        env: store.state.env,
        transactionStatus:['Completed', 'Failed', 'On Hold'],
        startDateToggle: false,
        startDate: new Date().toISOString().substr(0, 10),
        endDateToggle: false,
        endDate: new Date().toISOString().substr(0, 10),
        summaryTableHeaders: [
            {text:'Order Id',value:'orderId', sortable: false},
            {text:'Quantity',value:'qty', sortable: false},
            {text:'Amount',value:'Total', sortable: false},
            {text:'Dining type',value:'diningId', sortable: false},
            {text:'Status',value:'orderstatus', sortable: false},
            {text:'Action',value:'action', sortable: false},
        ],
        summaryList:[]as any,
        showAlert: false,
        alertType: 'success' as any,
        alertText: ''as any,
        totalRows: 0 as any,
        page: 1,
        loading: true,
        options: {},
    }),
    methods: {
        getOrderSummary: function(){
            this.loading = true;
            axios.get(this.env+'order/getorders').then((response:any) => {
                this.summaryList = response.data.recordsets[0];
                this.totalRows = Math.ceil(response.data.recordsets[0].length/10);
                this.loading = false;
            }).catch((err:any)=>{
                this.loading = false;
                this.showHideAlert('danger', 'Internal Server error');
                console.log(err);
            })
        },
        editOrderSummary: function(obj:any){
            this.$router.push({name:'Home',query:{orderId: obj.orderId}});
        },
        deleteOrderSummary: function(obj:any){
            this.loading = true;
            let requestObj ={
                orderid: obj.orderId
            }
            axios.delete(this.env+'order/deleteorder',{data:requestObj}).then((response:any) => {
                // this.summaryList = response.data.recordsets[0];
                this.loading = false;
                this.showHideAlert('success','Order deleted successfully.');
            }).catch((err)=>{
                this.loading = false;
                this.showHideAlert('error', 'Internal Server error');
            })
        },
        findEvent: function(page:any){
            console.log(page)
        },
        showHideAlert: function(type:String, text:String){
            this.alertType = type;
            this.alertText = text;
            this.showAlert = true;
            setTimeout(() => {
               this.showAlert = false; 
            }, 3000);
        }
    },
    mounted(){
        this.getOrderSummary();
    },
    watch: {
        options: {
            handler(){this.getOrderSummary()},
            deep: true,
        },
    }
})
</script>