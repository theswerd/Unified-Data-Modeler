<script lang="ts">
  import { io } from "socket.io-client";
  import type { Socket } from "socket.io-client";
  import { saveAs } from "file-saver";
  import * as yaml from "js-yaml";

  import { onMount } from "svelte";
  import Nav from "../components/Nav.svelte";
  import type { BaseParameter, Parameter } from "../models/parameter";
  import { flatSyntax, flatMap, syntaxTree } from "../logic/syntax_tree";
  import udmYaml from "../logic/export/udm.yaml";
  import ts from "../logic/export/ts";

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

  let removeParameter = (index: number) => {
    parameters.splice(
      index,
      1
    );
    parameters = parameters;
  };

  let clear = () => {
    parameters = []

  }

  let addParameter = () => {
    parameters.push({
      name: "",
      type: flatMap(syntaxTree)[0],
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
  let exportTS = () => {
    console.log("logggg");
    var blob = new Blob([ts(modelName, [...parameters])], {
      type: "text/plain;charset=utf-8",
    });

    saveAs(blob, modelName.length == 0 ? "mymodel" : modelName + ".udm.ts");
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
<table>
  <tr>
    <th colspan="4"
      ><input placeholder="Model Name" bind:value={modelName} /></th
    >
  </tr>
  <tr>
    <th> Parameter </th>
    <th> Type </th>
    <th> Require </th>
    <th> Remove </th>
  </tr>
  {#if parameters != null}
    {#each parameters as parameter, index}
      <tr>
        <td><input bind:value={parameter.name} /></td>
        <td
          ><!-- svelte-ignore a11y-no-onchange -->
          <select
            name="DataTypes"
            bind:value={parameter.type.value}
            on:change={(value) => {
              //parameters[index] = value.
              console.log("SMH", value, index);
            }}
            contenteditable
          >
            {#each flatSyntax as type}
              <option value={type.value}>{type.name}</option>
            {/each}
          </select></td
        >
        <td
          ><label class="container"
            ><input bind:checked={parameter.required} type="checkbox" /><span
              class="checkmark"
            /></label
          ></td
        >
        <td><button class="removeButton" on:click={() => removeParameter(parameter)}>×</button></td>
      </tr>
    {/each}
  {/if}
</table>
<table>
  <tr />
</table>
<button on:click={addParameter}>Add Parameter</button>
<button on:click={exportModel}>Export</button>
<button on:click={exportTS}>Export TS</button>

<input type="file" on:change={uploadFile} accept=".yaml" />
<button on:click={clear}>Clear</button>
<style>

.fullsize {
  height: 100%;
}
  .removeButton {
    width: 100%;
    height: 100%;
    border: none;
    background-color:#2f3239;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 25px;
  }
  .removeButton:focus {
    outline: 0;

  }
  .removeButton:hover {
    cursor: pointer;
  }
  .container {
    display: block;
    position: relative;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .container input {
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .removeMark {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: red;
  }
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    transition-duration: 500ms;
  }

  /* On mouse-over, add a grey background color */
  /* .container:hover input ~ .checkmark {
  background-color: #ccc;
} */

  .container input:checked ~ .checkmark {
    background-color: #00b518;
    transition-duration: 500ms;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  .container input:checked ~ .checkmark:after {
    display: block;
  }

.container .checkmark:after {
  left: 0;
  right: 0;
  margin: 0 auto;
  top: 4px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  transition-duration: 500ms;
}
  table {
    margin: 0 auto;
    border-collapse: collapse;
    border: 4px solid #292a30;
    background-color: #2f3239;
    opacity: 1;
  }

  input:active,
  input:focus {
    border: none;
    outline: none;
  }

  td ,
  th  {
    border: 4px solid #292A30;
    overflow: hidden;
  }
  input {
    margin: auto;
    text-align: left;
    padding: 5px;
    border: none;
    align-self: center;
    box-sizing: border-box;
    background-color: #2f3239;
    color: #e0dce4;
  }

  th {
    text-align: left;
    padding: 8px;
  }

  input {
    text-transform: lowercase;
  }
  td {
    text-align: center;
  }

  :global(body) {
    font-family: "Rubik", sans-serif;
    background-color: #292a30;
    color: #e0dce4;
  }
  button {
    font-family: "Rubik", sans-serif;
  }
  input {
    font-family: "Rubik", sans-serif;
  }
</style>
