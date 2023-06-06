import solid from 'solid-start/vite';
import solidStartStatic from 'solid-start-static';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    solid({
      ssr: false,
      adapter: solidStartStatic(),
    })],
});
