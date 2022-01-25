<script>

    import {filtered_products,products} from "../stores"
    export let title;
    export let pre_filter_list;
    export let filter_property;

    let selected_filters = {};
    let filter_criteria = [...new Set(pre_filter_list.map((a) => {a.category}))];

    function updateFilterCriteria(products,property){ 
        filter_criteria = [...new Set(products.map((a) => a[property]))]
    }

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

    $: filter_list(pre_filter_list,selected_filters,filter_property)
    $: updateFilterCriteria(pre_filter_list,filter_property);
</script>

<p>{title}</p>
<div class="btn-group" role="group">
{#each filter_criteria as criteria}
    <input type="checkbox" class="btn-check" name="btnradio" id="{criteria}" autocomplete="off" bind:checked={selected_filters[criteria]}/>
    <label class="btn btn-outline-primary" for="{criteria}">{criteria}</label>
{/each}
</div>