<script lang="ts">
  import { goto } from '$app/navigation';
  import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
  import { onMount } from 'svelte';

  onMount(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, user => {
      if (!user) {
        goto('/login', { replaceState: true });
        return;
      }
    });
  });

  async function logout() {
    const auth = getAuth();
    signOut(auth);
  }
</script>

<nav>
  <a href="/">Home</a>
  <a href="/queue">Queue</a>
  <a href="/login" on:click|preventDefault={logout}>Logout</a>
</nav>

<slot />
