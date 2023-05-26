<script lang="ts">
  import { goto } from '$app/navigation';
  import { getAuth, signOut } from 'firebase/auth';

  async function logout(event: any) {
    const auth = getAuth();
    await signOut(auth);
    goto(event.target.href);
  }
</script>

<nav>
  <a href="/">Home</a>
  <a href="/login" on:click|preventDefault={logout}>Logout</a>
</nav>

<slot />
