<script>
    import {filter_by_search} from "./helper";
    import {searched_products,products} from "../stores"
    let search_phrase;
    
    export let toggleFunction;

    function search_product(search_ph,products){
        if(search_ph){
            let results = filter_by_search(products,search_ph);
            searched_products.set(results)
        }
        else{
            searched_products.set(products)
        }
    }

    $: search_product(search_phrase,$products)
</script>

<div class="input-group">
    <input type="search" class="form-control" bind:value={search_phrase} placeholder="Search Something..."/>
    <button class="btn btn-secondary" on:click={toggleFunction}><span class="fas fa-filter"></span></button>
</div>
