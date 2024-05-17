<script lang="ts">
    import { Tabs } from "bits-ui";
    import Login from "$lib/components/lockscreen/Login.svelte";
    import Register from "$lib/components/lockscreen/Register.svelte";
</script>

<main class="relative h-screen bg-cover bg-no-repeat text-center" style="background-image: url('/background.jpg')">
    <div class="bottom-0 left-0 right-0 top-0 h-full w-full" style="background-color: rgba(0, 0, 0, 0.4)">
        <div class="flex h-full flex-col items-center justify-center">
            <p class="text-4xl font-bold text-white pt-10">The Competitive Mode is offline now! Please contact s_foltin22@stud.hwr-berlin.de</p>
            <Tabs.Root
                value="login"
                class="w-[390px] p-3 rounded-xl bg-slate-200"
            >
            <Tabs.List
                class="grid w-full grid-cols-2 gap-1 rounded-9px bg-dark-10 p-1 text-sm font-semibold leading-[0.01em]"
            >
                <Tabs.Trigger
                    value="login"
                    class="text-xl font-bold py-2 border-b data-[state=active]:border-sky-500 data-[state=active]:text-sky-500"
                >
                    Login
                </Tabs.Trigger>
                <Tabs.Trigger
                    value="register"
                    class="text-xl font-bold py-2 border-b data-[state=active]:border-sky-500 data-[state=active]:text-sky-500"
                >
                    Register
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="login" class="pt-3 h-60">
                    <Login />
            </Tabs.Content>
            <Tabs.Content value="register" class="pt-3 h-60">
                    <Register />
            </Tabs.Content>
            </Tabs.Root>
        </div>
    </div>
</main>