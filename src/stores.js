import {writable} from "svelte/store"

export let products = writable([{
    "id":1,
    "name":"Huawei Smart Phone",
    "price":1500.00,
    "seller":"Huawei", 
    "category":"Electronic",
    "img":"https://picsum.photos/200"
},
{
    "id":2,
    "name":"Xiaomi TWS Earphone",
    "price":99.00,
    "seller":"Xiaomi",
    "category":"Electronic",
    "img":"https://picsum.photos/200"
},
{
    "id":3,
    "name":"Xiaomi Smart Sensor",
    "price":50.00,
    "seller":"Xiaomi",
    "category":"Electronic",
    "img":"https://picsum.photos/200"
},
{
    "id":4,
    "name":"Black Hoodie",
    "price":89.00,
    "seller":"UNIQLO",
    "category":"Clothing",
    "img":"https://picsum.photos/200"
},
{
    "id":5,
    "name":"Kacang Putih",
    "price":10.00,
    "seller":"Signature Market",
    "category":"Food",
    "img":"https://picsum.photos/200"
},
{
    "id":6,
    "name":"Kacang Hitam",
    "price":8.00,
    "seller":"Signature Market",
    "category":"Food",
    "img":"https://picsum.photos/200"
},
{
    "id":7,
    "name":"Kacang Hijau",
    "price":12.00,
    "seller":"Signature Market",
    "category":"Food",
    "img":"https://picsum.photos/200"
}])

export let searched_products = writable([])
export let filtered_products = writable([])
export let cart_items = writable(new Map())