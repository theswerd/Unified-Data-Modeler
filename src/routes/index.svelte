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
  import cs from "../logic/export/udm.cs";
  import dart from "../logic/export/udm.dart";
  import rust from "../logic/export/udm.rs";
  import java from "../logic/export/udm.java";

  import { Highlight } from "svelte-highlight";
  import {
    typescript,
    rust as rustHighlight,
    dart as dartHighlight,
    yaml as yamlHighlight,
    cs as csHighlight,
    java as javaHighlight,
  } from "svelte-highlight/languages";
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
      console.log("PARAMETERS FROM SOCKET");
      console.log("PARAMETERS", parameters);
      if (parameters != newParameters) {
        parametersFromNetwork = true;
        parameters = [...newParameters];
      }
    });

    socket.on("disconnect", () => {
      console.warn("DISCONNECTED");
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
    var blob = new Blob([udmYaml(modelName, parameters)], {
      type: "text/plain;charset=utf-8",
    });

    saveAs(blob, modelName.length == 0 ? "mymodel" : modelName + ".udm.yaml");
  };
  $: udmCode =
    parameters != null ? udmYaml(modelName, [...parameters]) : "// Loading";
  $: tsCode =
    parameters != null ? ts(modelName, [...parameters], false) : "// Loading";
  let exportTS = () => {
    console.log("logggg");
    var blob = new Blob([ts(modelName, [...parameters])], {
      type: "text/plain;charset=utf-8",
    });

    saveAs(blob, modelName.length == 0 ? "mymodel" : modelName + ".udm.ts");
  };
  $: csCode =
    parameters != null ? cs(modelName, [...parameters], false) : "// Loading";
  let exportCS = () => {
    var blob = new Blob([cs(modelName, [...parameters])], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, modelName.length == 0 ? "mymodel" : modelName + ".udm.cs");
  };

  $: dartCode =
    parameters != null ? dart(modelName, [...parameters], false) : "// Loading";
  let exportDart = () => {
    var blob = new Blob([dart(modelName, [...parameters])], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, modelName.length == 0 ? "mymodel" : modelName + ".udm.dart");
  };

  $: javaCode =
    parameters != null ? java(modelName, [...parameters], false) : "// Loading";
  let exportJava = () => {
    var blob = new Blob([dart(modelName, [...parameters])], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, modelName.length == 0 ? "mymodel" : modelName + ".udm.java");
  };

  $: rustCode =
    parameters != null ? rust(modelName, [...parameters], false) : "// Loading";
  let exportRust = () => {
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
  $: {
    console.log("PARAMETERS", parameters);
    if (parametersFromNetwork) {
      console.log("FROM NETWORK NOT EMITTING");
      parametersFromNetwork = false;
    } else if (parameters != null) {
      console.log("PARAMETERS EMITTED");
      socket?.emit("parameters", parameters);
    } else {
      console.log("NOT EMITTING");
    }
  }
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
<div class="wrapper">
  <div style="height: 100%; overflow: scroll;">
    <img
      src="./favicon.png"
      height="100px"
      style="padding: 20px; margin: 0 auto; display: block;"
      alt="logo"
    />
    <table>
      <tr>
        <th colspan="4"
          ><input
            style="text-align:center"
            placeholder="Model Name"
            bind:value={modelName}
          /></th
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
                style="color: white; background-color: transparent; border: none; outline: none;"
                bind:value={parameter.type.value}
                on:change={(value) => {
                  //parameters[index] = value.
                  console.log("SMH", value, index);
                }}
                contenteditable
              >
                {#each flatSyntax as type}
                  <option style="background-color: grey;" value={type.value}
                    >{type.name}</option
                  >
                {/each}
              </select></td
            >
            <td
              ><label class="container"
                ><input
                  bind:checked={parameter.required}
                  type="checkbox"
                /><span class="checkmark" /></label
              ></td
            >
            <td
              ><button
                class="clickableButtonRemove"
                on:click={() => removeParameter(index)}>×</button
              ></td
            >
          </tr>
        {/each}
      {/if}
      <tr>
        <th
          ><button class="clickableButton" on:click={addParameter}>+</button
          ></th
        >
        <th colspan="2" />
        <th style="background-color:#ff5555"
          ><button class="writtenButton" on:click={clear}>Clear</button></th
        >
      </tr>
    </table>
    <table
      style="margin-top:20px"
      class="equalDivide"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      border-radius="0"
    >
      <tr>
        <th><button class="export" on:click={exportTS}>Export TS</button></th>
        <th
          ><button class="export" on:click={exportRust}>Export Rust</button></th
        >
        <th
          ><button class="export" on:click={exportDart}>Export Dart</button></th
        >
        <th><button class="export" on:click={exportCS}>Export C#</button></th>
        <th
          ><button class="export" on:click={exportJava}>Export Java</button></th
        >

        <th
          ><button class="export" on:click={exportModel}>Export UDM</button></th
        >
      </tr>
      <tr>
        <th colspan="6"
          ><label class="container"
            ><input type="file" accept=".yaml" bind:files /><span
              class="export"
            />Import UDM</label
          ></th
        >
      </tr>
    </table>
  </div>
  <section class="bottom" style="overflow: scroll; background-color: #2c2c2c">
    <div class="code-container">
      <h2>TypeScript</h2>
      <Highlight language={typescript} code={tsCode} />
    </div>

    <div class="code-container">
      <h2>Rust</h2>
      <Highlight language={rustHighlight} code={rustCode} />
    </div>

    <div class="code-container">
      <h2>Dart</h2>
      <Highlight language={dartHighlight} code={dartCode} />
    </div>

    <div class="code-container">
      <h2>C#</h2>
      <Highlight language={csHighlight} code={csCode} />
    </div>

    <div class="code-container">
      <h2>Java</h2>
      <Highlight language={javaHighlight} code={javaCode} />
    </div>

    <div class="code-container">
      <h2>UDM</h2>
      <Highlight language={yamlHighlight} code={udmCode} />
    </div>
  </section>
</div>

<style>
  :root {
      --secondary-color: #2f3239;
      --font-color: #e0dce4;
      --bg-color: #292a30;
  }
  /* [data-theme="light"] {
      --secondary-color: #818cab;
      --font-color: #e1e1ff;
      --bg-color: #161625;
  } */
  .code-container {
    background-color: black;
    border-radius: 3pt;
    padding: 20pt;
    margin: 20pt;
  }
  .equalDivide tr td {
    width: 25%;
  }
  .bottom {
    padding: 20px;
  }
  h2 {
    font-weight: bold;
  }
  /* 
  pre {
    user-select: all;
    -moz-user-select: all;
    -webkit-user-select: all;
    margin-top: 0px;
    padding-top: 0px;
  }
  */

  .wrapper {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    height: 100vh;
    overflow: hidden;
  }

  .clickableButton {
    width: 100%;
    height: 100%;
    border: none;
    background-color: var(--secondary-color);
    color: var(--font-color);
    font-family: Arial, Helvetica, sans-serif;
    font-size: 25px;
    transition: 500ms;
  }
  .clickableButton:focus {
    outline: 0;
  }
  .clickableButton:hover {
    cursor: pointer;
    color: #00b518;
    transition-duration: 500ms;
  }

  .export {
    background-color: var(--secondary-color);
    color: var(--font-color);
    transition: 500ms;
    border: none;
    text-align: center;
  }
  .export:focus {
    outline: 0;
  }
  .export:hover {
    cursor: pointer;
    color: #00b518;
    transition-duration: 500ms;
  }

  .clickableButtonRemove {
    width: 100%;
    height: 100%;
    border: none;
    background-color: var(--secondary-color);
    color: var(--font-color);
    font-family: Arial, Helvetica, sans-serif;
    font-size: 25px;
    transition: 500ms;
  }
  .clickableButtonRemove:focus {
    outline: 0;
  }
  .clickableButtonRemove:hover {
    cursor: pointer;
    color: #ff5555;
    transition-duration: 500ms;
  }

  .writtenButton {
    width: 100%;
    height: 100%;
    border: none;
    background-color: #ff5555;
    color: var(--font-color);
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
    border: solid var(--font-color);
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
    border: 4px solid var(--bg-color);
    background-color: var(--secondary-color);
    opacity: 1;
  }

  input:active,
  input:focus {
    border: none;
    outline: none;
  }

  td,
  th {
    border: 4px solid var(--bg-color);
    overflow: hidden;
    text-align: center;
  }
  input {
    margin: auto;
    text-align: left;
    padding: 5px;
    border: none;
    align-self: center;
    box-sizing: border-box;
    background-color: var(--secondary-color);
    color: var(--font-color);
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
    background-color: var(--bg-color);
    color: var(--font-color);
  }
  button {
    font-family: "Rubik", sans-serif;
  }
  input {
    font-family: "Rubik", sans-serif;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #2c2c2c;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgb(95, 95, 95);
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  ::-webkit-scrollbar-corner {
    display: none;
  }
</style>
