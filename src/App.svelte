<script>
	import {products} from "./stores"
	import List from "./components/List.svelte"
	import Search from "./components/Search.svelte"
	import Form from "./components/Form.svelte"
	import Filter from "./components/Filter.svelte"
	import Cart from "./components/Cart.svelte"
	import Modal from "./components/Modal.svelte";
	import Sort from "./components/Sort.svelte";
	import {slide} from "svelte/transition";	
	// import { PictureSelector} from "./components/PictureSelector.svelte"
	import { onMount } from "svelte";
	
	let isFilterShow = false;

	function toggleFilter(){
		isFilterShow = !isFilterShow;
	}
	
	function displayNotification() {
    	if (Notification.permission == 'granted') {			
			navigator.serviceWorker.getRegistration().then(function(reg) {
				reg.showNotification("Testing");
			});
		}
		else{
			console.log("Permission not granted.")
		}
  	}

	function requestPermission(){
		Notification.requestPermission(function(status) {
    		console.log('Notification permission status:', status);
		});
	}	
</script>

<main>
	<div class="container p-2">
		<h2>Product Available</h2>
		<button class="btn btn-primary" on:click={displayNotification}>Push Notification</button>
		<button class="btn btn-primary" on:click={requestPermission}>Request Notification Permission</button>
		<div class="row mb-3">
			<div class="col">
				<Search toggleFunction={toggleFilter}/>
			</div>
			<div class="col">
				<div class="float-end">
					<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProductModal">Create New Product <span class="fas fa-plus"></span></button>
					<button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#cartModal">View Cart <span class="fas fa-shopping-cart"></span></button>
				</div>
			</div>
		</div>
		{#if isFilterShow}			
			<div class="row" transition:slide="{{delay:0,duration:300}}">
				<div class="col mb-3">
					<Filter />
				</div>	
				<div class="col mb-3">
					<Sort />
				</div>
			</div>
		{/if}
		<div class="row">
			<List />
		</div>
		<div class="row">			
			<label for="imageFile">Upload a photo</label>
			<input type="file" id="imageFile" capture="user" accept="image/*" class="form-control">
		</div>
	</div>
	
	<Modal modalId=addProductModal>
		<Form />
	</Modal>

	<Modal modalId=cartModal size=1>
		<Cart />
	</Modal>
</main>

<style>
	@media (max-width: 768px) {
		.btn{
			width:100%;
		}
		.col{
			display: block;
			flex: none;
		}
		.float-end{
			float:none !important;
			
		}
	}
</style>