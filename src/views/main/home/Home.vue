<template>
    <div class="home-section">
        <v-row>
            <v-col cols="12" class="hidden-md-and-up pb-0">
                <v-card>
                    <v-row no-gutters>
                        <v-col cols="6"><v-btn block large class="rounded-0" @click="activeTab='products'">Products</v-btn></v-col>
                        <v-col cols="6"><v-btn block large class="rounded-0" @click="activeTab='summary'">Summary</v-btn></v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="12" md="7" v-if="$vuetify.breakpoint.name=='md' || $vuetify.breakpoint.name=='lg' || $vuetify.breakpoint.name=='xl' || (activeTab == 'products')">
                <v-card>
                    <v-card-title class="pa-3 pt-4">
                        <v-row no-gutters align="center">
                            <v-icon v-if="!showCategory" @click="showCategory=true" left>mdi-arrow-left-bold-box-outline</v-icon>
                            {{showCategory?'Categories':'Products'}}
                            <v-spacer></v-spacer>
                            <v-text-field dense outlined hide-details append-icon="mdi-magnify" v-model="searchText" label="Search for Products" @click:append="searchProducts()"></v-text-field>
                        </v-row>
                        <!-- <v-row no-gutters v-if="showCategory">Categories</v-row> -->
                    </v-card-title>
                    <v-card-text v-if="!showCategory && selectedCategory.id">
                        <v-row no-gutters>
                            SELECTED CATEGORY: {{selectedCategory.name}}<v-icon small @click="unselectCategory()">mdi-close-box-outline</v-icon>
                        </v-row>
                    </v-card-text>
                    <v-row no-gutters style="max-height:calc(100vh - 175px);overflow:auto" v-if="showCategory">
                        <v-col class="pa-3" style="cursor:pointer;" cols="12" sm="3" @click="showCategory=false">
                            <v-img src="https://thumbs.dreamstime.com/b/black-mix-icon-category-class-hierarchy-logo-range-series-159893237.jpg" aspect-ratio="1">
                                <template v-slot:placeholder>
                                    <v-row class="fill-height ma-0" align="center" justify="center" >
                                        <v-progress-circular indeterminate ></v-progress-circular>
                                    </v-row>
                                </template>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-card-text v-bind="attrs" v-on="on" class="px-2 py-1 text-truncate card-name">
                                            <span>{{'All Categories'}}</span>
                                        </v-card-text>
                                    </template>
                                    <span>All Categories</span>
                                </v-tooltip>
                            </v-img>
                        </v-col>
                        <v-col class="pa-3" style="cursor:pointer;" cols="12" sm="3" v-for="(item,key) in categoryList" :key="key" @click="openProducts(item)">
                            <v-img :src="`https://picsum.photos/500/300?image=${key * 5 + 10}`" aspect-ratio="1">
                                <template v-slot:placeholder>
                                    <v-row class="fill-height ma-0" align="center" justify="center" >
                                        <v-progress-circular indeterminate ></v-progress-circular>
                                    </v-row>
                                </template>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-card-text v-bind="attrs" v-on="on" class="px-2 py-1 text-truncate card-name">
                                            <span>{{item.name}}</span>
                                        </v-card-text>
                                    </template>
                                    <span>{{item.name}}</span>
                                </v-tooltip>
                            </v-img>
                        </v-col>
                    </v-row>
                    <v-row no-gutters style="max-height:calc(100vh - 175px);overflow:auto" v-else>
                        <v-col class="pa-3" cols="12" sm="3" v-for="(item,key) in productList" :key="key">
                            <v-sheet color="#f0f0f0">
                                <v-img :src="`https://picsum.photos/500/300?image=${key * 5 + 10}`" aspect-ratio="1">
                                    <template v-slot:placeholder>
                                        <v-row class="fill-height ma-0" align="center" justify="center" >
                                            <v-progress-circular indeterminate></v-progress-circular>
                                        </v-row>
                                    </template>
                                    <v-btn class="rounded-0 float-right px-2" @click="addToCart(item)" min-width="20">
                                        <v-icon>mdi-cart</v-icon>
                                    </v-btn>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-card-text v-bind="attrs" v-on="on" class="px-2 py-1 text-truncate card-name">
                                                <span>{{item.name}}<br/>₹ {{item.price}}</span>
                                            </v-card-text>
                                        </template>
                                        <span>{{item.name}}</span>
                                    </v-tooltip>
                                </v-img>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="12" md="5" v-if="$vuetify.breakpoint.name=='md' || $vuetify.breakpoint.name=='lg' || $vuetify.breakpoint.name=='xl' || (activeTab == 'summary')">
                <v-card>
                    <v-card-title>Order</v-card-title>
                    <v-card-text>
                        <v-data-table :headers="orderListHeader" :items="itemsInCart" dense disable-pagination hide-default-footer class="elevation-1 mb-3">
                            <template v-slot:[`item.quantity`]="{ item }">
                                <v-icon small @click="changeQuantity(item,'minus')" :disabled="item.quantity<2">mdi-minus-box-outline</v-icon>
                                <span class="mx-1">{{item.quantity}}</span>
                                <v-icon small @click="changeQuantity(item,'plus')">mdi-plus-box-outline</v-icon>
                            </template>
                            <template v-slot:[`item.action`]="{ item }">
                                <v-icon small @click="editDiscountValue(item)">mdi-sale</v-icon>
                                <v-icon small @click="removeFromCart(item)" right>mdi-delete</v-icon>
                            </template>
                        </v-data-table>
                        <v-container>
                            <v-row align="center">
                                <v-col class="py-1 px-4" cols="6">Subtotal</v-col>
                                <v-col cols="6" class="py-1 px-4 text-right">{{cartSubTotal}}</v-col>
                            </v-row>
                            <v-row align="center">
                                <v-col class="py-1 px-4" cols="6">
                                    Discount
                                    <v-icon @click="editDiscountValue()" small right>mdi-pencil-box-outline</v-icon>
                                </v-col>
                                <v-col cols="6" class="py-1 px-4 text-right">
                                    <span>{{cartDiscount}}</span>
                                </v-col>
                            </v-row>
                            <v-row align="center" v-for="(taxItem,key) in taxList" :key="key">
                                <v-col class="py-1 px-4" cols="6">{{taxItem.taxName}}</v-col>
                                <v-col cols="6" class="py-1 px-4 text-right"><span>{{(cartSubTotal/100)*taxItem.taxPercent}}</span></v-col>
                            </v-row>
                            <v-row align="center">
                                <v-col class="py-1 px-4" cols="6">Total</v-col>
                                <v-col cols="6" class="py-1 px-4 text-right">{{cartTotal}}</v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-row no-gutters>
                            <v-col cols="4" class="pl-3 pr-1 pb-2">
                                <v-btn class="primary secondary--text" block :disabled="itemsInCart.length<1" @click="paymentDialog=true;balanceAmount=Number(tenderAmount)-cartTotal">Pay</v-btn>
                            </v-col>
                            <v-col cols="4" class="px-1 pb-2">
                                <v-btn class="primary secondary--text" block :disabled="itemsInCart.length<1">Hold</v-btn>
                            </v-col>
                            <v-col cols="4" class="pl-1 pr-3 pb-2">
                                <v-btn class="primary secondary--text" block :disabled="itemsInCart.length<1">Clear</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="paymentDialog" width="375" max-width="90%" persistent>
            <v-card>
                <v-card-title>
                    <v-icon left @click="paymentDialog=false">mdi-arrow-left-bold-box-outline</v-icon>
                    Payment<v-spacer></v-spacer>₹ {{cartTotal}}
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="6">
                            <div class="disabled-input align-center">
                                <label>Tender</label>
                                <span>{{tenderAmount}}</span>
                            </div>
                        </v-col>
                        <v-col cols="6">
                            <div class="disabled-input align-center">
                                <label>Balance</label>
                                <span>{{balanceAmount}}</span>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="9">
                            <v-row>
                                <v-col cols="4" v-for="n in 9" :key="n"><v-btn block class="pa-0" @click="enterAmount(n)">{{n}}</v-btn></v-col>
                                <v-col cols="4"><v-btn block class="pa-0" @click="enterAmount('.')">.</v-btn></v-col>
                                <v-col cols="4"><v-btn block class="pa-0" @click="enterAmount('0')">0</v-btn></v-col>
                                <v-col cols="4"><v-btn block class="pa-0" @click="enterAmount('backspace')"><v-icon>mdi-backspace-outline</v-icon></v-btn></v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="3">
                            <v-row>
                                <v-col cols="12"><v-btn block class="primary--text pa-0">50</v-btn></v-col>
                                <v-col cols="12"><v-btn block class="primary--text pa-0">100</v-btn></v-col>
                                <v-col cols="12"><v-btn block class="primary--text pa-0">250</v-btn></v-col>
                                <v-col cols="12"><v-btn block class="primary--text pa-0">2127</v-btn></v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="pb-5">
                    <v-row no-gutters>
                        <v-col cols="6" class="px-2">
                            <v-btn class="primary secondary--text" block @click="paymentDialog=false;confirmPayment('cash')">Cash</v-btn>
                        </v-col>
                        <v-col cols="6" class="px-2">
                            <v-btn class="primary secondary--text" block @click="getPayemntMethod()">Others</v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="paymentMethodDialog" width="300" max-width="90%" persistent>
            <v-card>
                <v-row no-gutters>
                    <v-col cols="12"><v-btn large block class="rounded-0 primary--text" @click="paymentMethodDialog=false;confirmPayment('debit')">Payment option</v-btn></v-col>
                    <v-col cols="12"><v-btn large block class="rounded-0 primary--text" @click="paymentMethodDialog=false;confirmPayment('credit')">Payment option</v-btn></v-col>
                </v-row>
            </v-card>
        </v-dialog>
        <v-dialog v-model="confirmPaymentDialog" width="300" max-width="90%" persistent>
            <v-card>
                <v-card-title>Are you sure to complete the payment?</v-card-title>
                <v-row no-gutters>
                    <v-col cols="12"><v-btn large block class="primary secondary--text rounded-0" >Continue</v-btn></v-col>
                    <v-col cols="12"><v-btn large block class="primary--text rounded-0" @click="confirmPaymentDialog=false;paymentDialog=true;">Change Payment Method</v-btn></v-col>
                    <v-col cols="12"><v-btn large block class="rounded-0" @click="confirmPaymentDialog=false">Cancel</v-btn></v-col>
                </v-row>
            </v-card>
        </v-dialog>
        <v-dialog v-model="discountEditDialog" width="300" max-width="90%" persistent>
            <v-card>
                <v-card-title>Enter discount value.</v-card-title>
                <v-card-text>
                    <v-select :items="['Percentage','Amount']" v-model="discountType" label="Discount type" outlined dense hide-details></v-select>
                    <v-text-field v-model="discountTemp" outlined dense hide-details label="Discount value" class="mt-3"></v-text-field>
                </v-card-text>
                <v-card-actions class="pa-0">
                    <v-row no-gutters>
                        <v-col cols="12"><v-btn class="rounded-0 primary secondary--text" large block @click="saveDiscountValue()">Apply discount</v-btn></v-col>
                        <v-col cols="12"><v-btn class="rounded-0" large block @click="discountEditDialog=false">Cancel</v-btn></v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script src="./home.ts" lang="ts"></script>

<style lang="scss">
.card-name{
    position: absolute;
    bottom: 0;
    color: #fff;
    background: #00000075;
}
.disabled-input{
    max-width: 100%;
    min-height: 40px;
    border-radius: 4px;
    border: 1px solid rgba(0,0,0,0.42);
    padding: 0 12px;
    position: relative;
    display: flex;
    cursor: pointer;
    label{ 
        position: absolute;
        left: -4px; 
        right: auto; 
        margin: 4px;
        padding: 0 4px;
        background: #fff;
        transform: translateY(-16px) scale(0.75);
    }
    span{
        margin-top: 2px;
    }
}
// .home-section .v-data-table tr{
//     td,th{
//         &:nth-child(1){width:100%};
//         &:nth-child(2),&:nth-child(3),&:nth-child(4){
//             min-width: 65px;
//             width: 60px;
//             padding: 0 10px;
//         }
//         &:nth-child(2){padding: 0 10px;}
//         &:nth-child(3){padding: 0;}
//         &:nth-child(4){padding-left: 0;}
//     }
// }
</style>