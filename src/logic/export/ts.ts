import type { Parameter } from "../../models/parameter";
import { syntaxTree, Languages, flatSyntax, DataType } from "../syntax_tree";

export default (name: string, parameters: Array<Parameter>): string => {
    console.log("PARAMETERS", parameters)
  return (
    "export default interface " +
    name +
    " {\n" +
    parameters
      .map(
        (value) =>
          "  " +
          value.name.toLowerCase() +
          (value.required ? "" : "?") +
          ": " +
          type(value.type) +
          ";"
      )
      .join("\n") +
    "\n}"
  );
};

let type = (
  dataType: DataType,
  tree: DataType = syntaxTree,
  pastTypes: Array<DataType> = []
): string | null => {
  console.log("CURRENT PLACE IN TREE",tree.value);
  console.log("SEARCHING FOR IN TREE", dataType.value);

  let newPastTypes = [tree, ...pastTypes];
  if (dataType.value == tree.value) {
    
    return backwardsSearch(newPastTypes);
  } else {
    for (const i in tree.subTypes) {
      const returnValue = type(dataType, tree.subTypes[i], newPastTypes);
      if (returnValue != null && returnValue != undefined) {
        
        return returnValue;
      }
    }
  }
};

let backwardsSearch = (history: Array<DataType>): string => {
  for (const index in history) {
    console.log("BACLWARDS HISTORY", type);
    if (
        history[index].languages.some((value) => value.language == Languages.TypeScript)
    ) {
      return  history[index].languages.find(
        (value) => value.language == Languages.TypeScript
      ).syntax;
    } else {
      continue;
    }
  }
  throw new Error("Type Not Found");
};

export default interface smh {
  test: string;
}
