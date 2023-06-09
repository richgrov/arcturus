import { signOut } from "firebase/auth";

import * as firebase from "~/lib/firebase";

export default function Settings() {
  const auth = firebase.auth();

  function logout() {
    signOut(auth);
  }

  return <button onClick={logout}>Logout</button>;
}
