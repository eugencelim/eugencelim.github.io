<script>
import { afterUpdate } from "svelte";

import {fade} from "svelte/transition"
import {filtered_products} from "../stores"

let options = [{
    "name":"Name",
    "property":"name"
},
{
    "name":"Seller",
    "property":"seller"
},
{
    "name":"Category",
    "property":"category"
},
{
    "name":"Price",
    "property":"price"
}]

let selectedOption = null;

function sortList(option){ 
    if(option != null){
        let list = $filtered_products
        console.log(option)
        list = list.sort((a,b) => {
            if(isAscending){
                return b[option] < a[option] ? 1 : -1;
            }   
            else{
                return a[option] < b[option] ? 1 : -1;
            }
        })
        filtered_products.set(list);
    }
}

$: sortList(selectedOption,isAscending);

let isAscending = false;
let iconClass = "fa-sort-alpha-up"
function toggleOrder(){
    isAscending = !isAscending;
    iconClass = isAscending ? "fa-sort-alpha-down" : "fa-sort-alpha-up"
}
</script>

<div class="mb-2 text-end">
    <!-- <Filter_Button title="Filtered By Seller: " pre_filter_list={$filtered_products} filter_property="seller"/> -->
    <p class="">Sort By: <span class="btn fas {iconClass}" id="sort_icon" on:click={toggleOrder} transition:fade></span></p>
    <div class="btn-group" role="group">
        {#each options as option}
            <input type="radio" class="btn-check" id={option.name} autocomplete="off" name="option" value={option.property} bind:group={selectedOption}/>
            <label class="btn btn-outline-secondary" for="{option.name}">{option.name}</label>
        {/each}
    </div>
</div>

<style>
    @media (max-width: 768px) {
		.text-end{
			text-align:left !important;
		}
	}
</style>
