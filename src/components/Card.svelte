<script>
    import {cart_items,products} from "../stores"

    export let productId;
    export let productName;
    export let productPrice; 
    export let productImg;

    let isFocus = false;
    function addToCart(){
        let cartList = $cart_items;
        if(cartList.has(productId)){
            let quantity = cartList.get(productId);
            quantity += 1;
            cartList.set(productId,quantity);            
        }
        else{
            cartList.set(productId,1);
        }
        cart_items.set(cartList);

        console.log(Array.from($cart_items))
    }
    
    function deleteProduct(){
        let product_list = $products
        product_list = product_list.filter(p => {
            return p.id !== productId;
        })
        products.set(product_list);
        alert(`${productName} has been deleted.`);

        let cart_list = $cart_items
        if(cart_list.has(productId)){
            if(cart_list.delete(productId)){
                cart_items.set(cart_list);
            }
        }
        console.log(cart_list);
    }

    function onHover(e){
        isFocus = true;
    }

    function leaveHover(e){
        isFocus = false;
    }

    //cart design = id, count
</script>

<div class="card m-auto">
    <img class="card-img-top" src={productImg} alt="Product Image for {productName}"/>
    <div class="card-body">
        <div class="row">
            <h5 class="card-title" style="font-size:14px">{productName}</h5>
            <h4 class="fw-bold text-end"><sup style="font-size:small">RM</sup> {productPrice}</h4>
        </div>                   
    </div>
    <div class="card-footer text-center button">
        <button class="btn btn-primary m-1" on:click={addToCart}>Add To Cart <span class="fas fa-plus icon"></span></button>   
        <button class="btn btn-danger m-1" on:click={deleteProduct}>Delete <span class="fas fa-trash icon"></span></button>
    </div> 
</div>

<style>
    .card{
        min-width:18rem;
        max-width: 20rem;
    }

    .card img{
        max-height: 250px;
    }
 
    .button button:hover{
        transform: scale(1.1);
        transition-duration: 0.2s;
        transition-property: transform;
    }
</style>