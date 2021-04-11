import type { Parameter } from "../../models/parameter";
import { syntaxTree, Languages, flatSyntax, DataType } from "../syntax_tree";
import type from "./type_finder";
import warning from "./warning";

export default (name: string, parameters: Array<Parameter>, withWarning: boolean = true): string => {
  console.log("PARAMETERS", parameters);
  return (
    (withWarning ? warning+"\n" : "") +
    "class " +
    name +
    " {\n" +
    parameters
      .map(
        (value) =>
          "  final " +
          type(value.type, Languages.Dart) +
          (value.required ? "" : "?") +
          " " +
          value.name +
          ";\n"
      )
      .join("") +
    "\n  const " +
    name +
    "({" +
    parameters
      .map(
        (value) =>
          "\n    " +
          (value.required ? "required " : "") +
          "this." +
          value.name +
          ","
      )
      .join("\n") +
    "\n  });\n" 
    +"\n  factory " +
    name +
    ".fromJSON(Map json) => " +
    name +
    "(\n" +
    parameters
      .map(
        (parameter) =>
          "        " + parameter.name + ": json['" + parameter.name + "'],\n"
      )
      .join("") 
    +"      );" +
    "\n}"
  );
};
