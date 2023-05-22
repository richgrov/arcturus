<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import '$lib/firebase';
  import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

  onMount(() => {
    const auth = getAuth();
    
    onAuthStateChanged(auth, user => {
      if (user) {
        goto('/', { replaceState: true });
      }
    });
  });

  let usernameEl: HTMLInputElement;
  let passwordEl: HTMLInputElement;

  function onFormSubmit() {
    if (!usernameEl.value || !passwordEl.value) {
      return;
    }

    const auth = getAuth();
    signInWithEmailAndPassword(auth, usernameEl.value, passwordEl.value)
      .then(() => goto('/'))
      .catch(console.error);
  }
</script>

<form on:submit={onFormSubmit}>
  <label for="login-username">email</label>
  <input type="email" bind:this={usernameEl} id="login-username" autocomplete="username" required>
  <label for="login-password">password</label>
  <input type="password" bind:this={passwordEl} id="login-password" autocomplete="current-password" required>
  <input type="submit">
</form>
