import type { Parameter } from "../../models/parameter";

export default (name: string, parameters: Array<Parameter>): string => {
  return (
    "name: " +
    name +
    "\n" +
    "parameters:\n" +
    parameters
      .map((value) => {
        return (
          "  - name: " +
          value.name +
          "\n    required: " +
          value.required +
          "\n    type: " +
          value.type.value
        );
      })
      .join("\n")
  );
};
