<script lang="ts">
  import { io } from "socket.io-client";
  import type { Socket } from "socket.io-client";
  import { saveAs } from "file-saver";
  import * as yaml from "js-yaml";
  import { onMount } from "svelte";
  import type { BaseParameter, Parameter } from "../models/parameter";
  import { flatSyntax, flatMap, syntaxTree } from "../logic/syntax_tree";
  import udmYaml from "../logic/export/udm.yaml";
  import ts from "../logic/export/udm.ts";
  import dart from "../logic/export/udm.dart";
  import rust from "../logic/export/udm.rs";

  import { Highlight } from "svelte-highlight";
  import { typescript, rust as rustHighlight, dart as dartHighlight, yaml as yamlHighlight } from "svelte-highlight/languages";
  import { irBlack } from "svelte-highlight/styles";

  let parameters: Array<Parameter>;
  let modelName: string;
  let socket: Socket;
  let modelNameFromNetwork: boolean = false;
  let files: FileList;
  let parametersFromNetwork: boolean = false;
  onMount(() => {
    console.log("MOUNTED");
    socket = io();
    console.log("CONNECTED 1", socket.connected);

    socket.open();
    console.log("CONNECTED 2", socket.connected);

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
      console.warn('DISCONNECTED')
      socket.connect();
    });
  });

  let removeParameter = (index: number) => {
    if (parameters.length == 1) {
      addParameter();
    }
    parameters.splice(index, 1);
    parameters = parameters;
  };

  let clear = () => {
    parameters = [];
    addParameter();
  };

  let addParameter = () => {
    parameters.push({
      name: "",
      type: flatMap(syntaxTree)[0],
      required: false,
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
  $: udmCode = parameters != null ? udmYaml(modelName, [...parameters]) : "// Loading";
  $: tsCode =
    parameters != null ? ts(modelName, [...parameters], false) : "// Loading";
  let exportTS = () => {
    console.log("logggg");
    var blob = new Blob([ts(modelName, [...parameters])], {
      type: "text/plain;charset=utf-8",
    });

    saveAs(blob, modelName.length == 0 ? "mymodel" : modelName + ".udm.ts");
  };
  $: dartCode =
    parameters != null ? dart(modelName, [...parameters], false) : "// Loading";
  let exportDart = () => {
    console.log("logggg");
    var blob = new Blob([dart(modelName, [...parameters])], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, modelName.length == 0 ? "mymodel" : modelName + ".udm.dart");
  };

  $: rustCode =
    parameters != null ? rust(modelName, [...parameters], false) : "// Loading";
  let exportRust = () => {
    console.log("logggg");
    var blob = new Blob([rust(modelName, [...parameters])], {
      type: "text/plain;charset=utf-8",
    });

    saveAs(blob, modelName.length == 0 ? "mymodel" : modelName + ".udm.rs");
  };

  $: {
    console.log("FILES", files);
    if (files != undefined && files != null && (files?.length ?? 0) != 0) {
      console.log("INSIDEEEE");
      files
        .item(0)
        .text()
        .then((text) => {
          console.log("FILE TEXT", text);
          const doc = yaml.load(text);
          console.log(doc);
          modelName = doc["name"];
          parameters = (doc["parameters"] as Array<BaseParameter>).map(
            (base) => {
              return {
                name: flatSyntax.find((value) => value.value == base.type).name,
                type: flatSyntax.find((value) => value.value == base.type),
                required: base.required,
              } as Parameter;
            }
          );
        });
    }
  }

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
  <title>UDM</title>
  {@html irBlack}
</svelte:head>
<img src="./favicon.png" height="100px" style="padding: 20px; margin: 0 auto; display: block;" alt="logo" />
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
        <td
          ><button
            class="clickableButton"
            on:click={() => removeParameter(index)}>×</button
          ></td
        >
      </tr>
    {/each}
  {/if}
  <tr>
    <th><button class="clickableButton" on:click={addParameter}>+</button></th>
    <th colspan="2" />
    <th style="background-color:#ff5555"
      ><button class="writtenButton" on:click={clear}>Clear</button></th
    >
  </tr>
</table>
<table style="margin-top:20px" class="equalDivide" cellpadding="0" cellspacing="0" width="100%" border-radius="0">
  <tr>
     <th>Export TS</th>
     <th>Export Dart</th>
     <th>Export Rust</th>
     <th>Export UDM</th>
  </tr>
  <tr>
    <td colspan="4">Import UDM</td>
  </tr>
</table>
<button on:click={exportModel}>Export</button>
<button on:click={exportTS}>Export TS</button>
<button on:click={exportDart}>Export Dart</button>
<button on:click={exportRust}>Export Rust</button>
<input type="file" accept=".yaml" bind:files />
<button on:click={clear}>Clear</button>
<br />
<section class="bottom">
  <h2>TypeScript</h2>
  <Highlight language={typescript} code={tsCode} />

  <h2>Rust</h2>
  <Highlight language={rustHighlight} code={rustCode} />
  <h2>Dart</h2>
  <Highlight language={dartHighlight} code={dartCode} />
  <h2>UDM</h2>
  <Highlight language={yamlHighlight} code={udmCode} />
</section>

<style>
  .equalDivide tr td { width:25%; }
  .bottom {
    padding: 20px;
  }
  h2 {
    font-weight: bold;
  }
  pre {
    user-select: all;
    -moz-user-select: all;
    -webkit-user-select: all;
    margin-top: 0px;
    padding-top: 0px;
  }

  .clickableButton {
    width: 100%;
    height: 100%;
    border: none;
    background-color: #2f3239;
    color: #e0dce4;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 25px;
  }
  .clickableButton:focus {
    outline: 0;
  }
  .clickableButton:hover {
    cursor: pointer;
  }

  .writtenButton {
    width: 100%;
    height: 100%;
    border: none;
    background-color: #ff5555;
    color: #e0dce4;
    font-size: 16px;
    font-weight: bold;
  }
  .writtenButton:focus {
    outline: 0;
  }
  .writtenButton:hover {
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
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    transition-duration: 250ms;
  }

  /* On mouse-over, add a grey background color */
  /* .container:hover input ~ .checkmark {
  background-color: #ccc;
} */

  .container input:checked ~ .checkmark {
    background-color: #00b518;
    transition-duration: 250ms;
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
    border: solid #e0dce4;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    transition-duration: 250ms;
  }
  table {
    width: 500px;
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

  td,
  th {
    border: 4px solid #292a30;
    overflow: hidden;
    text-align:center;
  }
  input {
    margin: auto;
    text-align: center;
    padding: 5px;
    border: none;
    align-self: center;
    box-sizing: border-box;
    background-color: #2f3239;
    color: #e0dce4;
  }

  th {
    text-align: center;
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
