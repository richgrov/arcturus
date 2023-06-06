import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'solid-start';

import * as firebase from '../lib/firebase';

export default function Index() {
  const auth = firebase.auth();
  const navigate = useNavigate();

  firebase.onAuthChange(user => {
    if (user) {
      navigate('/app');
    }
  });

  let usernameEl: HTMLInputElement | undefined;
  let passwordEl: HTMLInputElement | undefined;

  function onSubmit(e: Event) {
    e.preventDefault();

    const username = usernameEl!.value;
    const password = passwordEl!.value;
    if (!username || !password) {
      return;
    }

    signInWithEmailAndPassword(auth, username, password)
      .catch(console.error);
  }

  return <form onSubmit={onSubmit}>
    <label for="login-username">email</label>
    <input type="email" ref={usernameEl} id="login-username" autocomplete="username" required />
    <label for="login-password">password</label>
    <input type="password" ref={passwordEl} id="login-password" autocomplete="current-password" required />
    <input type="submit" />
  </form>
}
