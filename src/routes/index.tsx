import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "solid-start";

import * as firebase from "../lib/firebase";
import logo from "../../public/arcturus.png";

export default function Index() {
  return (
    <div>
      <div class="max-w-md mx-auto text-center">
        <img src={logo} alt="Logo" class="mx-auto py-20" />
        <LoginForm />
      </div>
    </div>
  );
}

function LoginForm() {
  const auth = firebase.auth();
  const navigate = useNavigate();

  firebase.onAuthChange((user) => {
    if (user) {
      navigate("/app");
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

    signInWithEmailAndPassword(auth, username, password).catch(console.error);
  }

  return (
    <form onSubmit={onSubmit}>
      <label for="login-username">Email</label>
      <input
        type="email"
        ref={usernameEl}
        id="login-username"
        autocomplete="username"
        class="w-full"
        required
      />
      <label for="login-password">Password</label>
      <input
        type="password"
        ref={passwordEl}
        id="login-password"
        autocomplete="current-password"
        class="w-full"
        required
      />
      <input type="submit" class="w-full mt-5" />
    </form>
  );
}
