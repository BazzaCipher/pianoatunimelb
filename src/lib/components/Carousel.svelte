<script>
    export let images;
	const image_root = "../images/"
</script>

<div class="carousel">
    <div class="carousel_container">
        {#each images as image}
            <img class = "carousel_image" 
				src={image_root + image.path}
				alt={image_root+image.path}/>
        {/each}
    </div>
</div>

<style>
    .carousel {
        display: flex;
        overflow-x: auto;
        position: relative;
        width: 100%;
    }
    .carousel_container {
        display: flex;
    }
	.carousel_image {
		height: 200px;
		margin: 3px;
		border-radius: 15px;
	}
	@media (min-width: 500px) {
		.carousel {
			margin-left: calc(-100vw / 2 + 800px / 2);
			margin-right: calc(-100vw / 2 + 800px / 2);
		}
	}
</style>
