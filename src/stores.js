import {writable} from "svelte/store"

export let products = writable([])
export let searched_products = writable([])
export let filtered_products = writable([])
export let cart_items = writable(new Map())

//test 
