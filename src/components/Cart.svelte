<script>
    import {cart_items} from "../stores"
    import Cart_Item from "./Cart_Item.svelte"
    import { onMount } from "svelte";

    function clearAllCartItem(){
        cart_items.set(new Map());
    }
</script>


<!-- <div class="modal fade" tabindex="-1" role="dialog" id='cartModal' aria-labelledby="cartModal" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
       
      </div>
    </div>
  </div> -->

<div class="modal-header">
    <h5 class="modal-title">My Cart</h5>
    <!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
</div>
<div class="modal-body">
    {#if $cart_items.size}
        {#each Array.from($cart_items) as [key,value]}
        <!-- {@debug Array.from($cart_items)} -->
            <!-- <p>ID: {key} Quantity: {value}</p> -->
            <Cart_Item productId={key} quantity={value}/>
        {/each}
    {:else}
        <p class="text-center">No Product added to cart.</p>
    {/if}
</div>
<div class="modal-footer">
    {#if $cart_items.size}
        <button class="btn btn-danger" on:click={clearAllCartItem}>Clear All Cart Item <span class="fas fa-trash"></span></button>
    {/if}
    <button class="btn btn-secondary" data-bs-dismiss="modal">Close </button> 
</div>