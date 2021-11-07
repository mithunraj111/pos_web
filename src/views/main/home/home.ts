import Vue from 'vue'
import axios from 'axios';
import store from '../../../store'
export default Vue.extend({
    data:()=>({
        env: store.state.env,
        activeTab: 'products',
        categoryList: []as any,
        categoryListTemp:[]as any,
        productList: []as any,
        productListTemp:[]as any,
        unmappedProductList: []as any,
        showMiscProduct: true,
        miscPrice: ''as any,
        itemsInCart: []as any,
        orderListHeader: [
            {text:'Name', value:'productname', sortable: false},
            {text:'Price', value:'price', sortable: false},
            {text:'Quantity', value:'qty', sortable: false, align: 'center'},
            {text:'Amount', value:'total', sortable: false, align: 'right'}
        ],
        expanded: [],
        singleExpand: true,
        // taxList: [
        //     {taxId: '1', taxName: 'CGST', taxPercent: '5'},
        //     {taxId: '2', taxName: 'SGST', taxPercent: '5'}
        // ],
        cartSubTotal: 0,
        cartDiscount: 0,
        discountTemp: 0,
        discountPerProductTemp:0,
        discountValue: 0,
        discountPerProductValue: 0,
        discountType: '',
        discountPerProductType: '',
        cartTotal: 0,
        totalQty: 0,
        tenderAmount: '0',
        balanceAmount: 0,
        searchText: '',
        // taxEditFlag: false,
        categoryType: 'category',
        selectedCategory: {}as any,
        discountInPercent: false,
        paymentDialog: false,
        paymentMethodDialog: false,
        // confirmPaymentDialog: false,
        discountEditDialog: false,
        discountPerProductEditDialog: false,
        notesEditDialog: false,
        addMiscProductDialog: false,
        notesTemp: '',
        selectedObj: '' as any,
        diningId: 1,
        diningOptions: [
            {diningid: 1,diningname: 'Dine in'},
            {diningid: 2,diningname: 'Take away'},
            {diningid: 3,diningname: 'Delivery'}
        ],
        paymentMethod: ''as any,
        orderStatus: ''as any,
        showAlert: false,
        alertType: 'success' as any,
        alertText: ''as any,
    }),
    mounted(){
        this.getProductCategory();
        if(this.$route.query.orderId){
            this.getOrderDetail();
        }
    },
    methods:{
        getProductCategory:function (){
            axios.get(this.env+'category_product/getcategoryproduct').then((response:any) => {
                this.productList = this.productListTemp = response.data.recordsets[1];
                this.categoryList = this.categoryListTemp = response.data.recordsets[0];
                this.productList = this.productListTemp;
                this.categoryList = this.categoryListTemp;
                this.unmappedProductList = this.productList.filter((i:any)=>{return i.categoryid == ''})
            }).catch((err:any)=>{
                this.showHideAlert('danger', 'Internal Server error');
                console.log(err);
            })
        },
        getOrderDetail: function(){
            axios.get(this.env+'order/getorderedproduct',{params:{orderid:this.$route.query.orderId}}).then((response:any)=>{
                response.data.recordset.forEach((element:any) => {
                    console.log(element);
                    this.itemsInCart.push({
                        productid: element.productId,
                        productname: element.productName,
                        price: element.price,
                        qty: element.qty,
                        total: element.total,
                        orderid: element.orderId,
                        orderedproductid: element.orderProductId,
                        mcp: element.mcp
                    })
                    this.cartSubTotal += element.total;
                    console.log(this.cartSubTotal);
                    if(this.discountType == 'Percentage'){
                        this.cartDiscount = (this.cartSubTotal/100)*this.discountValue;
                    } else {
                        this.cartDiscount = this.discountValue;
                    }
                    this.cartTotal = Number(this.cartSubTotal) - Number(this.cartDiscount);
                });
                console.log(this.itemsInCart);
            }).catch((err:any)=>{
                this.showHideAlert('danger', 'Internal Server error');
                console.log(err);
            })
        },
        openProducts: function(obj:any){
            this.productListTemp = this.productList.filter((i:any)=>{
                console.log(i.categoryid);
                console.log(obj.categoryid);
                return i.categoryid == obj.categoryid;
            });
            console.log(this.productListTemp);
            this.selectedCategory = obj;
            this.categoryType = 'products';      
        },
        unselectCategory: function(){
            this.productListTemp = this.productList.filter((i:any)=>{
                return i.productname.toLowerCase().match(`${this.searchText.toLowerCase()}.*`);
            })
            this.unmappedProductList = this.productList.filter((i:any)=>{
                return i.categoryid == '';
            })
            this.selectedCategory = {};
        },
        goToCategory: function(){
            this.categoryListTemp = this.categoryList;
            this.categoryType = 'category';
            this.searchText = '';
            this.unmappedProductList = this.productList.filter((i:any)=>{
                return i.categoryid == '';
            })
        },
        searchProducts: function(){
            this.categoryType = 'products';
            this.productListTemp = this.productList.filter((i:any)=>{
                if(this.selectedCategory.categoryname){
                    return i.productname.toLowerCase().match(`${this.searchText.toLowerCase()}.*`) && (i.categoryid == this.selectedCategory.categoryid) ;
                } else {
                    return i.productname.toLowerCase().match(`${this.searchText.toLowerCase()}.*`);
                }
            })
        },
        addMiscToCart: function(){
            this.addMiscProductDialog = true;
        },
        addToCart: function(obj:any) {
            let isSelected = this.itemsInCart.find((item:any) => item.productid == obj.productid);
            if(isSelected){
                this.changeQuantity(obj,'plus');
                return;
            } else{
                obj.qty=1;
            }
            obj.orderedproductid = "";
            obj.orderid = "";
            obj.total = (obj.qty * obj.price).toFixed(2);
            obj.mcp = [];
            this.itemsInCart.push(obj);
            this.cartSubTotal += obj.price;
            if(this.discountType == 'Percentage'){
                this.cartDiscount = (this.cartSubTotal/100)*this.discountValue;
            } else {
                this.cartDiscount = this.discountValue;
            }
            this.cartTotal = Number(this.cartSubTotal) - Number(this.cartDiscount);
            // this.cartTotal = Number(this.cartSubTotal) - Number(this.cartDiscount) + taxAmount;
        },
        removeFromCart: function(obj:any){
            this.changeQuantity(obj,'remove');
            this.itemsInCart = this.itemsInCart.filter((i:any) =>{
                return i.productid != obj.productid
            })
        },
        changeQuantity: function(obj:any, type:any){
            for(let i=0;i<this.itemsInCart.length;i++){
                if(this.itemsInCart[i].productid == obj.productid){
                    if(type =='minus'){
                        this.itemsInCart[i].qty=this.itemsInCart[i].qty - 1;
                        this.itemsInCart[i].total = (this.itemsInCart[i].qty * this.itemsInCart[i].price).toFixed(2);
                    } else if (type=='plus') {
                        this.itemsInCart[i].qty=this.itemsInCart[i].qty + 1;
                        this.itemsInCart[i].total = (this.itemsInCart[i].qty * this.itemsInCart[i].price).toFixed(2);
                    }
                    console.log(this.itemsInCart[i]);
                    break;
                }
            }
            if(type=='minus'){
                this.cartSubTotal = Number(this.cartSubTotal) - Number(obj.price);
            }else if(type=="remove"){
                this.cartSubTotal = Number(this.cartSubTotal) - Number(obj.total);
            }else{
                console.log('else');
                this.cartSubTotal = Number(this.cartSubTotal) + Number(obj.price);
            }
            // let taxAmount = 0;
            // this.taxList.forEach((element:any) => {
            //     taxAmount += (Number(this.cartSubTotal)/100) * Number(element.taxPercent);
            // });
            if(this.discountType == 'Percentage'){
                this.cartDiscount = (this.cartSubTotal/100)*this.discountValue;
            } else {
                this.cartDiscount = this.discountValue;
            }
            // this.cartTotal = Number(this.cartSubTotal) - Number(this.cartDiscount) + taxAmount;
            this.cartTotal = Number(this.cartSubTotal) - Number(this.cartDiscount);
        },
        editDiscountValue: function(obj:any){
            if(obj){
                this.selectedObj = obj;
                this.discountPerProductTemp = this.cartDiscount;
                this.discountPerProductEditDialog = true;
            } else {
                this.discountTemp = this.cartDiscount;
                this.discountEditDialog = true;
            }
        },
        saveDiscountValue: function(){
            this.discountValue = this.discountTemp;
            
            if(this.discountType == 'Percentage'){
                this.cartDiscount = (this.cartSubTotal/100)*this.discountValue;
            } else {
                this.cartDiscount = this.discountValue;
            }
            // let taxAmount = 0;
            // this.taxList.forEach((element:any) => {
            //     taxAmount += (Number(this.cartSubTotal)/100) * Number(element.taxPercent);
            // });
            // this.cartTotal = Number(this.cartSubTotal) - Number(this.cartDiscount) + taxAmount;
            this.cartTotal = Number(this.cartSubTotal) - Number(this.cartDiscount);
            this.discountEditDialog = false;
        },
        saveDiscountPerProductValue: function(){
            this.discountPerProductValue = this.discountPerProductTemp;
            let index = this.itemsInCart.findIndex((i:any)=> i.productid ==this.selectedObj.productid)
            this.itemsInCart[index].discountType = this.discountPerProductType;
            let itemAmount = this.itemsInCart[index].price * this.itemsInCart[index].qty;
            if(this.discountPerProductType == 'Percentage'){
                this.itemsInCart[index].discountValue = this.discountPerProductTemp;
                this.cartDiscount = (this.cartSubTotal/100)*this.discountValue;
            } else {
                this.cartDiscount = this.discountValue;
            }
            // let taxAmount = 0;
            // this.taxList.forEach((element:any) => {
            //     taxAmount += (Number(this.cartSubTotal)/100) * Number(element.taxPercent);
            // });
            this.cartTotal = Number(this.cartSubTotal) - Number(this.cartDiscount);
            this.discountEditDialog = false;
        },
        enterAmount: function(input:any){
            if(input=='backspace'){
                if(this.tenderAmount.length < 2){
                    this.tenderAmount = '0';
                } else {

                    this.tenderAmount = this.tenderAmount.slice(0, -1);
                }
                this.balanceAmount = Number(this.tenderAmount) - this.cartTotal;
            } else {
                this.tenderAmount = this.tenderAmount=='0'?input:this.tenderAmount.toString()+input
                this.balanceAmount = Number(this.tenderAmount) - this.cartTotal;
            }
        },
        enterDefinedAmount: function(amount:any){
            this.tenderAmount = amount.toString();
            this.balanceAmount = (Number(this.tenderAmount) - this.cartTotal);
        },
        // getPayemntMethod: function(){
        //     this.paymentDialog = false;
        //     this.paymentMethodDialog = true;
        // },
        confirmPayment: function(type: any){
            // this.confirmPaymentDialog = true;
            let apiUrl = `${this.env}order/`;
            let requestObj = {}as any;
            this.orderStatus = type;
            //Dine in 1, takeaway 2, delivery 3
            //order 1, delete 2, pending 3, hold 4, payment 5
            this.totalQty = 0;
            this.itemsInCart.forEach((element:any) => {
                this.totalQty += element.qty
            });
            requestObj={
                customerid: "",    
                customeraccid: "",
                qty: this.totalQty,
                fromorder: 'POS',
                total: this.cartTotal,
                diningid: this.diningId,
                paymentmethod: this.paymentMethod,
                orderid: "",
                orderstatus: this.orderStatus,
                orderedproduct: this.itemsInCart
            };
            if(this.$route.query.orderId){
                requestObj.orderid=this.itemsInCart[0].orderid;
                apiUrl+='updateorder';
            } else{
                apiUrl+='createorder';
            }
            
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
                this.$router.replace({name:'Home'});
            }).catch((err:any)=>{
                this.showHideAlert('danger', 'Internal Server error');
                console.log(err);
            })
        },
        editNote: function(obj: any){
            this.notesEditDialog = true;
            this.selectedObj = obj;
        },
        saveProductNotes: function(){
            let index = this.itemsInCart.findIndex((i:any)=> i.productid ==this.selectedObj.productid)
            this.itemsInCart[index].notes = this.notesTemp;
            this.notesEditDialog = false;
            this.notesTemp = '';
        },
        showHideAlert: function(type:String, text:String){
            this.alertType = type;
            this.alertText = text;
            this.showAlert = true;
            setTimeout(() => {
               this.showAlert = false; 
            }, 3000);
        },
        clearCart: function(){
            this.itemsInCart = [];
            this.cartTotal = 0;
            this.cartSubTotal = 0;
            this.cartDiscount = 0;
            this.diningId = 1;
            this.$router.replace({name:'Home'});
        }
    },
    filters: {
        toFixedNumb: function (value:any) {
          if (!value) {return 0.00}
          return Number(value).toFixed(2);
        }
      }
})