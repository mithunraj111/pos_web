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
                            <v-icon v-if="categoryType!='category'" @click="goToCategory()" left>mdi-arrow-left-bold-box-outline</v-icon>
                            {{categoryType!='products'?'Categories':'Products'}}
                            <v-spacer></v-spacer>
                            <v-text-field dense outlined hide-details append-icon="mdi-magnify" v-model="searchText" label="Search for Products" @click:append="searchProducts()"></v-text-field>
                        </v-row>
                    </v-card-title>
                    <v-card-text v-if="categoryType!='category' && selectedCategory.categoryid">
                        <v-row no-gutters>
                            SELECTED CATEGORY: {{selectedCategory.categoryname}}<v-icon small @click="unselectCategory()">mdi-close-box-outline</v-icon>
                        </v-row>
                    </v-card-text>
                    <v-row no-gutters style="max-height:calc(100vh - 175px);overflow:auto" v-if="categoryType!='products'">
                        <v-col cols="12">
                            <v-row no-gutters>
                                <v-col class="pa-3" style="cursor:pointer;" cols="12" md="4" lg="3" @click="categoryType='products'">
                                    <v-card min-height="100" color="primary">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-card-text v-bind="attrs" v-on="on" class="px-2 py-1 text-truncate secondary--text">
                                                    <span>{{'All Categories'}}</span>
                                                </v-card-text>
                                            </template>
                                            <span>All Categories</span>
                                        </v-tooltip>
                                    </v-card>
                                </v-col>
                                <v-col class="pa-3" style="cursor:pointer;" cols="12" md="4" lg="3" v-for="(item,key) in categoryListTemp" :key="key" @click="openProducts(item)">
                                    <v-card min-height="100" color="primary">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-card-text v-bind="attrs" v-on="on" class="px-2 py-1 text-truncate secondary--text">
                                                    <span>{{item.categoryname}}</span>
                                                </v-card-text>
                                            </template>
                                            <span>{{item.categoryname}}</span>
                                        </v-tooltip>
                                    </v-card>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <!-- <v-col class="pa-3" cols="12" md="4" lg="3" v-if="categoryType=='category'">
                                    <v-card min-height="100" @click="addMiscToCart()" class="cursor-pointer">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-card-text v-bind="attrs" v-on="on" class="px-2 py-1 text-truncate">
                                                    <span>Misc</span>
                                                </v-card-text>
                                                <v-card-text class="px-2 py-1 pos-bottom text-right">
                                                    <span>Variable pricing</span>
                                                </v-card-text>
                                            </template>
                                            <span>Misc</span>
                                        </v-tooltip>
                                    </v-card>
                                </v-col> -->
                                <v-col class="pa-3" cols="12" md="4" lg="3" v-for="(item,key) in unmappedProductList" :key="key">
                                    <v-card min-height="100" @click="checkToAdd(item)" class="cursor-pointer">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-card-text v-bind="attrs" v-on="on" class="px-2 py-1 text-truncate">
                                                    <span>{{item.productname}}</span>
                                                </v-card-text>
                                                <v-card-text class="px-2 py-1 pos-bottom text-right">
                                                    <span>₹ {{item.price}}</span>
                                                </v-card-text>
                                            </template>
                                            <span>{{item.productname}}</span>
                                        </v-tooltip>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row no-gutters style="max-height:calc(100vh - 175px);overflow:auto" v-else>
                        <v-col class="pa-3" cols="12" md="4" lg="3" v-for="(item,key) in productListTemp" :key="key">
                            <v-card min-height="100" @click="checkToAdd(item)" class="cursor-pointer">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-card-text v-bind="attrs" v-on="on" class="px-2 py-1 text-truncate">
                                            <span>{{item.productname}}<br/>₹ {{item.price}}</span>
                                        </v-card-text>
                                    </template>
                                    <span>{{item.productname}}</span>
                                </v-tooltip>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="12" md="5" v-if="$vuetify.breakpoint.name=='md' || $vuetify.breakpoint.name=='lg' || $vuetify.breakpoint.name=='xl' || (activeTab == 'summary')">
                <v-card>
                    <v-card-title>Order <v-spacer></v-spacer>
                        <v-select item-text="diningname" item-value="diningid" :items="diningOptions" v-model="diningId" label="Dining type" outlined dense hide-details></v-select>
                    </v-card-title>
                    <v-card-text>
                        <v-data-table :headers="orderListHeader" :items="itemsInCart" 
                        :single-expand="singleExpand"
                        :expanded.sync="expanded"
                        item-key="key"
                        show-expand
                        dense disable-pagination hide-default-footer class="elevation-1 mb-3">
                            <template v-slot:[`item.productname`]="{ item }">
                                <div class="my-3">{{item.productname}}</div>
                                <!-- <div v-for="(mcp,key) in item.mcp" :key="key"> -->
                                    <div style="white-space:nowrap" v-for="(selectedMcpProd, key) in item.mcpcart" :key="key">{{selectedMcpProd.qty+' '+selectedMcpProd.productname+' '+selectedMcpProd.price}}</div>
                                <!-- </div> -->
                            </template>
                            <template v-slot:[`item.quantity`]="{ item }">
                                <span class="mx-1">{{item.quantity}}</span>
                            </template>
                            <template v-slot:[`item.amount`]="{ item }">
                                {{item.price * item.quantity}}
                            </template>
                            <template v-slot:[`expanded-item`]="{ headers, item }">
                                <td :colspan="headers.length">
                                    <table style="width:100%">
                                        <tr>
                                            <td><v-icon @click="editNote(item)" right>mdi-pencil</v-icon></td>
                                            <td><v-icon right @click="editDiscountValue(item)">mdi-sale</v-icon></td>
                                            <td></td>
                                            <td class="text-center">
                                                <v-icon left @click="changeQuantity(item,'minus')" :disabled="item.quantity<2">mdi-minus-box-outline</v-icon>{{item.quantity}}
                                                <v-icon right @click="changeQuantity(item,'plus')">mdi-plus-box-outline</v-icon>
                                            </td>
                                            <td class="text-right"><v-icon @click="removeFromCart(item)" right>mdi-delete</v-icon></td>
                                        </tr>
                                        <tr v-if="item.notes">
                                            <td :colspan="headers.length">{{item.notes}}</td>
                                        </tr>
                                    </table>
                                </td>
                            </template>
                        </v-data-table>
                        <v-container>
                            <v-row align="center">
                                <v-col class="py-1 px-4" cols="6">Subtotal</v-col>
                                <v-col cols="6" class="py-1 px-4 text-right">{{cartSubTotal|toFixedNumb}}</v-col>
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
                            <!-- <v-row align="center" v-for="(taxItem,key) in taxList" :key="key">
                                <v-col class="py-1 px-4" cols="6">{{taxItem.taxName}}</v-col>
                                <v-col cols="6" class="py-1 px-4 text-right"><span>{{(cartSubTotal/100)*taxItem.taxPercent}}</span></v-col>
                            </v-row> -->
                            <v-row align="center">
                                <v-col class="py-1 px-4" cols="6">Total</v-col>
                                <v-col cols="6" class="py-1 px-4 text-right">{{cartTotal|toFixedNumb}}</v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-row no-gutters>
                            <v-col cols="3" class="pl-3 pr-1 pb-2">
                                <v-btn class="primary secondary--text" block :disabled="itemsInCart.length<1" @click="getUserData(1)">Order</v-btn>
                            </v-col>
                            <v-col cols="3" class="pl-3 pr-1 pb-2">
                                <v-btn class="primary secondary--text" block :disabled="itemsInCart.length<1" @click="paymentDialog=true;balanceAmount=Number(tenderAmount)-cartTotal">Pay</v-btn>
                            </v-col>
                            <v-col cols="3" class="px-1 pb-2">
                                <v-btn class="primary secondary--text" block :disabled="itemsInCart.length<1" @click="confirmPayment(4)">Hold</v-btn>
                            </v-col>
                            <v-col cols="3" class="pl-1 pr-3 pb-2">
                                <v-btn class="primary secondary--text" block :disabled="itemsInCart.length<1" @click="clearCart()">Clear</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="addMiscProductDialog" width="375" max-width="90%" persistent>
            <v-card>
                <v-card-title>Enter the value for the miscellaneous product</v-card-title>
                <v-card-text>
                    <v-row no-gutters>
                        <v-col class="px-5">
                            <v-text-field outlined dense v-model="miscPrice" label="Miscellaneous Price"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-row no-gutters>
                    <v-col cols="12"><v-btn large block class="primary secondary--text rounded-0" @click="addMiscProductDialog=false;addMiscToCart('cash')">Continue</v-btn></v-col>
                    <v-col cols="12"><v-btn large block class="rounded-0" @click="addMiscProductDialog=false">Cancel</v-btn></v-col>
                </v-row>
            </v-card>
        </v-dialog>
        <v-dialog v-model="addMcpToCartDialog" width="900" max-width="90%" persistent>
            <v-card>
                <v-btn icon class="float-right" @click="addMcpToCartDialog=false"><v-icon>mdi-close-box-outline</v-icon></v-btn>
                <v-card-title>
                    <v-row no-gutters>
                        <v-col v-for="(group,key) in groupListTemp" :key="key" class="pa-3" cols="3">
                            <v-card class="text-center" :class="selectedmcproductgroupindex==key?'primary secondary--text':''">{{group.groupname}}</v-card>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-row no-gutters>
                        <v-col cols="4" class="pa-3" v-for="(item,key) in selectedmcproductgroup.mcproductgroup" :key="key">
                            <v-card class="pa-3" @click="changemcproductQty('add',key,$event)">
                                <div>
                                    {{item.productname}}
                                    <span v-if="item.qty>0" class="float-right">
                                        <v-chip outlined>{{item.qty}}</v-chip>
                                        <v-btn icon @click="changemcproductQty('minus',key,$event)"><v-icon>mdi-minus-circle</v-icon></v-btn>
                                    </span>
                                </div>
                                <br>
                                <div class="text-right">{{item.price}}</div>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols="12">
                            <span v-if="selectedmcproductgroup.min==selectedmcproductgroup.max" >Please select {{selectedmcproductgroup.min}} item</span>
                            <span v-else-if="selectedmcproductgroup.min==0">Please select upto {{selectedmcproductgroup.max}} items</span>
                            <span v-else>Please select between {{selectedmcproductgroup.min}} and {{selectedmcproductgroup.max}} items</span>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-row no-gutters>
                    <v-col cols="6"><v-btn large block class="rounded-0" @click="changemcpgroupindex('previous')" :disabled="selectedmcproductgroupindex==0">Previous</v-btn></v-col>
                    <v-col v-if="groupListTemp.length-1!=selectedmcproductgroupindex" cols="6"><v-btn large block class="rounded-0" @click="changemcpgroupindex('next')" :disabled="selectedmcproductgroup.selectedCount<selectedmcproductgroup.min">Next</v-btn></v-col>
                    <v-col v-if="groupListTemp.length-1==selectedmcproductgroupindex" cols="6"><v-btn large block class="rounded-0" @click="changemcpgroupindex('continue')" v-if="groupListTemp.length-1==selectedmcproductgroupindex" :disabled="selectedmcproductgroup.selectedCount<selectedmcproductgroup.min">Continue</v-btn></v-col>
                </v-row>
            </v-card>
        </v-dialog>
        <v-dialog v-model="paymentDialog" width="375" max-width="90%" persistent>
            <v-card>
                <v-card-title>
                    <v-icon left @click="paymentDialog=false">mdi-arrow-left-bold-box-outline</v-icon>
                    Payment<v-spacer></v-spacer>₹ {{cartTotal|toFixedNumb}}
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="6">
                            <div class="disabled-input align-center">
                                <label>Tender</label>
                                <span>{{tenderAmount|toFixedNumb}}</span>
                            </div>
                        </v-col>
                        <v-col cols="6">
                            <div class="disabled-input align-center">
                                <label>Balance</label>
                                <span>{{balanceAmount|toFixedNumb}}</span>
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
                                <v-col cols="12"><v-btn block class="primary--text pa-0" @click="enterDefinedAmount('50')">50</v-btn></v-col>
                                <v-col cols="12"><v-btn block class="primary--text pa-0" @click="enterDefinedAmount('100')">100</v-btn></v-col>
                                <v-col cols="12"><v-btn block class="primary--text pa-0" @click="enterDefinedAmount('250')">250</v-btn></v-col>
                                <v-col cols="12"><v-btn block class="primary--text pa-0" @click="enterDefinedAmount(cartTotal)">{{cartTotal|toFixedNumb}}</v-btn></v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="pb-5">
                    <v-row no-gutters>
                        <v-col cols="6" class="px-2">
                            <v-btn class="primary secondary--text" block @click="paymentDialog=false;confirmPayment(5)">Cash</v-btn>
                        </v-col>
                        <v-col cols="6" class="px-2">
                            <v-btn class="primary secondary--text" block @click="paymentDialog=false;confirmPayment(5)">Others</v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- <v-dialog v-model="paymentMethodDialog" width="300" max-width="90%" persistent>
            <v-card>
                <v-row no-gutters>
                    <v-col cols="12"><v-btn large block class="rounded-0 primary--text" @click="paymentMethodDialog=false;confirmPayment('debit')">Payment option</v-btn></v-col>
                    <v-col cols="12"><v-btn large block class="rounded-0 primary--text" @click="paymentMethodDialog=false;confirmPayment('credit')">Payment option</v-btn></v-col>
                </v-row>
            </v-card>
        </v-dialog> -->
        <!-- <v-dialog v-model="confirmPaymentDialog" width="300" max-width="90%" persistent>
            <v-card>
                <v-card-title>Are you sure to complete the payment?</v-card-title>
                <v-row no-gutters>
                    <v-col cols="12"><v-btn large block class="primary secondary--text rounded-0" >Continue</v-btn></v-col>
                    <v-col cols="12"><v-btn large block class="primary--text rounded-0" @click="confirmPaymentDialog=false;paymentDialog=true;">Change Payment Method</v-btn></v-col>
                    <v-col cols="12"><v-btn large block class="rounded-0" @click="confirmPaymentDialog=false">Cancel</v-btn></v-col>
                </v-row>
            </v-card>
        </v-dialog> -->
        <v-dialog v-model="discountPerProductEditDialog" width="300" max-width="90%" persistent>
            <v-card>
                <v-card-title>Enter discount value.</v-card-title>
                <v-card-text>
                    <v-select :items="['Percentage','Amount']" v-model="discountPerProductType" label="Discount type" outlined dense hide-details></v-select>
                    <v-text-field v-model="discountPerProductTemp" outlined dense hide-details label="Discount value" class="mt-3"></v-text-field>
                </v-card-text>
                <v-card-actions class="pa-0">
                    <v-row no-gutters>
                        <v-col cols="12"><v-btn class="rounded-0 primary secondary--text" large block @click="saveDiscountPerProductValue()">Apply discount</v-btn></v-col>
                        <v-col cols="12"><v-btn class="rounded-0" large block @click="discountPerProductEditDialog=false">Cancel</v-btn></v-col>
                    </v-row>
                </v-card-actions>
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
        <v-dialog v-model="notesEditDialog" width="300" max-width="90%" persistent>
            <v-card>
                <v-card-title>Enter notes.</v-card-title>
                <v-card-text>
                    <v-textarea v-model="notesTemp" outlined dense hide-details label="Notes" no-resize></v-textarea>
                </v-card-text>
                <v-card-actions class="pa-0">
                    <v-row no-gutters>
                        <v-col cols="12"><v-btn class="rounded-0 primary secondary--text" large block @click="saveProductNotes()">Submit</v-btn></v-col>
                        <v-col cols="12"><v-btn class="rounded-0" large block @click="notesTemp='';notesEditDialog=false">Cancel</v-btn></v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="userDataDialog" width="400" max-width="90%" persistent>
            <v-card>
                <v-card-title>Customer information</v-card-title>
                <v-card-text>
                    <v-text-field dense hide-details outlined class="mb-3" label="First Name" v-model="cfname"></v-text-field>
                    <v-text-field dense hide-details outlined class="mb-3" label="Last Name" v-model="clname"></v-text-field>
                    <v-text-field dense hide-details outlined class="mb-3" label="Phone" v-model="cphone"></v-text-field>
                    <v-text-field dense hide-details outlined class="mb-3" label="Email" v-model="cmail"></v-text-field>
                    <v-text-field dense hide-details outlined class="mb-3" label="Address line 1" v-model="cadd"></v-text-field>
                    <v-text-field dense hide-details outlined class="mb-3" label="Address line 2" v-model="cadd2"></v-text-field>
                    <v-text-field dense hide-details outlined class="mb-3" label="Postal Code" v-model="cpostcode"></v-text-field>
                </v-card-text>
                <v-card-actions class="pa-0">
                    <v-row no-gutters>
                        <v-col cols="12"><v-btn x-large block class="rounded-0 primary" @click="submitUserData();userDataDialog=false">Continue</v-btn></v-col>
                        <v-col cols="12"><v-btn x-large block class="rounded-0" @click="userDataDialog=false">Cancel</v-btn></v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- <v-alert :value="showAlert" transition="scale-transition">{{alertText}}</v-alert> -->
        <v-alert :value="showAlert" :type="alertType" border="left" transition="scale-transition" class="alertPos" >{{alertText}}</v-alert>
    </div>
</template>

<script src="./home.ts" lang="ts"></script>

<style lang="scss">

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
.pos-bottom{
    position: absolute;
    bottom: 0;
}
.alertPos{
    position: fixed!important;
    top: 50px;
    right: 10px;
}
.v-data-table tbody tr td{
    vertical-align: baseline;
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