<script lang="ts">
  import { io } from "socket.io-client";
  import type { Socket } from "socket.io-client";
  import { saveAs } from "file-saver";

  import { onMount } from "svelte";
  import Nav from "../components/Nav.svelte";
  import type { Parameter } from "../models/parameter";
  import { flatSyntax } from "../logic/syntax_tree";

  let parameters: Array<Parameter>;
  let modelName: string;
  let socket: Socket;
  let modelNameFromNetwork: boolean = false;

  let parametersFromNetwork: boolean = false;
  onMount(() => {
    console.log("MOUNTED");
    socket = io();

    socket.on("modelName",(newModelName)=>{
      if(modelName != newModelName){
        modelNameFromNetwork = true
        modelName = newModelName;

      }
    })
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
    parameters.splice(index, 1);
    parameters = parameters;
  };

  let addParameter = () => {
    parameters.push({
      name: "",
      type: flatSyntax[0],
      required: true,
    });
    parameters = parameters;
  };

  let exportModel = () => {
    console.log("logggg");
    var blob = new Blob(["name: "+modelName+"\n"+"parameters:\n", parameters.map((value)=>{
     return "\t- name: "+value.name+"\n\t  requried: "+value.required+"\n\t  type: "+value.type.value
    }).join('\n')], {
      type: "text/plain;charset=utf-8",
    });
    
    saveAs(blob, "mymodel.udm.yaml");
  };

  let importModel = (test) => {
    console.log("TEST", test)
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
<input placeholder="Model Name" bind:value={modelName}/>
<table>
  <tr>
    <th> Name </th>
    <th> Required </th>
    <th> Type </th>
  </tr>
  {#if parameters != null}
    {#each parameters as paramater, index}
      <tr>
        <td><input bind:value={paramater.name} /></td>
        <td><input bind:checked={paramater.required} type="checkbox" /></td>
        <td
          ><select
            name="DataTypes"
            bind:value={parameters[index].type.value}
            bind:textContent={parameters[index].type.name}
            contenteditable
          >
            {#each flatSyntax as type}
              <option value={type.value}>{type.name}</option>
            {/each}
          </select></td
        >
      </tr>
    {/each}
  {/if}
</table>
<button on:click={addParameter}>Add Parameter</button>
<button on:click={exportModel}>Export</button>
<input on:change={importModel} type="file" accept=".yaml">

<style>
  th {
    text-align: start;
    padding: 8px;
  }

  input{
    text-transform: lowercase; 
  }
</style>
