<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span>Cart</span>
        </nav-bread>
        <div class="container">
            <div class="cart">
                <div class="page-title-normal">
                    <h2 class="page-title-h2">
                        <span>My Cart</span>
                    </h2>
                </div>
                <div class="item-list-wrap">
                    <div class="cart-item">
                        <div class="cart-item-head">
                            <ul>
                                <li>Items</li>
                                <li>Price</li>
                                <li>Quantity</li>
                                <li>Subtotal</li>
                                <li>Edit</li>
                            </ul>
                        </div>
                        <ul class="cart-item-list">
                            <li v-for="item in cartList">
                                <div class="cart-tab-1">
                                    <div class="cart-item-check">
                                        <a href="javascipt:;" class="checkbox-btn item-check-btn" :class="{'check':item.checked=='1'}" @click="editCart('checked',item)">
                                            <svg class="icon icon-ok">
                                                <use xlink:href="#icon-ok"></use>
                                            </svg>
                                        </a>
                                    </div>
                                    <div class="cart-item-pic">
                                        <img :alt="item.productName" :src="'/static/'+item.productImage" lazy="loaded">
                                    </div>
                                    <div class="cart-item-title">
                                        <div class="item-name">{{item.productName}}</div>
                                    </div>
                                </div>
                                <div class="cart-tab-2">
                                    <div class="item-price">{{item.salePrice | currency('$')}}</div>
                                </div>
                                <div class="cart-tab-3">
                                    <div class="item-quantity">
                                        <div class="select-self select-self-open">
                                            <div class="select-self-area">
                                                <span class="input-sub" @click="editCart('minu',item)">-</span>
                                                <span class="select-ipt">{{item.productNum}}</span>
                                                <span class="input-add" @click="editCart('add',item)">+</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="cart-tab-4">
                                    <div class="item-price-total">{{(item.productNum*item.salePrice) | currency('$')}}</div>
                                </div>
                                <div class="cart-tab-5">
                                    <div class="cart-item-opration">
                                        <!-- <input class="cart-btn" type="button" style="width: 70px;height: 30px;" value="删除"> -->
                                        <a href="javascript:;" @click="delCartConfirm(item)">
                                            <Icon type="ios-trash" size="24" color="#ed1414" />
                                        </a>
                                    </div>
                                </div>
                            </li>

                        </ul>
                    </div>
                </div>
                <div class="cart-foot-wrap">
                    <div class="cart-foot-inner">
                        <div class="cart-foot-l">
                            <div class="item-all-check">
                                <a href="javascipt:;" @click="toggleCheckAll">
                                    <span class="checkbox-btn item-check-btn" :class="{'check':checkAllFlag}">
                                        <svg class="icon icon-ok">
                                            <use xlink:href="#icon-ok"></use>
                                        </svg>
                                    </span>
                                    <span>Select all</span>
                                </a>
                            </div>
                            <div class="item-all-del hidden">
                                <a href="javascipt:;" class="item-del-btn">
                                    Delete selected
                                </a>
                            </div>
                        </div>
                        <div class="cart-foot-r">
                            <div class="item-total">
                                Item total:
                                <span class="total-price">{{totalPrice | currency('$')}}</span>
                            </div>
                            <div class="btn-wrap">
                                <a href="#/address" class="btn btn--red" :class="{'btn--dis':checkedCount == 0}" @click="checkOut">Checkout</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Model :mdShow="modelConfirm" @close="closeModel">
            <p slot="message">你确认要删除此条数据吗？</p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:;" @click="delCart">确认</a>
                <a class="btn btn--m" href="javascript:;" @click="modelConfirm = false">关闭</a>
            </div>
        </Model>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
import './../assets/css/base.css'
import './../assets/css/product.css'
import './../assets/css/checkout.css'

import NavHeader from './../components/NavHeader'
import NavFooter from './../components/NavFooter'
import NavBread from './../components/NavBread'
import Model from './../components/Model'
import axios from 'axios'
import { currency } from './../util/currency.js'

export default {
    components: {
        NavHeader,
        NavFooter,
        NavBread,
        Model
    },
    props: {},
    data() {
        return {
            cartList: [],
            modelConfirm: false,
            productId: '',
            delItem:{}
        }
    },
    computed: {
        checkAllFlag() {
            return this.checkedCount == this.cartList.length;
        },
        checkedCount() {
            let i = 0;
            this.cartList.forEach((item) => {
                if (item.checked == "1") {
                    i++;
                }
            })
            return i;
        },
        totalPrice() {
            let money = 0;
            this.cartList.forEach((item) => {
                if (item.checked == "1") {
                    money += parseFloat(item.salePrice) * parseInt(item.productNum);
                }
            })
            return money
        }
    },
    // filters:{
    //     currency:currency
    // },
    methods: {
        init() {
            axios.get('/users/cartList')
                .then((res) => {
                    let data = res.data;
                    // console.log(typeof (res.data.result[0].salePrice));
                    this.cartList = data.result;
                })
        },
        delCartConfirm(item) {
            this.modelConfirm = true;
            this.delItem = item;
        },
        delCart() {
            axios.post('/users/cartdel', {
                productId: this.delItem.productId
            })
                .then((res) => {
                    
                    let shopNum = parseInt(this.delItem.productNum);
                    console.log(typeof(shopNum));
                    let data = res.data
                    if (res.data.status == "0") {                       
                        this.modelConfirm = false;
                        this.init();
                        this.$store.commit("updateCartCount",-shopNum);
                    }
                })
        },
        closeModel() {
            this.modelConfirm = false;
        },
        editCart(flag, item) {
            if (flag == 'add') {
                item.productNum++;
            } else if (flag == 'minu') {
                if (item.productNum <= 1) {
                    return;
                }
                item.productNum--;
            } else {
                item.checked = item.checked == '1' ? '0' : '1'
            }
            axios.post('/users/carEdit', {
                productId: item.productId,
                productNum: item.productNum,
                checked: item.checked
            })
                .then((res) => {
                    let data = res.data;
                    let num = 0;
                    if(flag == 'add'){
                        num = 1;
                    }else if(flag == 'minu'){
                        num = -1;
                    }
                    this.$store.commit("updateCartCount",num);
                })
        },
        toggleCheckAll() {
            let flag = !this.checkAllFlag
            this.cartList.forEach((item) => {
                item.checked = flag ? '1' : '0';
            })
            axios.post('/users/editCheckAll', {
                checkAll: flag
            })
                .then((res) => {
                    let data = res.data;
                    if (data.status == "0") {
                        console.log("update success!");
                    }
                })
        },
        checkOut() {
            if (this.checkedCount > 0) {
                this.$router.push({
                    path:"/address"
                })
            }
        }
    },
    mounted() {
        this.init();
    }
}
</script>
<style  scoped>
.i-icon {
    display: inline-block;
    font-family: 'custom-font' !important;
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    text-rendering: auto;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    vertical-align: middle;
}
.input-add,
.input-sub {
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605f5f;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
}
.item-quantity .select-self-area .select-ipt {
    display: inline-block;
    padding: 0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
}
.select-self-area {
    width: auto;
    background: #ffffffe0;
    border-radius: 3px;
    min-width: 50px;
    max-width: 240px;
    height: 30px;
    line-height: 30px;
}
.cart-btn {
    border: 0 gainsboro;
    border-radius: 5px;
    background-color: #d1434a;
}
</style>