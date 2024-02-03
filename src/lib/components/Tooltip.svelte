<script lang="ts">
    /**
     * Tooltip component is used to display a tooltip on hover or focus.
     * Note that the title prop can receive HTML (e.g. for complex information).
     * <Tooltip title="This is a tooltip"> ... </Tooltip>
     */
	export let title: string;

    const offset = 10;

	let isHovered = false,
        x = 0,
	    y = 0;
	
	function mouseOver(event: MouseEvent) {
		isHovered = true;
		x = event.pageX + offset;
		y = event.pageY + offset;
	}

	function mouseMove(event: MouseEvent) {
		x = event.pageX + offset;
		y = event.pageY + offset;
	}

	function mouseLeave() {
		isHovered = false;
	}

    function focusHandler(event: FocusEvent) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        x = rect.x + offset;
        y = rect.y + offset;
        isHovered = true;
    }
</script>

<div
    role="button"
    tabindex="0"
    on:mouseover={mouseOver}
    on:focus={focusHandler}
    on:mouseleave={mouseLeave}
    on:mousemove={mouseMove}>
    <slot />
</div>

{#if isHovered}
	<div 
        style="top: {y}px; left: {x}px;" 
        class="fixed z-20 bg-slate-700 text-white shadow-lg p-2 rounded ">
        {@html title}
    </div>
{/if}