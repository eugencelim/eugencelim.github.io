<script>
import { onMount } from "svelte";

    import {searched_products,filtered_products,products} from "../stores"
    import Filter_Button from "./Filter_Button.svelte"

    let filter_criteria = [...new Set($searched_products.map((a) => {a.category}))].sort();
    let filter_seller = [...new Set($filtered_products.map((a) => {a.seller}))].sort();

    function updateFilterCriteria(products){
        filter_criteria = [...new Set(products.map((a) => a.category))].sort()
    }

    function updateFilterSeller(products){
        filter_seller = [...new Set(products.map((a) => a.seller))].sort()
    }

    let selected_filters = {};
    let selected_seller = {};
    function filter_list(searched_list, selected_filters, filter_key){
        let selected_filter_keys = Object.keys(selected_filters).filter(function(k){
            return selected_filters[k] !== false;
        });

        let filter_results;
        if(selected_filter_keys.length){
            filter_results = searched_list.filter((obj) => {
                for (let key of selected_filter_keys){
                    if(obj[filter_key] === key){
                        return true;
                    }
                }
                return false;
            })
        }
        else{
            filter_results = searched_list;
        }
        filtered_products.set(filter_results);
    }

    let minPrice;
    let maxPrice;
    function filterByPriceRange(searched_list,min,max){
        let filter_result;
        if(minPrice && maxPrice){
            filter_result = $filtered_products.filter((obj) => {
                return (obj.price >= minPrice && obj.price <= maxPrice);
            })
        }
        else if(minPrice){
            filter_result = $filtered_products.filter((obj) => {
                return (obj.price >= minPrice);
            })
        }
        else if(maxPrice){
            filter_result = $filtered_products.filter((obj) => {
                return (obj.price <= maxPrice);
            })
        }
        else{
            filter_result = $filtered_products;
        }
        filtered_products.set(filter_result)
    }

    $: filter_list($searched_products,selected_filters,"category",$products,selected_seller,minPrice,maxPrice)
    $: updateFilterCriteria($searched_products);

    $: updateFilterSeller($filtered_products);
    $: filter_list($filtered_products,selected_seller,"seller")

    $: filterByPriceRange($filtered_products,minPrice,maxPrice)
</script>

<div>
    <div>
        <div class="mb-2">
            <!-- <Filter_Button title="Filtered By Category: " pre_filter_list={$searched_products} filter_property="category"/> -->
            <p>Filtered By Category: </p>
            <div class="btn-group" role="group">
            {#each filter_criteria as criteria}
                <input type="checkbox" class="btn-check" name="btnradio" id="{criteria}" autocomplete="off" bind:checked={selected_filters[criteria]}/>
                <label class="btn btn-outline-primary" for="{criteria}">{criteria}</label>
            {/each}
            </div>
        </div>

        <div class="mb-2">
            <!-- <Filter_Button title="Filtered By Seller: " pre_filter_list={$filtered_products} filter_property="seller"/> -->
            <p>Filtered By Seller: </p>
            <div class="btn-group" role="group">
                {#each filter_seller as seller}
                    <input type="checkbox" class="btn-check" name="btnradio" id="{seller}" autocomplete="off" bind:checked={selected_seller[seller]}/>
                    <label class="btn btn-outline-primary" for="{seller}">{seller}</label>
                {/each}
            </div>
        </div>

        <div class="mb-2">
            <p>Filtered By Price Range: </p>
            <div class="col-auto"></div>
            <input type="number" class="form-control" id="min" placeholder="Min (RM)" bind:value={minPrice}/>
            <input type="number" class="form-control" id="max" placeholder="Max (RM)" bind:value={maxPrice}/>
        </div>
    </div>
</div>