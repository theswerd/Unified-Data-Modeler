<script lang="ts">
  import { io } from "socket.io-client";
  import type { Socket } from "socket.io-client";

  import dataTypes from "../models/data_types";
  import { onMount } from "svelte";
  import Nav from "../components/Nav.svelte";
  import type { Parameter } from "../models/parameter";

  let parameters: Array<Parameter>;

  let socket: Socket;
  let fromNetwork: boolean = false;
  onMount(() => {
    console.log("MOUNTED");
    socket = io();
    socket.on("parameters", (newParameters) => {
      console.log("PARAMETERS", parameters);
      if (parameters != newParameters) {
        fromNetwork = true;
        parameters = [...newParameters];
      }
    });

    socket.on("disconnect", () => {
      socket.connect();
    });
  });

  let removeParameter = (index) => {
    parameters.splice(index, 1);
    parameters = parameters;
  };

  let addParameter = () => {
    parameters.push({
      name: "",
      type: dataTypes[0],
      required: true,
    });
    parameters = parameters;
  };

  $: fromNetwork ? fromNetwork = false :   parameters != null? socket?.emit("parameters", parameters): null;
</script>

<svelte:head>
  <title>Unified Data Modelers</title>
</svelte:head>
<Nav />
<table>
  <tr>
    <th> Name </th>
    <th> Required </th>
    <th> Type </th>
  </tr>
  {#each parameters as paramater, index}
    <tr>
      <td><input bind:value={paramater.name} /></td>
      <td><input bind:checked={paramater.required} type="checkbox" /></td>
      <td
        ><select
          name="DataTypes"
          bind:value={parameters[index].type.value}
          bind:textContent={parameters[index].type.text}
          contenteditable
        >
          {#each dataTypes as type}
            <option value={type.value}>{type.text}</option>
          {/each}
        </select></td
      >
    </tr>
  {/each}
</table>
<button on:click={addParameter}>Add Parameter</button>

<style>
  th {
    text-align: start;
    padding: 8px;
  }
</style>
