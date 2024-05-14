import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import devtools from 'solid-devtools/vite'

export default defineConfig({
  plugins: [
    devtools({
      /* features options - all disabled by default */
      autoname: true,
    }),
    solid()
  ],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  base: "/solidui/"
})
