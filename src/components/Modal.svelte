<script>
    export let size;
    export let modalId;

    let sizeClass = size >= 1 ? "modal-lg" : size < 0 ? "modal-sm":""
</script>

<div class="modal fade" tabindex="-1" role="dialog" id='{modalId}' aria-labelledby="{modalId}" aria-hidden="true">
    <div class="modal-dialog {sizeClass}">
        <div class="modal-content">
            <slot></slot>
        </div>
    </div>
  </div>