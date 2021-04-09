<script lang="ts">
  import { io } from "socket.io-client";

  import successkid from "images/successkid.jpg";
  import { onMount } from "svelte";
  onMount(() => {
    console.log("MOUNTED");
    const socket = io();
	socket.emit('test')
    socket.on('ok',(args) => {
      console.log("ok",args);
    });
    // socket.on("connection", () => {
    //   console.log("revieved connection from socket");

    //   socket.emit('test')
    // });
  });
</script>

<svelte:head>
  <title>Unified Data Modelers</title>
</svelte:head>

<h1>Great success!</h1>

<figure>
  <img alt="Success Kid" src={successkid} />
  <figcaption>Have fun with Sapper!</figcaption>
</figure>

<p>
  <strong
    >Try editing this file (src/routes/index.svelte) to test live reloading.</strong
  >
</p>

<style>
</style>
