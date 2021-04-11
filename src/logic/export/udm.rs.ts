import type { Parameter } from "../../models/parameter";
import { syntaxTree, Languages, flatSyntax, DataType } from "../syntax_tree";
import type from "./type_finder";
import warning from "./warning";

export default (name: string, parameters: Array<Parameter>): string => {
  return (
    warning +
    "\nstruct " +
    name +
    " {\n" +
    parameters
      .map((value) => {
        return "    " + name + ": " + type(value.type, Languages.Rust);
      })
      .join(",\n") +
    "\n}"
  );
};
