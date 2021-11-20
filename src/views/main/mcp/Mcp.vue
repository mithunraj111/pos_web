<template>
    <div class="mcp-section">
        <v-card class="px-3 mb-3">
            <v-card-title class="py-2 px-1">
                <v-row align="center">
                    <v-col>Mcp List</v-col>
                    <v-col class="text-right">
                        <v-btn icon @click="addEditGroup();">
                            <v-icon>mdi-plus-circle</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
        </v-card>
        <v-row>
            <v-col xs="12" sm="4" md="3" v-for="item,key in groupList" :key="key">
                <v-card class="pa-3 pb-0">
                    <span class="text-uppercase">{{item.groupname}}<v-icon @click="groupSettings(item)" class="mb-1" right>mdi-cog</v-icon><v-icon @click="addEditGroup(item)" class="mb-1" right>mdi-pencil-box-outline</v-icon></span><br/><br/>
                    <div class="overline grey--text text-right">
                        Min ({{item.minvalue}}), Max ({{item.maxvalue}})
                    </div>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="addEditGroupDialog" width="400" max-width="90%">
            <v-card>
                <v-card-title>{{addEditType=='add'?'Add Group':'Edit Group'}}</v-card-title>
                <v-card-text>
                    <v-text-field v-model="groupname" outlined dense hide-details label="Group name" class="mb-3"></v-text-field>
                    <v-text-field v-model="minvalue" outlined dense hide-details label="Minimum value" class="mb-3"></v-text-field>
                    <v-text-field v-model="maxvalue" outlined dense hide-details label="Maximum value" class="mb-3"></v-text-field>
                    <v-switch v-model="status" label="Status" class="mb-3" inset hide-details></v-switch>
                </v-card-text>
                <v-card-actions class="pa-0">
                    <v-row no-gutters>
                        <v-col cols="12"><v-btn block x-large class="primary rounded-0" @click="saveGroup();addEditGroupDialog=false;">{{addEditType=='add'?'Save':'Update'}}</v-btn></v-col>
                        <v-col cols="12"><v-btn block x-large class="rounded-0" @click="addEditGroupDialog=false">Cancel</v-btn></v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="mcpsettingsDialog" width="400" max-width="90%">
            <v-card>
                <v-card-title class="text-capitalize">Add Products to {{selectedGroup.groupname}}</v-card-title>
                <v-card-text>
                    <v-select multiple outlined hide-details v-model="selectedMcpProduct" :items="productList" item-text="productname" item-value="productid" return-object>
                        <template v-slot:selection="{ item, index }">
                            <v-chip v-if="index === 0"><span>{{ item.productname }}</span></v-chip>
                            <span v-if="index === 1" class="grey--text text-caption">(+{{ selectedMcpProduct.length - 1 }} others)</span>
                        </template>
                    </v-select>
                    <v-simple-table v-if="selectedMcpProduct.length>0">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-left">MCP Product Name</th>
                                    <th class="text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,key) in selectedMcpProduct" :key="key">
                                    <td>{{ item.productname }}</td>
                                    <td><v-switch inset dense v-model="item.status" :false-value="0" :true-value="1"></v-switch></td>
                                    <td><v-btn icon><v-icon>mdi-close-box-outline</v-icon></v-btn></td>
                                </tr>
                            </tbody>
                            </template>
                    </v-simple-table>
                </v-card-text>
                <v-card-actions class="pa-0">
                    <v-row no-gutters>
                        <v-col cols="12">
                            <v-btn block x-large @click="saveMcpGroupMapping()" class="rounded-0 primary">Save</v-btn>
                            <v-btn block x-large @click="mcpsettingsDialog=false" class="rounded-0">Cancel</v-btn>
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
        return{
            env: store.state.env,
            addEditGroupDialog: false,
            addEditType: 'add',
            productList: []as any,
            groupList: []as any,
            groupname: ''as any,
            minvalue: 0,
            maxvalue: 0,
            status: ''as any,
            showAlert: false,
            alertType: 'success' as any,
            alertText: ''as any,
            mcpsettingsDialog: false,
            mcpMappedProduct: [] as any,
            selectedMcpProduct: []as any,
            selectedGroup: {}as any
        }
    },
    methods: {
        getGroups:function (){
            axios.get(this.env+'category_product/getdetailsformcp').then((response: {data:any}) => {
                this.productList = response.data.recordsets[0];
                this.groupList = response.data.recordsets[1];
                this.mcpMappedProduct =response.data.recordsets[2];
            }).catch((err:any)=>{
                this.showHideAlert('danger', 'Internal Server error');
                console.log(err);
            })
        },
        addEditGroup: function(obj:any){
            if(obj){
                this.addEditType='edit';
                this.selectedGroup=obj;
                this.groupname=obj.groupname;
                this.minvalue = obj.minvalue;
                this.maxvalue = obj.maxvalue;
            } else{
                this.addEditType='add';
                this.groupname='';
                this.minvalue = 0;
                this.maxvalue = 0;
            }
            this.addEditGroupDialog=true;
        },
        saveGroup: function(){
            if(this.groupname.length < 1 && this.minvalue > this.maxvalue || this.maxvalue==0){
                return 0;
            }
            let url = this.env+'category_product/';
            let obj ={
                groupname: this.groupname,
                minvalue: this.minvalue,
                maxvalue: this.maxvalue,
                status: this.status ? 1 : 0
            }as any
            if(this.addEditType == 'add'){
                url+='createmcpgroup';
            } else{
                url+='updatemcpgroupg';
                obj.groupid = this.selectedGroup.groupid
            }
            axios.post(url, obj).then((response: {data:any}) => {
                console.log(response);

            }).catch((err:any)=>{
                this.showHideAlert('danger', 'Internal Server error');
                console.log(err);
            })
        },
        groupSettings: function(obj:any){
            this.selectedGroup = obj;
            this.selectedMcpProduct= this.mcpMappedProduct.filter((element: any)=>{
                return element.groupid == obj.groupid;
            })
            this.mcpsettingsDialog = true;
        },
        showHideAlert: function(type:String, text:String){
            this.alertType = type;
            this.alertText = text;
            this.showAlert = true;
            setTimeout(() => {
               this.showAlert = false; 
            }, 3000);
        },
        saveMcpGroupMapping: function(){
            let url = this.env+'category_product/Createmcproductgroup';
            let obj = {
                groupid: this.selectedGroup,
                products: this.selectedMcpProduct
            }
            axios.post(url, obj).then((response: {data:any}) => {
                console.log(response);

            }).catch((err:any)=>{
                this.showHideAlert('danger', 'Internal Server error');
                console.log(err);
            })
        }
    },
    created(){
        this.getGroups();
    }
})
</script>