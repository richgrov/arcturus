<script lang="ts">
  import { goto } from '$app/navigation';
  import { onDestroy, onMount, setContext } from 'svelte';

  import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
  import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore';

  import * as firebase from '$lib/firebase';
  import * as appState from '$lib/app-state';

  let unsubDocument: Unsubscribe;

  const context = setContext<appState.State>(appState.key, {
    songCache: {},
    queue: [],
  });

  onMount(() => {
    const auth = getAuth();

    const unsub = onAuthStateChanged(auth, user => {
      unsub();

      if (!user) {
        goto('/login', { replaceState: true });
        return;
      }

      const db = firebase.firestore();
      const userDoc = doc(db, 'users', user.uid);
      unsubDocument = onSnapshot(userDoc, snapshot => {
        const queue = snapshot.get('queue');
        if (Array.isArray(queue)) {
          context.queue = queue;
        }
      });
    });
  });

  onDestroy(() => {
    unsubDocument?.();
  });

  async function logout() {
    const auth = getAuth();
    signOut(auth);
  }
</script>

<nav>
  <a href="/">Home</a>
  {#if context.queue.length > 0}
    <a href="/queue">Queue ({context.queue.length})</a>
  {:else}
    <a href="/queue">Queue</a>
  {/if}
  <a href="/login" on:click|preventDefault={logout}>Logout</a>
</nav>

<slot />
