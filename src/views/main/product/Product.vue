<template>
    <div class="product-section">
        <v-card class="px-3 mb-3">
            <v-card-title class="py-2 px-1">
                <v-row align="center">
                    <v-col>
                        <v-btn icon v-if="editView" @click="editView=false"><v-icon>mdi-arrow-left-box</v-icon></v-btn>
                        {{editView?addEditText:'Product List'}}
                    </v-col>
                    <v-col v-if="!editView" class="text-right"><v-btn icon @click="addProduct()"><v-icon>mdi-plus-circle</v-icon></v-btn></v-col>
                </v-row>
            </v-card-title>
        </v-card>
        <div v-if="!editView">
            <v-row>
                <v-col xs="12" sm="4" md="3" v-for="item,key in productList" :key="key">
                    <v-card class="pa-3 pb-0">
                        <v-row align="center" no-gutters>
                            <v-col cols="10"><span class="text-uppercase">{{item.productname}}</span></v-col>
                            <v-col cols="2" class="text-right"><v-btn @click="editProduct(item)" icon><v-icon>mdi-pencil-box</v-icon></v-btn></v-col>
                        </v-row>
                        <div class="overline grey--text text-right">£{{item.price}}</div>
                    </v-card>
                </v-col>
            </v-row>
        </div>
        <v-card-text v-else class="px-5">
            <v-row>
                <v-col xs="12" sm="8" md="6">   
                    <v-text-field v-model="name" label="Product name" class="mb-3" outlined dense hide-details></v-text-field>
                    <v-text-field v-model="price" label="Price" class="mb-3" outlined dense hide-details></v-text-field>
                    <v-select v-model="category" label="Category" class="mb-3" :items="categoryList" item-text="categoryname" item-value="categoryid" 
                        outlined dense append-outer-icon="mdi-plus-box-outline" hide-details @click:append-outer="openCategoryDialog()"></v-select>
                    <v-switch v-model="productStatus" label="Status " class="mb-3" inset hide-details></v-switch>
                    <v-switch v-model="isVariable" label="Is variable?" class="mb-3" inset hide-details></v-switch>
                    <v-switch v-model="isCustomisable" label="Is customisable" class="mb-3" inset hide-details></v-switch>
                    <v-switch v-model="isMcp" label="Has multiple choice products?" class="mb-3" inset hide-details></v-switch>
                    <div v-if="isMcp">
                        <v-card-title class="px-0">
                            <v-row justify="space-between">
                                <v-col cols="11">Multiple choice products</v-col>
                                <v-col cols="1" class="text-right">
                                    <v-btn icon @click="addSubProduct()"><v-icon>mdi-plus-box-outline</v-icon></v-btn>
                                </v-col>
                            </v-row>
                        </v-card-title>
                        <v-row v-for="(n,key) in subProductArr" :key="key" justify="end">
                            <v-col cols="11">
                                <v-row justify="space-between" align="center">
                                    {{key+1}}
                                    <v-col class="pb-0"><v-text-field v-model="sname[n.id]" label="Sub-product name" outlined dense hide-details></v-text-field></v-col>
                                    <v-col class="pb-0"><v-text-field v-model="sprice[n.id]" label="Sub-product price" outlined dense number hide-details></v-text-field></v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="11">
                                <v-row justify="end" align="center">
                                    <v-switch v-model="svariable[n.id]" label="Is variable?" class="mb-3" dense inset hide-details></v-switch>
                                    <v-switch v-model="scustomisable[n.id]" label="Is customisable" class="mb-3 mx-3" dense inset hide-details></v-switch>
                                    <v-btn icon @click="deleteSubProduct(key)"><v-icon>mdi-delete-outline</v-icon></v-btn>
                                </v-row>
                            </v-col>
                        </v-row>
                    </div>
                    <v-btn block large class="mt-5 primary secondary--text" @click="saveProduct()">Save</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
        <v-dialog v-model="addCategoryDialog" width="300" absolute right>
            <v-card>
                <v-card-title>Add Category</v-card-title>
                <v-card-text>
                    <v-text-field outlined dense hide-details label="Category name" class="mb-3" v-model="categoryName"></v-text-field>
                </v-card-text>
                <v-card-actions class="pa-0">
                    <v-row no-gutters>
                        <v-col cols="12" class="pa-0"><v-btn block large class="primary secondary--text rounded-0" @click="saveCategories()">Save</v-btn></v-col>
                        <v-col cols="12" class="pa-0"><v-btn block large class="rounded-0" @click="addCategoryDialog=false">Cancel</v-btn></v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import axios from 'axios'
    import store from '../../../store'

    export default Vue.extend({
        data(){
            return {
                env: store.state.env,
                productList: [] as any,
                categoryList: [] as any,
                editView: false,
                addEditText: 'Add Product',
                subProductArr: [{id:1, name:'', price:''}]as any,
                selectedId: '',
                name: '',
                category: '',
                price: '',
                productStatus: true,
                isVariable: false,
                isCustomisable: false,
                isMcp: false,
                sname: [] as any,
                sprice: [] as any,
                svariable: [] as any,
                scustomisable: [] as any,
                addCategoryDialog: false,
                categoryName: '',
                mcpArr: []as any
            }
        },
        methods:{
            getProductCategories (){
                axios.get(this.env+'category_product/getcategoryproduct').then((response: {data:any}) => {
                    this.categoryList = response.data.recordsets[0];
                    this.productList = response.data.recordsets[1];
                    console.log(this.productList)
                })
            },
            addProduct:function(){
                this.addEditText='Add Product';
                this.selectedId = '';
                this.name = '';
                this.category = '';
                this.price = '';
                this.isVariable = false;
                this.isMcp = false;
                this.isCustomisable = false
                this.editView=false;
            },
            editProduct: function(obj:any){
                this.addEditText='Edit Product';
                this.selectedId = obj.productid;
                this.name = obj.productname;
                this.category = obj.categoryid;
                this.price = obj.price;
                this.isVariable = obj.isvariable;
                this.isMcp = obj.ismcp;
                this.isCustomisable = obj.iscustomizable;
                this.editView=true;
            },
            saveProduct: function(){
                let requestObj = {}as any;
                let apiUrl = `${this.env}category_product/`
                requestObj = {
                    productname: this.name,
                    categoryid: this.category,
                    price: this.price,
                    isvariable: this.isVariable,
                    ismcp: this.isMcp,
                    iscustomizable: this.isCustomisable,
                    mcparr: this.mcpArr
                }
                if(this.editView){
                    requestObj.productid = this.selectedId;
                    requestObj.status = this.productStatus;
                    apiUrl += 'updateproduct';
                } else {
                    requestObj.status= 'A',
                    apiUrl += 'createproduct';
                }
                console.log(this.editView);
                console.log(apiUrl);
                axios.post(apiUrl, requestObj).then((response: {data:any}) => {
                    console.log(response);
                });
            },
            // getCategories:function (){
            //     axios.get(this.env+'category_product/getcategoryproduct').then((response: {data:any}) => {
            //         this.categoryList = response.data.recordset;
            //     });
            // },
            addSubProduct:function (){
                let obj = {id: this.subProductArr[this.subProductArr.length-1].id+1, name:'', price:''}
                this.subProductArr.push(obj);
                console.log(this.subProductArr);
            },
            deleteSubProduct:function (ind:any){
                this.subProductArr.splice(ind,1);
            },
            openCategoryDialog:function (){
                this.categoryName = '';
                this.addCategoryDialog = true;
            },
            saveCategories: function(){
                let apiUrl = `${this.env}category_product/createcategory`;
                let requestBody = {
                    categoryname: this.categoryName,
                    status: 'A'
                }as any;
                axios.post(apiUrl, requestBody).then((response:{data:any})=>{
                    this.addCategoryDialog=false;
                });
            },
        },
        created(){
            this.getProductCategories();
            // this.getCategories();
        }
    })
</script>
