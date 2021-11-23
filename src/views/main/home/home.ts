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
        groupList:[]as any,
        groupListTemp:[]as any,
        unmappedProductList: []as any,
        selectedmcproduct: []as any,
        selectedmcproductgroup: []as any,
        selectedmcproductgroupindex: []as any,
        multiplemcpgroups: []as any,
        selectedProductForCart: {} as any,
        showMiscProduct: true,
        miscPrice: ''as any,
        itemsInCart: []as any,
        itemsInCartCopy: []as any,
        orderListHeader: [
            {text:'Name', value:'productname', sortable: false},
            {text:'Price', value:'calculatedprice', sortable: false},
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
        addMcpToCartDialog:false,
        userDataDialog: false,
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
        cfname: '',
        clname: '',
        cphone: '',
        cmail: '',
        cadd: '',
        cadd2: '',
        cpostcode: '',
        customerid: ''
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
                this.groupList = this.groupListTemp = response.data.recordsets[2];
                this.unmappedProductList = this.productList.filter((i:any)=>{return i.categoryid == ''})
            }).catch((err:any)=>{
                this.showHideAlert('danger', 'Internal Server error');
                console.log(err);
            })
        },
        getOrderDetail: function(){
            axios.get(this.env+'order/getorderedproduct',{params:{orderid:this.$route.query.orderId}}).then((response:any)=>{
                response.data.recordset.forEach((element:any) => {
                    let mcparr = [];
                    if(element.mcp){
                        mcparr = JSON.parse(element.mcp);
                    }
                    this.itemsInCart.push({
                        productid: element.productId,
                        productname: element.productName,
                        calculatedprice: element.price,
                        qty: element.qty,
                        total: element.total,
                        orderid: element.orderId,
                        orderedproductid: element.orderProductId,
                        mcpcart: mcparr,
                    })
                    this.cartSubTotal += element.total;
                    if(this.discountType == 'Percentage'){
                        this.cartDiscount = (this.cartSubTotal/100)*this.discountValue;
                    } else {
                        this.cartDiscount = this.discountValue;
                    }
                    this.cartTotal = Number(this.cartSubTotal) - Number(this.cartDiscount);
                });
            }).catch((err:any)=>{
                this.showHideAlert('danger', 'Internal Server error');
                console.log(err);
            })
        },
        openProducts: function(obj:any){
            this.productListTemp = this.productList.filter((i:any)=>{
                return i.categoryid == obj.categoryid;
            });
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
        changemcproductQty: function(type:any,index:any,e:any){
            if(type=='add' && this.selectedmcproductgroup.selectedCount == this.selectedmcproductgroup.max){ 
                return 0; 
            }
            if(type=='add'){
                this.selectedmcproductgroup.selectedCount++;
                if(this.selectedmcproductgroup.mcproductgroup[index].qty==0){
                    this.selectedmcproductgroup.mcproductgroup[index].qty++;
                    this.selectedmcproductgroup.selectedProduct.push(this.selectedmcproductgroup.mcproductgroup[index]);
                    this.selectedmcproduct.push(this.selectedmcproductgroup.mcproductgroup[index]);
                } else {
                    let ind = this.selectedmcproduct.findIndex((row:any)=>{
                        return row.productid == this.selectedmcproductgroup.mcproductgroup[index].productid;
                    })
                    this.selectedmcproduct[ind].qty++;
                }
            } else {
                e.stopPropagation();
                if(this.selectedmcproductgroup.mcproductgroup[index].qty > 0){
                    this.selectedmcproductgroup.selectedCount--;;
                    this.selectedmcproductgroup.mcproductgroup[index].qty--;
                    if(this.selectedmcproductgroup.mcproductgroup[index].qty==0){
                        let i = this.selectedmcproductgroup.selectedProduct.findIndex((item:any)=>{
                            return item.productid === this.selectedmcproductgroup.mcproductgroup[index].productid
                        })
                        this.selectedmcproductgroup.selectedProduct.splice(i,1);
                    }
                }
            }
        },
        checkToAdd: function(obj:any){
            this.selectedProductForCart = obj;
            let selectedMcpArr = JSON.parse(obj.mcgroup);
            let arr=[];
            if(obj.ismcp){
                for(let i=0;i<this.groupList.length;i++){
                    if(typeof this.groupList[i].mcproductgroup == 'string'){
                        this.groupList[i].mcproductgroup = this.groupListTemp[i].mcproductgroup = JSON.parse(this.groupList[i].mcproductgroup);
                    }
                    for(let k=0;k<this.groupList[i].mcproductgroup.length;k++){
                        Vue.set(this.groupList[i].mcproductgroup[k],'qty',0);
                    }
                    for(let j=0;j<selectedMcpArr.length;j++){
                        if(this.groupList[i].groupid==selectedMcpArr[j].groupid){
                            let groupObj = this.groupList[i];
                            groupObj.min = selectedMcpArr[j].min;
                            groupObj.max = selectedMcpArr[j].max;
                            groupObj.selectedCount = 0;
                            groupObj.selectedProduct = []as any;
                            groupObj.groupname = selectedMcpArr[j].groupname;
                            arr.push(groupObj);
                            break;
                        }
                    }
                }
                this.groupListTemp = arr;
                this.selectedmcproductgroupindex = 0;
                this.selectedmcproductgroup = this.groupListTemp[this.selectedmcproductgroupindex];
                this.addMcpToCartDialog =true;
            } else {
                this.addToCart(obj);
            }
        },
        changemcpgroupindex: function(type:any){
            if(type=='next'){
                this.multiplemcpgroups[this.selectedmcproductgroupindex] = this.selectedmcproductgroup;
                this.selectedmcproductgroupindex++;
                if(this.multiplemcpgroups[this.selectedmcproductgroupindex]){
                    this.selectedmcproductgroup = this.multiplemcpgroups[this.selectedmcproductgroupindex]
                } else{
                    this.selectedmcproductgroup = this.groupListTemp[this.selectedmcproductgroupindex];
                }
            } else if(type=='continue'){
                this.multiplemcpgroups[this.selectedmcproductgroupindex] = this.selectedmcproductgroup;
                this.addMcpToCartDialog =false;
                this.addToCart(this.selectedProductForCart);
            }else{
                this.multiplemcpgroups[this.selectedmcproductgroupindex] = this.selectedmcproductgroup;
                this.selectedmcproductgroupindex--;
                this.selectedmcproductgroup = this.multiplemcpgroups[this.selectedmcproductgroupindex];
            }
        },
        addToCart: function(obj:any) {
            let productObj = JSON.parse(JSON.stringify(obj));
            let calculatedprice = 0;
            let isSelected = this.itemsInCart.find((item:any) => item.productid == obj.productid);
            let selectedmcpproducts = []as any;
            if(isSelected && obj.ismcp==false){
                this.changeQuantity(obj,'plus');
                return;
            } else{
                calculatedprice = obj.price;
                if(obj.ismcp==true){
                    this.multiplemcpgroups.forEach((element:any) => {
                        element.selectedProduct.forEach((childElement:any) => {
                            calculatedprice += (Number(childElement.price)*childElement.qty);
                            selectedmcpproducts.push(childElement);
                        });
                    });
                }
                obj.qty=1;
            }
            // if(this.itemsInCart.length>0){
            //     productObj.key = +this.itemsInCart[this.itemsInCart.length-1].key + 1;
            // } else {
            //     productObj.key = 0;
            // }
            productObj.calculatedprice = calculatedprice;
            productObj.orderedproductid = "";
            productObj.orderid = "";
            productObj.qty = 1;
            productObj.total = (obj.qty * calculatedprice).toFixed(2);
            if(productObj.ismcp == true){
                productObj.mcp = this.multiplemcpgroups;
                productObj.mcpcart = selectedmcpproducts
            } else{
                productObj.mcpcart = [];
                productObj.mcp = [];
            }
            this.itemsInCart.push(productObj);
            this.cartSubTotal += productObj.calculatedprice;
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
                        this.itemsInCart[i].total = (this.itemsInCart[i].qty * this.itemsInCart[i].calculatedprice).toFixed(2);
                    } else if (type=='plus') {
                        this.itemsInCart[i].qty=this.itemsInCart[i].qty + 1;
                        this.itemsInCart[i].total = (this.itemsInCart[i].qty * this.itemsInCart[i].calculatedprice).toFixed(2);
                    }
                    break;
                }
            }
            if(type=='minus'){
                this.cartSubTotal = Number(this.cartSubTotal) - Number(obj.calculatedprice);
            }else if(type=="remove"){
                this.cartSubTotal = Number(this.cartSubTotal) - Number(obj.total);
            }else{
                this.cartSubTotal = Number(this.cartSubTotal) + Number(obj.calculatedprice);
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
            let itemAmount = this.itemsInCart[index].calculatedprice * this.itemsInCart[index].qty;
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
        getUserData: function(type: any){
            this.orderStatus = type;
            this.cfname = '';
            this.clname = '';
            this.cphone = '';
            this.cmail = '';
            this.cadd = '';
            this.cadd2 = '';
            this.cpostcode = '';
            this.userDataDialog = true;
        },
        submitUserData: function(){
            let obj = {
                firstname: this.cfname,
                lastname: this.clname,
                mobile: this.cphone,
                email: this.cmail,
                addressline: this.cadd,
                addressline2: this.cadd2,
                postcode: this.cpostcode,
            }
            let url = this.env+"/customer/CreateAndGetCustomerId"
            axios.post(url, obj).then((response:any)=>{
                this.customerid = response.data.rcordsets[0].customerid;
            })
            this.confirmPayment(this.orderStatus);
        },
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
                customerid: this.customerid,    
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
                if(this.$route.query.orderId){
                    this.$router.replace({name:'Home'});
                }
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