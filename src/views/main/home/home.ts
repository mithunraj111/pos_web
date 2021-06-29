import Vue from 'vue'
export default Vue.extend({
    data:()=>({
        activeTab: 'products',
        categoryList:[
            {id:1, name:'Category 1'},
            {id:2, name:'Category 2'},
            {id:3, name:'Category 3'},
            {id:4, name:'Category 4'},
            {id:5, name:'Category 5'},
            {id:6, name:'Category 6'},
        ],
        allProducts: []as any,
        productList:[
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
        ],
        itemsInCart: []as any,
        orderListHeader: [
            {text:'Name', value:'name', sortable: false},
            {text:'Price', value:'price', sortable: false},
            {text:'Quantity', value:'quantity', sortable: false, align: 'center'},
            {text:'Action', value:'action', sortable: false, align: 'right'}
        ],
        taxList: [
            {taxId: '1', taxName: 'CGST', taxPercent: '5'},
            {taxId: '2', taxName: 'SGST', taxPercent: '5'}
        ],
        cartSubTotal: 0,
        cartDiscount: 0,
        discountTemp: 0,
        discountValue: 0,
        discountType: '',
        cartTotal: 0,
        tenderAmount: '0',
        balanceAmount: 0,
        searchText: '',
        taxEditFlag: false,
        showCategory: true,
        selectedCategory: {}as any,
        discountInPercent: false,
        paymentDialog: false,
        paymentMethodDialog: false,
        confirmPaymentDialog: false,
        discountEditDialog: false,
    }),
    methods:{
        openProducts: function(obj:any){
            this.productList = this.productList.filter((i:any)=>{
                return i.category_id == obj.id
            })
            this.selectedCategory = obj;
            this.showCategory = false;
        },
        unselectCategory: function(){
            this.productList = this.allProducts.filter((i:any)=>{
                return i.name.toLowerCase().match(`${this.searchText.toLowerCase()}.*`);
            })
            this.selectedCategory = {};
        },
        searchProducts: function(){
            this.productList = this.allProducts;
            this.productList = this.productList.filter((i:any)=>{
                if(this.selectedCategory.name){
                    return i.name.toLowerCase().match(`${this.searchText.toLowerCase()}.*`) && (i.category_id == this.selectedCategory.id) ;
                } else {
                    return i.name.toLowerCase().match(`${this.searchText.toLowerCase()}.*`);
                }
            })
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
            let taxAmount = 0;
            this.taxList.forEach((element:any) => {
                taxAmount += (Number(this.cartSubTotal)/100) * Number(element.taxPercent);
            });
            if(this.discountType == 'Percentage'){
                this.cartDiscount = (this.cartSubTotal/100)*this.discountValue;
            } else {
                this.cartDiscount = this.discountValue;
            }
            this.cartTotal = Number(this.cartSubTotal) - Number(this.cartDiscount) + taxAmount;
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
            let taxAmount = 0;
            this.taxList.forEach((element:any) => {
                taxAmount += (Number(this.cartSubTotal)/100) * Number(element.taxPercent);
            });
            if(this.discountType == 'Percentage'){
                this.cartDiscount = (this.cartSubTotal/100)*this.discountValue;
            } else {
                this.cartDiscount = this.discountValue;
            }
            this.cartTotal = Number(this.cartSubTotal) - Number(this.cartDiscount) + taxAmount;
        },
        editDiscountValue: function(){
            this.discountTemp = this.cartDiscount;
            this.discountEditDialog = true;
        },
        saveDiscountValue: function(){
            this.discountValue = this.discountTemp;
            if(this.discountType == 'Percentage'){
                this.cartDiscount = (this.cartSubTotal/100)*this.discountValue;
            } else {
                this.cartDiscount = this.discountValue;
            }
            let taxAmount = 0;
            this.taxList.forEach((element:any) => {
                taxAmount += (Number(this.cartSubTotal)/100) * Number(element.taxPercent);
            });
            this.cartTotal = Number(this.cartSubTotal) - Number(this.cartDiscount) + taxAmount;
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
        getPayemntMethod: function(){
            this.paymentDialog = false;
            this.paymentMethodDialog = true;
        },
        confirmPayment: function(type: any){
            this.confirmPaymentDialog = true;
        },
    },
    mounted(){
        this.allProducts = this.productList;
    },
})