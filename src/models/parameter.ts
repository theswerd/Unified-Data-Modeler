import type { DataType } from "../logic/syntax_tree";

export interface Parameter {
  name: string;
  type: DataType;
  required: boolean;
}


export interface BaseParameter {
  type: string;
  required: boolean;
}
