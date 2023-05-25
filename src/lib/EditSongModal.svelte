<script lang="ts">
  import { setDoc, type DocumentReference } from "firebase/firestore";
  import { uploadBytes, type StorageReference } from "firebase/storage";

  let formName: HTMLInputElement;
  let formAuthor: HTMLInputElement;
  let formFile: HTMLInputElement;

  export let initialValues: any;
  export let doc: DocumentReference;
  export let fileRef: StorageReference;

  async function submit() {
    await setDoc(doc, {
      name: formName.value,
      author: formAuthor.value,
    }, { merge: true });

    if (formFile.files!.length > 0) {
      const file = formFile.files![0];
      await uploadBytes(fileRef, file, { customMetadata: { fileName: formFile.value } });
    }
  }
</script>

<form on:submit={submit}>
  <label for="edit-name">Name</label>
  <input type="text" id="edit-name" bind:this={formName} value={initialValues.name}>
  <label for="edit-author">Author</label>
  <input type="text" id="edit-author" bind:this={formAuthor} value={initialValues.author || ''}>
  <label for="edit-file">Change Audio</label>
  <input type="file" id="edit-file" bind:this={formFile}>
  <input type="submit">
</form>
