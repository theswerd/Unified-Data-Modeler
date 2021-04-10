import type { DataType } from "./data_types";

export interface Parameter {
  name: string;
  type: DataType;
  required: boolean;
}
