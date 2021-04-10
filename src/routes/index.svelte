<script lang="ts">
  import { io } from "socket.io-client";
  import type { Socket } from "socket.io-client";
  import { saveAs } from "file-saver";
  import * as yaml from "js-yaml";

  import { onMount } from "svelte";
  import Nav from "../components/Nav.svelte";
  import type { BaseParameter, Parameter } from "../models/parameter";
  import { flatSyntax } from "../logic/syntax_tree";
  import udmYaml from "../logic/export/udm.yaml";

  let parameters: Array<Parameter>;
  let modelName: string;
  let socket: Socket;
  let modelNameFromNetwork: boolean = false;

  let parametersFromNetwork: boolean = false;
  onMount(() => {
    console.log("MOUNTED");
    socket = io();

    socket.on("modelName", (newModelName) => {
      if (modelName != newModelName) {
        modelNameFromNetwork = true;
        modelName = newModelName;
      }
    });
    socket.on("parameters", (newParameters) => {
      console.log("PARAMETERS", parameters);
      if (parameters != newParameters) {
        parametersFromNetwork = true;
        parameters = [...newParameters];
      }
    });

    socket.on("disconnect", () => {
      socket.connect();
    });
  });

  let removeParameter = (parameter: Parameter) => {
    parameters.slice(
      parameters.findIndex((p) => p == parameter),
      1
    );
    parameters = parameters;
  };

  let addParameter = () => {
    parameters.push({
      name: "",
      type: flatSyntax[0],
      required: true,
    });
    console.log("PaRAMETERS", parameters);
    parameters = parameters;
  };

  let exportModel = () => {
    console.log("logggg");
    var blob = new Blob([udmYaml(modelName, parameters)], {
      type: "text/plain;charset=utf-8",
    });

    saveAs(blob, modelName.length == 0 ? "mymodel" : modelName + ".udm.yaml");
  };

  let uploadFile = (files) => {
    console.log("FILES", files);
    if (files != undefined && files != null && (files?.length ?? 0) != 0) {
      files
        .item(0)
        .text()
        .then((text) => {
          console.log("FILE TEXT", text);
          const doc = yaml.load(text);
          console.log(doc);
          modelName = doc.name;
          parameters = (doc.parameters as Array<BaseParameter>).map((base) => {
            return {
              name: flatSyntax.find((value) => value.value == base.type).name,
              type: flatSyntax.find((value) => value.value == base.type),
              required: base.required,
            } as Parameter;
          });
        });
    }
  };

  $: parametersFromNetwork
    ? (parametersFromNetwork = false)
    : parameters != null
    ? socket?.emit("parameters", parameters)
    : null;
  $: modelNameFromNetwork
    ? (modelNameFromNetwork = false)
    : modelName != null
    ? socket?.emit("modelName", modelName)
    : null;
</script>

<svelte:head>
  <title>Unified Data Modeler</title>
</svelte:head>
<Nav />
<input placeholder="Model Name" bind:value={modelName} />
<table>
  <tr>
    <th> Name </th>
    <th> Required </th>
    <th> Type </th>
  </tr>
  {#if parameters != null}
    {#each parameters as paramater}
      <tr>
        <td><input bind:value={paramater.name} /></td>
        <td><input bind:checked={paramater.required} type="checkbox" /></td>
        <td
          ><select
            name="DataTypes"
            bind:value={paramater.type.value}
            bind:textContent={paramater.type.name}
            contenteditable
          >
            {#each flatSyntax as type}
              <option value={type.value}>{type.name}</option>
            {/each}
          </select></td
        >
        <td><button on:click={() => removeParameter(paramater)}>x</button></td>
      </tr>
    {/each}
  {/if}
</table>
<button on:click={addParameter}>Add Parameter</button>
<button on:click={exportModel}>Export</button>
<input type="file" on:change={uploadFile} accept=".yaml" />

<style>
  th {
    text-align: start;
    padding: 8px;
  }

  input {
    text-transform: lowercase;
  }
  td {
    text-align: center;
  }
  :global(body) {
    font-family: "Courier Prime", monospace;
  }
</style>
