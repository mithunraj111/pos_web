<template>
    <div class="category-section">
        <v-card class="px-3 mb-3">
            <v-card-title class="py-2 px-1">
                <v-row align="center">
                    <v-col>
                        Category List
                    </v-col>
                    <v-col class="text-right">
                        <v-btn icon @click="addCategory();">
                            <v-icon>mdi-plus-circle</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
        </v-card>
        <v-row>
            <v-col xs="12" sm="4" md="3" v-for="item,key in categoryList" :key="key">
                <v-card class="pa-3 pb-0">
                    <span class="text-uppercase">{{item.categoryname}}<v-icon @click="editCategory(item)" class="mb-1" right>mdi-pencil-box-outline</v-icon></span><br/><br/>
                    <div class="overline grey--text text-right">
                        No. of products ({{item.product_count}})
                    </div>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="addEditCategoryDialog" width="300" persistent>
            <v-card>
                <v-card-title>{{editView? 'Edit Category': 'Add Category'}}</v-card-title>
                <v-card-text>
                    <v-text-field outlined dense hide-details label="Category name" class="mb-3" v-model="categoryName"></v-text-field>
                    <label v-if="editView">Status:</label><v-switch class="mt-1" v-if="editView" v-model="categoryStatus" inset hide-details></v-switch>
                </v-card-text>
                <v-card-actions class="pa-0">
                    <v-row no-gutters>
                        <v-col cols="12" class="pa-0"><v-btn block large class="primary secondary--text rounded-0" @click="saveCategories()">Save</v-btn></v-col>
                        <v-col cols="12" class="pa-0"><v-btn block large class="rounded-0" @click="addEditCategoryDialog=false">Cancel</v-btn></v-col>
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
            addEditCategoryDialog: false,
            categoryObj: {}as any,
            categoryList: [] as any,
            categoryName: '',
            categoryId: '',
            categoryStatus: true,
            editView: false
        }
    },
    methods:{
        getCategories:function (){
            axios.get(this.env+'category_product/getcategory').then((response: {data:any}) => {
                this.categoryList = response.data.recordset;
            })
        },
        addCategory: function(){
            this.categoryObj = {};
            this.categoryName = '';
            this.categoryId = '';
            this.categoryStatus = true;
            this.editView = false;
            this.addEditCategoryDialog = true;
        },
        editCategory: function(obj:any){
            this.categoryObj = obj;
            this.categoryName = this.categoryObj.categoryname;
            this.categoryId = this.categoryObj.categoryid;
            this.categoryStatus = this.categoryObj.status =='A'? true:false;
            this.editView = true;
            this.addEditCategoryDialog = true;
        },  
        saveCategories: function(){
            let apiUrl = `${this.env}category_product/`;
            let requestBody = {
                categoryname: this.categoryName,
            }as any;
            if(this.editView){
                apiUrl += 'updatecategory'; 
                requestBody.categoryid = this.categoryId;
                requestBody.status = this.categoryStatus?'A':'I';
            } else {
                apiUrl += 'createcategory';
                requestBody.status = 'A';
            }
            axios.post(apiUrl, requestBody).then((response:{data:any})=>{
                this.addEditCategoryDialog=false;
            });
        },
        cancel: function(){
            this.addEditCategoryDialog=false;
        }
    },
    created(){
        this.getCategories();
    }
})
</script>