<script lang="ts">
    import { isSoundOn } from "$lib/store";
    import { Checkbox, Label } from "bits-ui";
    import { Check } from "lucide-svelte";


    let check = isSoundOn.get();
</script>
   
  <div class="flex items-center">
    <Label.Root
      id="soundsOn-label"
      for="soundsOn"
      class="font-medium leading-none grow"
    >
      Ambient Sounds
    </Label.Root>
    <Checkbox.Root
      id="soundsOn"
      aria-labelledby="soundsOn-label"
      class="inline-flex size-[25px] items-center justify-center rounded-md border border-muted transition-all duration-150 ease-in-out active:scale-98 data-[state=unchecked]:border-border-input data-[state=unchecked]:bg-background data-[state=unchecked]:hover:border-dark-40"
      checked={check}
      onCheckedChange={() => {
        check = !check;
        isSoundOn.set(check);
      }}
    >
      <Checkbox.Indicator
        let:isChecked
        class="inline-flex items-center justify-center"
      >
        {#if isChecked}
          <Check class="size-[15px]" />
        {/if}
      </Checkbox.Indicator>
    </Checkbox.Root>
  </div>