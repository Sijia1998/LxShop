<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span>Goods</span>
        </nav-bread>
        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">Sort by:</span>
                    <a href="javascript:;" class="default cur">Default</a>
                    <a @click="sortGoods" href="javascript:;" class="price">Price
                        <span class="icon-arrow-short" :class="{'sort-up':!sortFlag}">
                            ↓
                        </span>
                    </a>
                    <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
                        <dl class="filter-price">
                            <dt>Price:</dt>
                            <dd>
                                <a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="priceChecked=all">All</a>
                            </dd>
                            <dd v-for="(price,index) in priceFilter">
                                <a href="javascript:void(0)" :class="{'cur':priceChecked==index}" @click="setPriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
                            </dd>
                        </dl>
                    </div>

                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <li v-for="(item,index) in goodsList">
                                    <div class="pic">
                                        <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.productName}}</div>
                                        <div class="price">{{item.salePrice}}</div>
                                        <div class="btn-area">
                                            <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                                <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':mdShow}">
            <div class="md-modal-inner">
                <div class="md-top">
                    <div class="md-title">Login in</div>
                    <button class="md-close">Close</button>
                </div>
                <div class="md-content">
                    <div class="confirm-tips">
                        <div class="error-wrap">
                            <!---->
                        </div>
                        <ul>
                            <li class="regi_form_input">
                                <i class="icon IconPeople"></i> <input type="text" tabindex="1" name="loginname" placeholder="User Name" data-type="loginname" class="regi_login_input regi_login_input_left"></li>
                            <li class="regi_form_input noMargin">
                                <i class="icon IconPwd"></i> <input type="password" tabindex="2" name="password" placeholder="Password" class="regi_login_input regi_login_input_left login-input-no input_text"></li>
                        </ul>
                    </div>
                    <div class="login-wrap">
                        <a href="javascript:;" class="btn-login">登 录</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
        <model :mdShow="mdShow" v-on:close="closeModel">
            <p slot="message">
                请先登录，否则无法加入到购物车中
            </p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
            </div>
        </model>
        <model :mdShow="mdShowCart" v-on:close="closeModel">
            <p slot="message">

                <svg class="icon-status-ok">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                </svg>
                <span>加入购物车成功！</span>
            </p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
                <router-link class="btn btn--m" href="javascript:;" to="/Cart">查看购物车</router-link>
            </div>
        </model>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
import './../assets/css/base.css'
import './../assets/css/product.css'

import NavHeader from './../components/NavHeader'
import NavFooter from './../components/NavFooter'
import NavBread from './../components/NavBread'
import Model from './../components/Model'
import axios from 'axios'

export default {
    components: {
        NavHeader,
        NavFooter,
        NavBread,
        Model
    },
    props: {

    },
    //组件里的data必须是函数，这个函数返回一个object
    //vue官方不允许组件之间状态进行共享
    data() {
        return {
            mdShowCart:false,
            mdShow: false,
            trans: true,
            loading: false,
            goodsList: [],
            priceFilter: [
                {
                    startPrice: '0.00',
                    endPrice: '100.00'
                },
                {
                    startPrice: '100.00',
                    endPrice: '500.00'
                },
                {
                    startPrice: '500.00',
                    endPrice: '1000.00'
                },
                {
                    startPrice: '1000.00',
                    endPrice: '5000.00'
                }
            ],
            priceChecked: 'all',
            filterBy: false,
            overLayFlag: false,
            sortFlag: true,
            page: 1,
            pageSize: 8,
            busy: true
        }
    },
    mounted() {
        this.getGoodsList();
    },
    methods: {
        getGoodsList(flag) {
            let param = {
                page: this.page,
                pageSize: this.pageSize,
                sort: this.sortFlag ? 1 : -1,
                priceLevel: this.priceChecked
            }
            this.loading = true;
            axios.get("/goods/list", {
                params: param
            })
                .then((res) => {
                    this.loading = false;
                    let goodsData = res.data.result.list
                    // console.log(res);
                    // console.log(res.data.result.list);
                    if (res.data.status == "0") {
                        if (flag) {
                            this.goodsList = this.goodsList.concat(goodsData)
                            if (res.data.result.count == 0) {
                                this.busy = true;
                            } else {
                                this.busy = false;
                            }
                        } else {
                            this.goodsList = goodsData;
                            this.busy = false;
                        }
                    } else {
                        this.goodsList = [];
                    }

                })
        },
        sortGoods() {
            this.sortFlag = !this.sortFlag;
            this.page = 1;
            this.getGoodsList();
            this.trans = !trans
        },
        showFilterPop() {
            this.filterBy = true;
            this.overLayFlag = true
        },
        closePop() {
            this.filterBy = false;
            this.overLayFlag = false;
        },
        setPriceFilter(index) {
            this.priceChecked = index;
            this.page = 1;
            this.getGoodsList();
            this.closePop()
        },
        loadMore() {
            this.busy = true;
            setTimeout(() => {
                this.page++;
                this.getGoodsList(true)
            }, 500);
        },
        addCart(productId) {
            axios.post("/goods/addCart", {
                productId: productId
            }, )
                .then((res) => {
                    // console.log(res.data.status);
                    if (res.data.status == 0) {
                        this.mdShowCart = true;
                        this.$store.commit("updateCartCount",1);

                    } else {
                        this.mdShow = true
                    }
                })
        },
        closeModel() {
            this.mdShow = false;
            this.mdShowCart = false
        }

    }
}
</script>

<style>
.load-more {
    height: 100px;
    line-height: 100px;
    text-align: center;
}
</style>

