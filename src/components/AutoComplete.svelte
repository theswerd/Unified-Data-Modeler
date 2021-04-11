<script lang="ts">
  import { flatSyntax } from "../logic/syntax_tree";
  import Index from "../routes/index.svelte";
  import { clickOutside } from "./clickOutside.js";
  export let parameter;
  console.log(parameter)
  //   import {onMount} from 'svelte';
  //   onMount(() => {
  //       document.querySelector(".dropdown-item").classList.add('active');
  //   })
  let hide = "hidden";
  let input = "";
  //   $: {
  //       if(document.getElementsByClassName("dropdown-item")).
  //   }
  function getDataType(input){
    
    let value = ( flatSyntax.filter((type) =>
      type.name.toLowerCase().includes(input.toLowerCase())
    )[0]?.value || 'text')
    console.log(value)
    return value;
  }
  $: parameter.type.value = getDataType(input)
  $: dataTypes = flatSyntax.filter((type) =>
    type.name.toLowerCase().includes(input.toLowerCase())
  );
  function handleKeydown({ keyCode }) {
    if (keyCode === 13) {
      //"Enter"
      console.log("enter");
      let activeElem = document.querySelectorAll(".active")[0];
      input = activeElem.innerHTML;
      hide = "hidden";
    //   activeElem.classList.remove("active");
    }
    if (keyCode !== 38 && keyCode !== 40) return; // makes sure that it is 'up and down arrows"
    const current = document.querySelector(".active");
    console.log("current", current);
    const items = Array.from(
      document.querySelector(".shown").getElementsByClassName("dropdown-item")
    );
    const currentIndex = items.indexOf(current);
    let newIndex;

    if (currentIndex === -1) {
      newIndex = 0;
    } else {
      if (keyCode === 38)
        newIndex = (currentIndex + items.length - 1) % items.length;
      else newIndex = (currentIndex + 1) % items.length;
    }
    console.log("items[newIndex]:", items[newIndex]);
    current.classList.remove("active");
    items[newIndex].classList.add("active");
  }
</script>

<!--Make sure the form has the autocomplete function switched off:-->
<form
  autocomplete="off"
  action="/action_page.php"
  on:submit={(e) => e.preventDefault()}
>
  <div
    class="autocomplete"
    style="width:300px;"
    use:clickOutside
    on:click_outside={() => {
        //   document.querySelector(".active").classList.remove("active");
        if (
            !flatSyntax
            .map((type) => type.name.toLowerCase())
            .includes(input.toLowerCase())
            ) {
                input = document.querySelector('.shown').querySelector(".active").innerHTML; //defaults to 'Text' if there is nothing put in
            }
            hide = "hidden";
        }}
    on:keydown={handleKeydown}
  >
    <input
      id="myInput"
      type="text"
      name="dataType"
      placeholder="Data Type"
      on:focus={(e) => {
        hide = "shown";
        input = "";
        setTimeout(() => {
          document
            .querySelector(".shown")
            .querySelector(".dropdown-item")
            .classList.add("active");
        }, 10);
      }}
      bind:value={input}
    />
    <div class={"drop-down " + hide}>
      {#each dataTypes as dataType}
        <div
          tabindex="0"
          class="dropdown-item"
          on:click={(e) => {
            input = dataType.name;
            hide = "hidden";
          }}
        >{dataType.name}</div>
      {/each}
    </div>
  </div>
</form>

<style type="text/scss">
  @import "../styles/vars.scss";
  .hidden.drop-down {
    display: none;
  }
  .autocomplete {
    position: relative;
  }
  .drop-down {
    position: absolute;
    top: 26px;
    left: 0;
    z-index: 2;
    background: $content-bg-color;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    div {
      padding: 6px;
      cursor: pointer;
      width: 100%;
      &:hover,
      &:focus {
        background-color: darkgrey;
      }
      &:active {
        background-color: green;
      }
      &:focus {
        background-color: blue;
      }
    }
  }
  .active {
    background-color: darkgrey;
  }
  //   * {
  //     box-sizing: border-box;
  //   }
  //   body {
  //     font: 16px Arial;
  //   }
  //   .autocomplete {
  //     /*the container must be positioned relative:*/
  //     position: relative;
  //     display: inline-block;
  //   }
  //   input {
  //     border: 1px solid transparent;
  //     background-color: #f1f1f1;
  //     padding: 10px;
  //     font-size: 16px;
  //   }
  //   input[type="text"] {
  //     background-color: #f1f1f1;
  //     width: 100%;
  //   }
  //   input[type="submit"] {
  //     background-color: DodgerBlue;
  //     color: #fff;
  //   }
  //   .autocomplete-items {
  //     position: absolute;
  //     border: 1px solid #d4d4d4;
  //     border-bottom: none;
  //     border-top: none;
  //     z-index: 99;
  //     /*position the autocomplete items to be the same width as the container:*/
  //     top: 100%;
  //     left: 0;
  //     right: 0;
  //   }
  //   .autocomplete-items div {
  //     padding: 10px;
  //     cursor: pointer;
  //     background-color: #fff;
  //     border-bottom: 1px solid #d4d4d4;
  //   }
  //   .autocomplete-items div:hover {
  //     /*when hovering an item:*/
  //     background-color: #e9e9e9;
  //   }
  //   .autocomplete-active {
  //     /*when navigating through the items using the arrow keys:*/
  //     background-color: DodgerBlue !important;
  //     color: #ffffff;
  //   }
</style>
