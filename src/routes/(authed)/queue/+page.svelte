<script lang="ts">
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { doc, getDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
  import { getContext, onDestroy, onMount } from 'svelte';

  import * as firebase from '$lib/firebase';
  import * as appState from '$lib/app-state';

  let unsubSnapshot: Unsubscribe;
  let songs = new Array<Promise<any>>();

  const context = getContext<appState.State>(appState.key);

  onMount(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, user => {
      unsub();
      if (!user) {
        return;
      }

      const db = firebase.firestore();
      const userDoc = doc(db, 'users', auth.currentUser!.uid);
      unsubSnapshot = onSnapshot(userDoc, async snapshot => {
        const queue = snapshot.get('queue');
        if (!Array.isArray(queue)) {
          return;
        }

        songs = queue.map(async songId => {
          const cached = context.songCache[songId];
          if (typeof cached !== 'undefined') {
            return cached;
          }

          const songDoc = doc(db, userDoc.path, 'songs', songId);
          return await getDoc(songDoc).then(doc => {
            context.songCache[songId] = doc.data();
            return doc.data()
          });
        });
      });
    });
  });

  onDestroy(() => unsubSnapshot?.());
</script>

{#each songs as songPromise}
  {#await songPromise}
    <p>load...</p>
  {:then song}
    <p>{song.name}</p>
    <p>{song.author}</p>
  {:catch error}
    <p>error! {error}</p>
  {/await}
{/each}
