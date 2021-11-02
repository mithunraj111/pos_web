<template>
    <div>
		<OrangeLabelBanner />
        <div class="order-section container" style="display:flex;justify-content:center;margin:50px auto">
            <div class="col-70">
                    <div class="menu-section" style="margin-right:10px">
                        <div class="menu-header">{{selectedCategory.categoryname}}</div>
                        <div class="menu-content">
                            <div class="category-list col-30">
                                <div class="category-list-item" :class="selectedCategory.categoryid==item.categoryid?'category-list-item-active':''" v-for="(item, key) in categoryListTemp" :key="key" @click="selectCategory(item);">{{item.categoryname}}</div>
                            </div>
                            <div class="product-list col-70">
                                <div class="product-list-item" v-for="(item, key) in productListTemp" :key="key">
                                    <div class="col-70">
                                        <h5>{{item.productname}}</h5>
                                        <!-- <p>{{'item.description'}}</p> -->
                                    </div>
                                    <div class="col-30">
                                        <div v-if="item.isvariable" style="width:100%">
                                            <div v-for="(variantItem,key) in item.variance" :key="key" style="margin:10px auto">
                                                <div class="col-60" style="display:inline-flex;align-items:center">
                                                    <span style="font-size:12px">>></span>&nbsp;{{variantItem.name}}
                                                </div>
                                                <div class="col-40 text-right"> £{{variantItem.amount}}</div>
                                            </div>
                                        </div>
                                        <div v-else class="text-right">
                                            £{{item.price}}
                                            <button @click="addToCart(item)"><i class="fa fa-plus"></i>{{item.qty}}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
            </div>
            <div class="col-30">
                <div class="menu-section">
                    <div class="menu-header">In cart
                        <select v-model="diningId">
                            <option value="1">Dine in</option>
                            <option value="2">Take Away</option>
                            <option value="3">Delivery</option>
                        </select>
                    </div>
                    <div class="menu-content" style="padding:10px">
                        <table width="100%">
                            <thead>
                                <tr>
                                    <th class="text-left">Qty</th>
                                    <th class="text-left">Product</th>
                                    <th class="text-left">Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody v-if="itemsInCart.length > 0">
                                <tr v-for="item,key in itemsInCart" :key="key">
                                    <td style="padding:10px 0">{{item.qty}}*</td>
                                    <td style="padding:10px 0">{{item.productname}}</td>
                                    <td style="padding:10px 0">{{item.total}}</td>
                                    <td style="padding:10px 0"><button class="icon"><i class="fa fa-pencil"></i></button></td>
                                </tr>
                                <tr>
                                    <td colspan="2">Total</td>
                                    <td>{{cartTotal}}</td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr><td colspan="4" class="text-center" style="padding:10px 0">Place your order</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="row">
                        <button class="col-50 order-btn" @click="placeOrder()">Order</button>
                        <button class="col-50 order-btn invert" @click="clearCart()">Clear</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.menu-header{
    background-color: #d17c19;
    color: #ffffff;
    padding: 15px;
    text-transform: uppercase;
    font-size: 18px;
}
.menu-content{
    display: flex;
    background-image: url('https://www.kockraco.co.uk/myimages/978/zpos-bg-Kockraco_WhiteBG3.jpg');
}
.category-list-item {
    background: #303034;
    color: #ffffff;
    padding: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    &.category-list-item-active{
        background-color: #d17c19;
        border-right: 3px solid #000000;
    }
}
.order-btn{
    padding: 10px 0;
    border-width: 0;
    background: #d17c19;
    color: #fff;
}
.order-btn.invert{
    background: #fff;
    color: #000;
}
.product-list{
    padding: 10px;
    padding-right: 20px;
}
.category-list{
    padding: 10px;
}
.product-list-item{
    margin-bottom: 10px;
    padding-bottom: 10px;
    display: flex;
    border-bottom: 1px dashed #ccc;
    .col-70, .col-30{
        padding-top: 10px;
    }
    .col-30{
        display: flex;
        align-self: center;
        justify-content: flex-end;
    }
    h5{
        padding-bottom: 10px;
        font-size: 18px;
        font-weight: 800;
    }
}
</style>
<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

import OrangeLabelBanner from "../components/OrangeBanner.vue";
export default Vue.extend({
    components: {
      OrangeLabelBanner,
    },
    data(){
        return {
            selectedCategory: {} as any,
            itemsInCart: []as any,
            productList: []as any,
            productListTemp: []as any,
            categoryList: []as any,
            categoryListTemp: []as any,
            cartTotal: 0 as any,
            diningId: 1 as any
        }
    },
    mounted(){
        this.getProductCategory()
    },
    methods:{
        getProductCategory:function (){
            axios.get('http://localhost:5000/api/category_product/getcategoryproduct').then((response:any) => {
                this.productList = this.productListTemp = response.data.recordsets[1];
                this.categoryList = this.categoryListTemp = response.data.recordsets[0];
                this.selectCategory(this.categoryListTemp[0]);
                // this.unmappedProductList = this.productList.filter((i:any)=>{
                //     return i.categoryid == '';
                // })
            }).catch((err:any)=>{
                // this.showHideAlert('danger', 'Internal Server error');
                console.log(err);
            })
        },
        selectCategory: function(obj:any){
            this.selectedCategory = obj;
            this.productListTemp = this.productList.filter((i:any)=>{
                return i.categoryid == obj.categoryid;
            })
        },
        addToCart: function(obj:any){
            let productIndex= this.itemsInCart.findIndex((element)=>element.productid === obj.productid)
            this.cartTotal+= obj.price; 
            if(productIndex < 0){
                obj.qty = 1;
                obj.total = obj.price;
                obj.mcp = [];
                obj.orderedproductid = "";
                obj.orderid = "";
                this.itemsInCart.push(obj);
            } else {
                obj = this.itemsInCart[productIndex];
                this.itemsInCart.splice(productIndex,1)
                obj.qty = obj.qty+1;
                obj.total = obj.qty * obj.price;
                this.itemsInCart.push(obj);
            }
        },
        placeOrder: function(){
            let apiUrl = 'http://localhost:5000/api/order/createorder';
            let requestObj = {}as any;
            this.orderStatus = 1;
            // Dine in 1, takeaway 2, delivery 3
            // order 1, delete 2, pending 3, hold 4, payment 5
            requestObj={
                customerid: "",    
                customeraccid: "",
                qty: 1,
                fromorder: 'WEBSITE',
                total: this.cartTotal,
                diningid: this.diningId,
                paymentmethod: this.paymentMethod,
                orderid: "",
                orderstatus: this.orderStatus,
                orderedproduct: this.itemsInCart
            };
            console.log(requestObj);
            // return 0;
            axios.post(apiUrl, requestObj).then((response)=>{
                this.clearCart();
                let msg = '';
                if(this.orderStatus == '1'){
                    msg = 'Order placed successfully.';
                } else if(this.orderStatus == '4'){
                    msg = 'Order placed on hold successfully.';
                } else if(this.orderStatus == '5'){
                    msg = 'Payment successful';
                }
                this.showHideAlert('success',msg);
            }).catch((err:any)=>{
                this.showHideAlert('danger', 'Internal Server error');
                console.log(err);
            })
        },
        clearCart: function(){
            this.itemsInCart = [];
        },
    }
})
</script>