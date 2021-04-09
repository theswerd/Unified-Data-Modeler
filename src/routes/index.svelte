<script lang="ts">
  import { io } from "socket.io-client";
  const dataTypes: Array<DataType> = [
    {
      value: "text",
      text: "Text",
    },
    {
      value: "number",
      text: "Number",
    },
    {
      value: "integer",
      text: "Integer",
    },
    {
      value: "character",
      text: "Character",
    },
  ];
  import { onMount } from "svelte";
  import Nav from "../components/Nav.svelte";
  let parameters: Array<Parameter> = [
    {
      name: "Name",
      type: dataTypes[0],
      required: true,
    },
  ];

  onMount(() => {
    console.log("MOUNTED");
    const socket = io();
    socket.emit("test");
    socket.on("ok", (args) => {
      console.log("ok", args);
    });
  });

  interface Parameter {
    name: string;
    type: DataType;
    required: boolean;
  }

  interface DataType {
    value: string;
    text: string;
  }
</script>
<style>
	th {
		text-align: start;
		padding: 8px;
	}
</style>
<svelte:head>
  <title>Unified Data Modelers</title>
</svelte:head>
<Nav />
<table>
	<tr>
		<th>
			Name
		</th>
		<th>
			Required
		</th>
		<th>
			Type
		</th>
	</tr>
  {#each parameters as paramater}
    <tr>
      <td><input value={paramater.name} /></td>
      <td><input checked={paramater.required} type="checkbox" /></td>
      <td
        ><select name="DataTypes">
          {#each dataTypes as type}
            <option value={type.value}>{type.text}</option>
          {/each}
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select></td
      >
    </tr>
  {/each}
</table>
