<script lang="ts">
  import { browser } from '$app/environment';
  import type { Unsubscribe } from 'firebase/auth';
  import { onSnapshot, type CollectionReference, type DocumentData, query, QueryDocumentSnapshot } from 'firebase/firestore';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';

  export let songCollection: CollectionReference<DocumentData>;

  let unsub: Unsubscribe;
  let songs: QueryDocumentSnapshot[] = [];
  onMount(() => {
    unsub = onSnapshot(query(songCollection), snapshot => {
      songs = snapshot.docs;
    });
  });

  onDestroy(() => {
    if (browser && unsub) {
      unsub();
    }
  });

  const dispatch = createEventDispatcher();
</script>

<ul>
  {#each songs as song}
    <li>
      <p>{song.data().name}</p>
      <p>{song.data().author || ''}</p>
      <button on:click={() => { dispatch('playSong', { songId: song.id }); }}>Play</button>
    </li>
  {/each}
</ul>
