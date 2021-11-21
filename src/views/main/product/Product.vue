<template>
    <div class="product-section">
        <v-card class="px-3 mb-3">
            <v-card-title class="py-2 px-1">
                <v-row align="center">
                    <v-col>
                        <v-btn icon v-if="editView" @click="editView=false"><v-icon>mdi-arrow-left-box</v-icon></v-btn>
                        {{editView?addEditText:'Product List'}}
                    </v-col>
                    <v-col v-if="!editView" class="text-right">
                        <v-btn icon @click="addProduct()"><v-icon>mdi-plus-circle</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
        </v-card>
        <div v-if="!editView">
            <v-row>
                <v-col xs="12" sm="4" md="3" v-for="item,key in productList" :key="key">
                    <v-card class="pa-3 pb-0">
                        <v-row align="center" no-gutters>
                            <span class="text-uppercase">{{item.productname}}</span>
                            <v-btn icon @click="groupSettings(item)"><v-icon>mdi-cog</v-icon></v-btn>
                            <v-btn icon @click="editProduct(item)"><v-icon>mdi-pencil-box</v-icon></v-btn>
                        </v-row>
                        <div class="overline grey--text text-right">{{item.price>0?'£'+item.price:'FREE'}}</div>
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
                    <v-switch v-model="productStatus" label="Status" class="mb-3" inset hide-details></v-switch>
                    <v-switch v-model="isVariable" label="Is variable?" class="mb-3" inset hide-details></v-switch>
                    <v-switch v-model="isMcp" label="Is MCP?" class="mb-3" inset hide-details></v-switch>
                    <v-switch v-model="sellontill" label="Sell on till" class="mb-3" inset hide-details></v-switch>
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
        <v-dialog v-model="mcpMappingDialog" width="500" max-width="90%">
            <v-card>
                <v-card-title>Select groups for {{selectedProduct.productname}}</v-card-title>
                <v-card-text>
                    <v-select v-model="selectedGroups" :items="groupList" label="Select groups" multiple outlined item-text="groupname" item-value="groupid" return-object>
                        <template v-slot:selection="{ item, index }">
                            <v-chip v-if="index === 0"><span>{{ item.groupname }}</span></v-chip>
                            <span v-if="index === 1" class="grey--text text-caption">(+{{ selectedGroups.length - 1 }} others)</span>
                        </template>
                    </v-select>
                    <v-simple-table dense>
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-left">Group Name</th>
                                    <th class="text-left">Status</th>
                                    <th class="text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody v-if="selectedGroups.length>0">
                                <tr v-for="(item,key) in selectedGroups" :key="key">
                                    <td>{{ item.groupname }}</td>
                                    <td><v-switch inset dense v-model="item.status" :true-value="'1'" :false-value="'0'" hide-details class="mt-0"></v-switch></td>
                                    <td><v-btn icon><v-icon>mdi-delete</v-icon></v-btn></td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr><td colspan="5" class="text-center overline hint--text">No groups added</td></tr>
                            </tbody>
                            </template>
                    </v-simple-table>
                </v-card-text>
                <v-card-actions class="pa-0">
                    <v-row no-gutters>
                        <v-col cols="12">
                            <v-btn x-large block @click="saveMcpGroupMapping()" class="rounded-0 primary">Save</v-btn>
                            <v-btn x-large block @click="mcpMappingDialog=false" class="rounded-0">Cancel</v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-alert :value="showAlert" :type="alertType" border="left" transition="scale-transition" class="alertPos" >{{alertText}}</v-alert>
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
                groupList: [] as any,
                mcpMappedProduct:[]as any,
                mcpMappedGroup:[]as any,
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
                sellontill: false,
                isMcp: false,
                sname: [] as any,
                sprice: [] as any,
                svariable: [] as any,
                scustomisable: [] as any,
                addCategoryDialog: false,
                mcpMappingDialog: false,
                categoryName: '',
                mcpArr: []as any,
                selectedGroups: []as any,
                showAlert: false,
                alertType: 'success' as any,
                alertText: ''as any,
                selectedProduct: []as any,
                selectedMcpProduct: []as any
            }
        },
        methods:{
            getProductCategories (){
                axios.get(this.env+'category_product/getdetailsformcp').then((response: {data:any}) => {
                    this.productList = response.data.recordsets[0];
                    this.groupList = response.data.recordsets[1];
                    this.mcpMappedProduct = response.data.recordsets[2];
                    this.mcpMappedGroup = response.data.recordsets[3]
                }).catch((err:any)=>{
                    this.showHideAlert('danger', 'Internal Server error');
                    console.log(err);
                })
            },
            getCategories:function (){
                axios.get(this.env+'category_product/getcategory').then((response: {data:any}) => {
                    this.categoryList = response.data.recordset;
                }).catch((err:any)=>{
                    this.showHideAlert('danger', 'Internal Server error');
                    console.log(err);
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
                this.editView=true;
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
                this.sellontill = obj.sellontill;
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
                    sellontill: this.sellontill,
                    mcparr: this.mcpArr
                }
                if(this.selectedId){
                    requestObj.productid = this.selectedId;
                    requestObj.status = this.productStatus;
                    apiUrl += 'updateproduct';
                } else {
                    requestObj.status= 'A',
                    apiUrl += 'createproduct';
                }
                axios.post(apiUrl, requestObj).then((response: {data:any}) => {
                    this.editView = false;
                    console.log(response);
                }).catch((err:any)=>{
                    this.showHideAlert('danger', 'Internal Server error');
                    console.log(err);
                })
            },
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
                    status: 1
                }as any;
                axios.post(apiUrl, requestBody).then((response:{data:any})=>{
                    this.addCategoryDialog=false;
                }).catch((err:any)=>{
                    this.showHideAlert('danger', 'Internal Server error');
                    console.log(err);
                });
            },
            groupSettings: function(obj:any){
                this.selectedProduct = obj;
                this.selectedGroups= this.mcpMappedGroup.filter((element: any)=>{
                    return element.productid == obj.productid;
                })
                this.mcpMappingDialog = true;
            },
            saveMcpGroupMapping:function(){
                let url = this.env+'/category_product/createmcproductgroupmapping';
                let obj={
                    productid: this.selectedProduct.productid,
                    selectedgroups: this.selectedGroups 
                }as any;
                axios.post(url,obj).then((response:any)=>{
                    console.log(response);
                }).catch((err:any)=>{
                    this.showHideAlert('danger', 'Internal Server error');
                    console.log(err);
                })
            },
            showHideAlert: function(type:String, text:String){
                this.alertType = type;
                this.alertText = text;
                this.showAlert = true;
                setTimeout(() => {
                this.showAlert = false; 
                }, 3000);
            },
        },
        created(){
            this.getProductCategories();
            this.getCategories();
        }
    })
</script>
