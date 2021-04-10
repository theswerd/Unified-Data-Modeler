<script lang="ts">
  import { io } from "socket.io-client";
  import type { Socket } from "socket.io-client";
  import { saveAs } from "file-saver";

  import { onMount } from "svelte";
  import Nav from "../components/Nav.svelte";
  import type { Parameter } from "../models/parameter";
  import { flatSyntax } from "../logic/syntax_tree";

  let files: FileList;

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
     return "\t- name: "+value.name+"\n\t  required: "+value.required+"\n\t  type: "+value.type.value
    }).join('\n')], {
      type: "text/plain;charset=utf-8",
    });
    
    saveAs(blob, "mymodel.udm.yaml");
  };

  $: {
    console.log("FILES",files)
    if(files != undefined && files != null && (files?.length ?? 0) != 0){

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
        <td><label class="container"><input bind:checked={paramater.required} type="checkbox" /><span class="checkmark"></span></label></td>
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
<input  type="file" bind:files accept=".yaml">

<style>
  /* Customize the label (the container) */
.container {
  display: block;
  position: relative; 
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #BF0A30;
  transition-duration: 500ms;
}

/* On mouse-over, add a grey background color */
/* .container:hover input ~ .checkmark {
  background-color: #ccc;
} */

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #00b518;
  transition-duration: 300ms;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 9px;
  top: 5px;
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
    border: 2px solid whitesmoke;
	background-color: white;
	opacity: 1;
  }

  input:active ,
  input:focus  {
    border: none;
    outline: none;
  }

  table td ,
  table th  {
    border: 2px solid whitesmoke;
  }
  input {
    margin: auto;
    text-align: center;
    padding: 5px;
    border: none;
    align-self: center;
    box-sizing: border-box;
  }

  th {
    text-align: center;
    padding: 8px;

  }

  input{
    text-transform: lowercase; 
  }
  td {
    text-align: center;
  }
   
  :global(body) {
    font-family: 'Courier Prime', monospace;
    
  }
  button {
    font-family: 'Courier Prime', monospace;
  }
  input {
    font-family: 'Courier Prime', monospace;
  } 

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
</style>
