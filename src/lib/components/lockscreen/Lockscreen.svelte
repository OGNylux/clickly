<script lang="ts">
    import { Tabs } from "bits-ui";
    import Login from "./Login.svelte";
    import Register from "./Register.svelte";
</script>

<div class="pt-6">
    <Tabs.Root
      value="outbound"
      class="w-[390px] rounded-card border border-muted bg-background p-3 bg-slate-400 rounded-xl shadow-card"
    >
      <Tabs.List
        class="grid w-full grid-cols-2 gap-1 rounded-9px bg-dark-10 p-1 text-sm font-semibold leading-[0.01em] shadow-mini-inset"
      >
        <Tabs.Trigger
          value="outbound"
          class="h-8 rounded-[7px] bg-transparent py-2 data-[state=active]:bg-white data-[state=active]:shadow-mini dark:data-[state=active]:bg-background"
          >Login</Tabs.Trigger
        >
        <Tabs.Trigger
          value="inbound"
          class="h-8 rounded-[7px] bg-transparent py-2 data-[state=active]:bg-white data-[state=active]:shadow-mini dark:data-[state=active]:bg-background"
          >Register</Tabs.Trigger
        >
      </Tabs.List>
      <Tabs.Content value="outbound" class="pt-3">
            <Login />
      </Tabs.Content>
      <Tabs.Content value="inbound" class="pt-3">
            <Register />
      </Tabs.Content>
    </Tabs.Root>
  </div>
