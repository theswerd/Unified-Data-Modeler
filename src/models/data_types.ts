const dataTypes: Array<DataType> = [
    {
      value: "text",
      text: "Text",
    },
    {
      value: "number",
      text: "Number",
    },
    {
      value: "integer",
      text: "Integer",
    },
    {
      value: "positive_integer",
      text: "Positive Integer",
    },
    {
      value: "character",
      text: "Character",
    },
  ];

export interface DataType {
    value: string;
    text: string;
  }

  export default dataTypes;