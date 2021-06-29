<template>
    <div class="close-till-section">
        <v-tabs v-model="closeTillTab" class="px-3">
            <v-tab>Summary</v-tab>
            <v-tab>Sales</v-tab>
        </v-tabs>
        <v-tabs-items v-model="closeTillTab" class="grey lighten-4">
            <v-tab-item>
                <v-row no-gutters>
                    <v-col cols="12" sm="7" class="pa-3">
                        <v-card>
                            <v-card-title class="elevation-1 py-2">Till</v-card-title>
                            <v-card-text class="pt-3">
                                <div>Opened By: Benjamin</div>
                                <div>Date Time: JUN 17, 2021 09:45AM</div>
                            </v-card-text>
                            <v-card-actions class="pa-0">
                                <v-btn block large class="primary rounded-0">Close</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                    <v-col cols="12" sm="5" class="pa-3">
                        <v-card>
                            <v-card-title class="elevation-1 py-2">Summary</v-card-title>
                            <v-card-text class="pt-3">
                                <v-row no-gutters>
                                    <v-col cols="8">Transactions</v-col>
                                    <v-col cols="4" class="text-right">4</v-col>
                                    <v-col cols="8">Counted</v-col>
                                    <v-col cols="4" class="text-right">0</v-col>
                                    <v-col cols="8">Takings</v-col>
                                    <v-col cols="4" class="text-right">2316</v-col>
                                    <v-col cols="8">Float</v-col>
                                    <v-col cols="4" class="text-right">500</v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" sm="7" class="pa-3">
                        <v-card>
                            <v-card-title class="elevation-1 py-2">Cashup</v-card-title>
                            <v-card-text class="pa-0 pt-3">
                                <v-simple-table dense>
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th>Tender</th>
                                                <th>Counted</th>
                                                <th>Expected</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item,key) in cashupList" :key="key">
                                                <td>{{item.tender}}</td>
                                                <td>{{item.counted}} <v-icon v-if="item.tender!=='Float'" right>mdi-pencil-box-outline</v-icon></td>
                                                <td>{{item.expected}}</td>
                                            </tr>
                                            <tr class="primary--text">
                                                <td>Total</td>
                                                <td>{{cashupList[0].counted + cashupList[1].counted + cashupList[2].counted}}</td>
                                                <td>{{cashupList[0].expected + cashupList[1].expected + cashupList[2].expected + cashupList[3].expected}}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" sm="5" class="pa-3">
                        <v-card>
                            <v-card-title class="elevation-1 py-2">Float</v-card-title>
                            <v-card-text class="pt-3">
                                <v-row no-gutters>
                                    <v-col cols="8">Cash Flow</v-col>
                                    <v-col cols="4" class="text-right"></v-col>
                                    <v-col cols="8">Opening Balance</v-col>
                                    <v-col cols="4" class="text-right"></v-col>
                                    <v-col cols="8">Petty Cash</v-col>
                                    <v-col cols="4" class="text-right"></v-col>
                                    <v-col cols="8">Withdrawn</v-col>
                                    <v-col cols="4" class="text-right"></v-col>
                                    <v-col cols="8">Deposit</v-col>
                                    <v-col cols="4" class="text-right"></v-col>
                                    <v-col cols="8" class="primary--text">Closing Balance</v-col>
                                    <v-col cols="4" class="primary--text text-right"></v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-tab-item>
            <v-tab-item>
                <v-row no-gutters>
                    <v-col cols="12" class="px-3 pt-3">
                        <v-card>
                            <v-card-title class="elevation-1 py-2">Sales Breakdown</v-card-title>
                            <v-card-text class="pa-0 pt-3">
                                <v-simple-table dense>
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>Quantity</th>
                                                <th>Discount</th>
                                                <th>Average</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{{salesSummaryList.type}}</td>
                                                <td>{{salesSummaryList.quantity}}</td>
                                                <td>{{salesSummaryList.discount}}</td>
                                                <td>{{salesSummaryList.average}}</td>
                                                <td>{{salesSummaryList.total}}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" class="px-3 pt-3">
                        <v-card>
                            <v-card-title class="elevation-1 py-2">Sales By Product Breakdown</v-card-title>
                            <v-card-text class="pa-0 pt-3">
                                <v-simple-table dense>
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Quantity</th>
                                                <th>Discount</th>
                                                <th>Net</th>
                                                <th>Tax</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item,key) in salesByProductSummaryList" :key="key">
                                                <td>{{item.product}}</td>
                                                <td>{{item.quantity}}</td>
                                                <td>{{item.discount}}</td>
                                                <td>{{item.net}}</td>
                                                <td>{{item.tax}}</td>
                                                <td>{{item.total}}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12"></v-col>
                </v-row>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data:()=>({
        closeTillTab: null,
        cashupList: [
            {tender:'Cash',counted:0,expected:2188},
            {tender:'Debit Card',counted:0,expected:128},
            {tender:'Sub Total',counted:0,expected:2316},
            {tender:'Float',counted:'-',expected:500},
        ],
        salesSummaryList: {type:'Product 1',quantity:1,discount:0,average:1380,total:1380},
        salesByProductSummaryList: [
            {product:'Product 1',quantity:1,discount:0,net:1200,tax:180,total:1380},
            {product:'Product 1',quantity:1,discount:0,net:1200,tax:180,total:1380},
            {product:'Product 1',quantity:1,discount:0,net:1200,tax:180,total:1380},
            {product:'Product 1',quantity:1,discount:0,net:1200,tax:180,total:1380},
            {product:'Product 1',quantity:1,discount:0,net:1200,tax:180,total:1380},
            {product:'Product 1',quantity:1,discount:0,net:1200,tax:180,total:1380},
            {product:'Product 1',quantity:1,discount:0,net:1200,tax:180,total:1380},
            {product:'Product 1',quantity:1,discount:0,net:1200,tax:180,total:1380}

        ]
    }),
})
</script>