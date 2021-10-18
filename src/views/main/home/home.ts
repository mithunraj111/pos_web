import Vue from 'vue'
import axios from 'axios';
import store from '../../../store'
export default Vue.extend({
    data:()=>({
        env: store.state.env,
        activeTab: 'products',
        categoryList: []as any,
        categoryListTemp:[
            {id:1, name:'Category 1'},
            {id:2, name:'Category 2'},
            {id:3, name:'Category 3'},
            {id:4, name:'Category 4', parentId: 1},
            {id:5, name:'Category 5'},
            {id:6, name:'Category 6'},
        ],
        productList: []as any,
        productListTemp:[
            {id:1, name:'Evolution aqua pure aquarium', price: 3000, category_id: 1},
            {id:2, name:'Electroprime aquarium', price: 2500, category_id: 2},
            {id:3, name:'Product 3', price: 300, category_id: 4},
            {id:4, name:'Product 4', price: 1800, category_id: 1},
            {id:5, name:'Product 5', price: 900, category_id: 1},
            {id:6, name:'Product 6', price: 880, category_id: 1},
            {id:7, name:'Product 7', price: 1200, category_id: 1},
            {id:8, name:'Product 8', price: 1500, category_id: 1},
            {id:9, name:'Product 9', price: 250, category_id: 1},
            {id:10, name:'Product 10', price: 45, category_id:1},
            {id:11, name:'Product 11', price: 1250, category_id: 1},
            {id:12, name:'Product 12', price: 350, category_id: 5},
            {id:13, name:'Product 7', price: 1200, category_id: 1},
            {id:14, name:'Product 8', price: 1500, category_id: 1},
            {id:15, name:'Product 9', price: 250, category_id: 1},
            {id:16, name:'Product 10', price: 45, category_id:2},
            {id:17, name:'Product 11', price: 1250, category_id: 1},
            {id:18, name:'Product 12', price: 350, category_id: 5},
            {id:19, name:'Product 13', price: 370, category_id: ''},
            {id:20, name:'Product 14', price: 450, category_id: ''},
        ],
        unmappedProductList: []as any,
        showMiscProduct: true,
        miscPrice: ''as any,
        itemsInCart: []as any,
        orderListHeader: [
            {text:'Name', value:'name', sortable: false},
            {text:'Price', value:'price', sortable: false},
            {text:'Quantity', value:'quantity', sortable: false, align: 'center'},
            {text:'Amount', value:'amount', sortable: false, align: 'right'}
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
        diningId: ''as any,
        paymentMethod: ''as any,
        orderStatus: ''as any
    }),
    mounted(){
        this.getProductCategory()
    },
    methods:{
        getProductCategory:function (){
            axios.get(this.env+'category_product/getcategoryproduct').then((response: {data:any}) => {
                // this.productList = this.productListTemp = response.data.recordsets[1];
                // this.categoryList = this.categoryListTemp = response.data.recordsets[0];
                this.productList = this.productListTemp;
                this.categoryList = this.categoryListTemp;
                this.unmappedProductList = this.productList.filter((i:any)=>{
                    return i.category_id == '';
                })
            })
        },
        openProducts: function(obj:any){
            this.categoryListTemp = this.categoryList.filter((i:any)=>{
                return i.parentId == obj.id;
            });
            if(this.categoryListTemp.length>0){
                this.unmappedProductList = this.productList.filter((i:any)=>{
                    return i.category_id == obj.id;
                })
                this.categoryType = 'subCategory';
            } else {
                this.productListTemp = this.productList.filter((i:any)=>{
                    return i.category_id == obj.id;
                });
                this.selectedCategory = obj;
                this.categoryType = 'products';      
            }
        },
        unselectCategory: function(){
            this.productListTemp = this.productList.filter((i:any)=>{
                return i.name.toLowerCase().match(`${this.searchText.toLowerCase()}.*`);
            })
            this.unmappedProductList = this.productList.filter((i:any)=>{
                return i.category_id == '';
            })
            this.selectedCategory = {};
        },
        goToCategory: function(){
            this.categoryListTemp = this.categoryList;
            this.categoryType = 'category';
            this.searchText = '';
            this.unmappedProductList = this.productList.filter((i:any)=>{
                return i.category_id == '';
            })
        },
        searchProducts: function(){
            this.categoryType = 'products';
            this.productListTemp = this.productList.filter((i:any)=>{
                if(this.selectedCategory.name){
                    return i.name.toLowerCase().match(`${this.searchText.toLowerCase()}.*`) && (i.category_id == this.selectedCategory.id) ;
                } else {
                    return i.name.toLowerCase().match(`${this.searchText.toLowerCase()}.*`);
                }
            })
        },
        addMiscToCart: function(){
            this.addMiscProductDialog = true;
        },
        addToCart: function(obj:any) {
            let isSelected = this.itemsInCart.find((item:any) => item.id == obj.id);
            if(isSelected){
                this.changeQuantity(obj,'plus');
                return;
            } else{
                obj.quantity=1;
            }
            this.itemsInCart.push(obj);
            this.cartSubTotal += obj.price;
            // let taxAmount = 0;
            // this.taxList.forEach((element:any) => {
            //     taxAmount += (Number(this.cartSubTotal)/100) * Number(element.taxPercent);
            // });
            if(this.discountType == 'Percentage'){
                this.cartDiscount = (this.cartSubTotal/100)*this.discountValue;
            } else {
                this.cartDiscount = this.discountValue;
            }
            this.cartTotal = Number(this.cartSubTotal) - Number(this.cartDiscount);
            // this.cartTotal = Number(this.cartSubTotal) - Number(this.cartDiscount) + taxAmount;
        },
        removeFromCart: function(obj:any){
            this.changeQuantity(obj,'minus');
            this.itemsInCart = this.itemsInCart.filter((i:any) =>{
                return i.id != obj.id
            })
        },
        changeQuantity: function(obj:any, type:any){
            for(let i=0;i<this.itemsInCart.length;i++){
                if(this.itemsInCart[i].id == obj.id){
                    if(type =='minus'){this.itemsInCart[i].quantity=this.itemsInCart[i].quantity - 1;} 
                    else {this.itemsInCart[i].quantity=this.itemsInCart[i].quantity + 1;}
                    break;
                }
            }
            if(type=='minus'){
                this.cartSubTotal = Number(this.cartSubTotal) - Number(obj.price);
            } else{
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
            let index = this.itemsInCart.findIndex((i:any)=> i.id ==this.selectedObj.id)
            this.itemsInCart[index].discountType = this.discountPerProductType;
            let itemAmount = this.itemsInCart[index].price * this.itemsInCart[index].quantity;
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
            let apiUrl = `${this.env}order/createorder`;
            let requestObj = {}as any;
            requestObj={
                total: this.cartTotal,
                lead: 'POS',
                diningid: this.diningId,
                paymentmethod: this.paymentMethod,
                orderstatus: this.orderStatus,
                orderedProduct: this.itemsInCart
            };
            console.log(requestObj);
            return 0;
            axios.post(apiUrl, requestObj).then((response:{data:any})=>{
                console.log(response);
            })
        },
        editNote: function(obj: any){
            this.notesEditDialog = true;
            this.selectedObj = obj;
        },
        saveProductNotes: function(){
            let index = this.itemsInCart.findIndex((i:any)=> i.id ==this.selectedObj.id)
            this.itemsInCart[index].notes = this.notesTemp;
            this.notesEditDialog = false;
            this.notesTemp = '';
        }
    },
})