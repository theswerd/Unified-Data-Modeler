import type { Parameter } from "../../models/parameter";
import { syntaxTree, Languages, flatSyntax, DataType } from "../syntax_tree";
import type from "./type_finder";

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
          type(value.type, Languages.TypeScript) +
          ";"
      )
      .join("\n") +
    "\n}"
  );
};

