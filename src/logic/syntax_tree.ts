export interface DataType {
  readonly subTypes: Array<DataType>;
  readonly name: string;
  readonly value: string;
  readonly languages: Array<Language>;
}

export interface Language {
  readonly language: Languages;
  readonly syntax: string;
}

export enum Languages {
  TypeScript,
  Rust,
  Dart,
  CS,
}

export const syntaxTree: DataType = {
  name: "Text",
  value: "text",
  subTypes: [
    {
      name: "Character",
      value: "character",
      subTypes: [],
      languages: [
        {
          language: Languages.Rust,
          syntax: "char",
        },
      ],
    },
    {
      name: "Boolean",
      value: "boolean",
      subTypes: [],
      languages: [
        {
          language: Languages.Rust,
          syntax: "bool",
        },
        {
          language: Languages.Dart,
          syntax: "bool",
        },
        {
          language: Languages.TypeScript,
          syntax: "boolean",
        },
        {
          language: Languages.CS,
          syntax: "bool",
        },
      ],
    },
    {
      name: "List",
      value: "list",
      languages: [
        {
          language: Languages.Rust,
          syntax: "Vec<Box<dyn Any>>",
        },
        {
          language: Languages.Dart,
          syntax: "List",
        },
        {
          language: Languages.TypeScript,
          syntax: "Array<any>",
        },
        {
          language: Languages.CS,
          syntax: "Object[]",
        },
       
      ],
      subTypes: [
        {
          name: "List of Strings",
          value: "list_of_strings",
          subTypes: [],
          languages: [
            {
              language: Languages.Rust,
              syntax: "Vec<str>",
            },
            {
              language: Languages.Dart,
              syntax: "List<String>",
            },
            {
              language: Languages.TypeScript,
              syntax: "Array<string>",
            },
            {
              language: Languages.CS,
              syntax: "string[]",
            },
            
          ],
        },
        {
          name: "List of Numbers",
          value: "list_of_numbers",
          subTypes: [],
          languages: [
            {
              language: Languages.Rust,
              syntax: "Vec<fsize>",
            },
            {
              language: Languages.Dart,
              syntax: "List<double>",
            },
            {
              language: Languages.TypeScript,
              syntax: "Array<number>",
            },
            {
              language: Languages.CS,
              syntax: "int[]",
            },
          ],
        },
      ],
    },
    {
      name: "Number",
      value: "number",
      subTypes: [
        {
          name: "Integer",
          value: "integer",
          subTypes: [
            {
              name: "Unsigned Integer",
              value: "unsigned_integer",
              subTypes: [],
              languages: [
                {
                  language: Languages.Rust,
                  syntax: "usize",
                },
                {
                  language: Languages.CS,
                  syntax: "uint",
                },
              ],
            },
          ],
          languages: [
            {
              language: Languages.Rust,
              syntax: "isize",
            },
            {
              language: Languages.Dart,
              syntax: "int",
            },
            {
              language: Languages.CS,
              syntax: "int",
            },
          ],
        },
      ],
      languages: [
        {
          language: Languages.Rust,
          syntax: "fsize",
        },
        {
          language: Languages.Dart,
          syntax: "double",
        },
        {
          language: Languages.TypeScript,
          syntax: "number",
        },
        {
          language: Languages.CS,
          syntax: "double",
        },
      ],
    },
  ],
  languages: [
    {
      language: Languages.Dart,
      syntax: "String",
    },
    {
      language: Languages.TypeScript,
      syntax: "string",
    },
    {
      language: Languages.Rust,
      syntax: "str",
    },
    {
      language: Languages.CS,
      syntax: "string",
    },
  ],
};

export let flatMap = (
  dataType: DataType,
  flatTypesBase: Array<DataType> = [syntaxTree]
) => {
  let flatTypes: Array<DataType> = flatTypesBase;
  dataType.subTypes.forEach((type) => {
    flatTypes.push(type);
    flatTypes = flatMap(type, flatTypes);
  });
  return flatTypes;
};

export const flatSyntax = flatMap(syntaxTree);
