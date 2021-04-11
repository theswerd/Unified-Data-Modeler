import type { Parameter } from "../../models/parameter";
import { syntaxTree, Languages, flatSyntax, DataType } from "../syntax_tree";
import type from "./type_finder";
import warning from "./warning";

export default (
  name: string,
  parameters: Array<Parameter>,
  withWarning: boolean = true
): string => {
  return (
    (withWarning ? warning + "\n" : "") +
    "struct " +
    name +
    " {\n" +
    parameters
      .map(
        (value) =>
          "   public " +
          type(value.type, Languages.CS) +
          (value.required ? "" : "?") +
          " " +
          value.name +
          ";\n"
      )
      .join("") +
    "}"
  );
};
