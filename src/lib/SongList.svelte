<script lang="ts">
  import { browser } from '$app/environment';
  import type { Unsubscribe } from 'firebase/auth';
  import { onSnapshot, type CollectionReference, type DocumentData, query, QueryDocumentSnapshot } from 'firebase/firestore';
  import { onDestroy, onMount } from 'svelte';

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
</script>

<ul>
  {#each songs as song}
    <li>
      <p>{song.data().name}</p>
    </li>
  {/each}
</ul>
