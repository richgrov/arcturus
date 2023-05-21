<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import '../firebase';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';

  onMount(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, user => {
      if (user) {
        goto('/', { replaceState: true });
      }
    });
  });
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
