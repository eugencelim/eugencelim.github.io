<script>
import { afterUpdate, beforeUpdate, onMount } from "svelte";


    import {products,cart_items} from "../stores"

    export let productId;
    export let quantity;

    let product =  $products.find(x => {
        return x.id === productId;
    });

    afterUpdate(() => {
        product = null;
        product = $products.find(x => {
            return x.id === productId;
        });
    });

    function removeCartItem(){
        let cartList = $cart_items;
        console.log("Attempt to delete " + productId);
        if(cartList.has(productId)){                        
            console.log("Item Delete: " + cartList.delete(productId));
        }
        console.log(Array.from($cart_items));
        cart_items.set(cartList);
        console.log($cart_items);
    }
    
</script>

<div class="row">
    <div class="col-md-4">
        <img src={product.img} alt="Product Image for {product.name}" class="img-fluid"/>
    </div>
    <div class="col-md-6">
        <p class="fw-bold">{product.name}</p>
        <p>Quantity : {quantity}</p>
        <p>Total Price: RM <span class="fw-bolder fs-5">{product.price * quantity}</span></p>
    </div>
    <div class="col-md-2 text-end"> 
        <button class="btn btn-close btn-small" on:click={removeCartItem}></button>       
    </div>
</div>

<hr class="divider"/>

<style>
    img{
        max-height: 150px ;
    }

    hr:last-of-type{
        display:none;
    }
    @media (max-width: 768px) {
        .row{
            text-align: center;
        }
    }
</style>