import type { Parameter } from "../../models/parameter";
import { syntaxTree, Languages, flatSyntax, DataType } from "../syntax_tree";
import type from "./type_finder";
import warning from "./warning";

export default (
  name: string,
  parameters: Array<Parameter>,
  withWarning: boolean = true
): string => {
  console.log("PARAMETERS", parameters);
  return (
    (withWarning ? warning : "") +
    "\nexport default interface " +
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
