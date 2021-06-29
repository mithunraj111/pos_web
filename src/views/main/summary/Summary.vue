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
                <v-data-table :headers="summaryTableHeaders" :items="summaryList"  disable-pagination hide-default-footer></v-data-table>
            </v-col>
        </v-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data: () => ({
        transactionStatus:['Completed', 'Failed', 'On Hold'],
        startDateToggle: false,
        startDate: new Date().toISOString().substr(0, 10),
        endDateToggle: false,
        endDate: new Date().toISOString().substr(0, 10),
        summaryTableHeaders: [
            {text:'Order Id',value:'orderId'},
            {text:'Amount',value:'amount'},
            {text:'Date Time',value:'dateTime'},
            {text:'Status',value:'status'},
            {text:'Action',value:'action'},
        ],
        summaryList:[
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'},
            {orderId:'OrderID123', amount: 2012,dateTime:'Jul 07, 1997', status:'Paid'}
        ]
    })
})
</script>