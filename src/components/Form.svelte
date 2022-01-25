<script>
    import {products} from "../stores"

    let name;
    let price;
    let category;
    let seller;

    function addProduct(){
        let productId = $products.length

        let newProd = {
            'id':productId,
            'name':name,
            'price':price,
            'seller':seller,
            'category':category
        }

        let existingProd = $products;
        existingProd.push(newProd);
        products.set(existingProd);

        resetValue();
        bootstrap.Modal.getInstance(document.getElementById("addProductModal")).hide()
        alert("Product created.")
    }

    function resetValue(){
        name = null;
        price = null;
        category = null;
        seller = null;
    }
</script>

<!-- <div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        
      </div>
    </div>
</div> -->
<form on:submit|preventDefault={addProduct}>
    <div class="modal-header">
        <h5 class="modal-title">New Product</h5>
     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">            
        <div class="form-floating mb-3">
            <input type="text" id="product_name" class="form-control" placeholder="Product Name" required bind:value={name}/>
            <label for="product_name">Product Name</label>
        </div>
        
        <div class="form-floating mb-3">
            <input type="number" step="0.01" id="product_price" class="form-control" placeholder="Product Price" required bind:value={price}/>
            <label for="product_price">Price (RM)</label>
        </div>
            
        <div class="form-floating mb-3">
            <input type="text" id="seller" class="form-control" placeholder="Seller" required bind:value={seller}/>
            <label for="seller">Seller</label>
        </div>
            
        <div class="form-floating mb-3">
            <input type="text" id="product_category" class="form-control" placeholder="Product Category" required bind:value={category}/>
            <label for="product_category">Category</label>
        </div>
    </div>

    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="submit" class="btn btn-primary">Create</button>
    </div>
</form>