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
                        <span>↑</span>
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
                                            <a href="javascript:;" class="btn btn--m">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                                加载中...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
import './../assets/css/base.css'
import './../assets/css/checkout.css'
import './../assets/css/login.css'
import './../assets/css/product.css'

import NavHeader from './../components/NavHeader'
import NavFooter from './../components/NavFooter'
import NavBread from './../components/NavBread'
import axios from 'axios'

export default {
    components: {
        NavHeader,
        NavFooter,
        NavBread
    },
    props: {

    },
    //组件里的data必须是函数，这个函数返回一个object
    //vue官方不允许组件之间状态进行共享
    data() {
        return {
            goodsList: [],
            priceFilter: [
                {
                    startPrice: '0.00',
                    endPrice: '500.00'
                },
                {
                    startPrice: '500.00',
                    endPrice: '1000.00'
                },
                {
                    startPrice: '1000.00',
                    endPrice: '2000.00'
                }
            ],
            priceChecked: 'all',
            filterBy: false,
            overLayFlag: false,
            sortFlage: true,
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
                sort: this.sortFlage ? 1 : -1,
            }
            axios.get("/goods", {
                params: param
            })
                .then((res) => {
                    let goodsData = res.data.result.list
                    console.log(res);
                    
                    console.log(res.data.result.list);
                    if (res.data.status == "0") {
                        if (flag) {
                            this.goodsList = this.goodsList.concat(goodsData)

                            if(res.data.result.count == 0){
                                this.busy = true;
                            }else{
                                this.busy = false;
                            }
                        }else{
                            this.goodsList = goodsData;
                            this.busy = false;
                        }
                    }else{
                            this.goodsList = [];
                        }

                })
        },
        sortGoods() {
            this.sortFlage = !this.sortFlage;
            this.page = 1;
            this.getGoodsList();
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
            this.closePop()
        },
        loadMore() {
            this.busy = true;
            setTimeout(() => {
                this.page++;
                this.getGoodsList(true)
            }, 500);
        }
    }
}
</script>
