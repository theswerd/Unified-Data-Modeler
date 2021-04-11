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
    "public class " +
    name +
    " {\n\n" +
    parameters
      .map(
        (value) =>
          "    public " +
          (value.required ? "" : "Optional<") +
          type(value.type, Languages.Java) +
          (value.required ? "" : ">") +
          " " +
          value.name +
          ";\n"
      )
      .join("") +
    "\n    public " +
    name +
    "(" +
    parameters
      .map((value) => type(value.type, Languages.Java) + " " + value.name)
      .join(" ") +
    ") {\n" +
    parameters.map((value)=>"        this."+value.name+" = "+value.name+";\n") +
    "    }" +
    "\n}"
  );
};
