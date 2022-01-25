<script>
    import Card from "./Card.svelte"
    import {products,searched_products,filtered_products} from "../stores"

</script>

<div class="container">
    <div class="card-group justify-content-center">
        {#if $filtered_products.length}
            {#each $filtered_products as product }
                <Card productId={product.id} productName={product.name} productPrice={product.price} productImg={product.img}/>
            {/each}
        {:else}
            <p class="text-center">No product available.</p>
        {/if}
        
    </div>
</div>