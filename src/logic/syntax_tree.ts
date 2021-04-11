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
      ],
    },
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
  ],
};

export let flatMap = (dataType: DataType, flatTypesBase: Array<DataType> = [syntaxTree]) => {
  let flatTypes: Array<DataType> = flatTypesBase;
  dataType.subTypes.forEach((type) => {
    flatTypes.push(type);
    flatTypes = flatMap(type, flatTypes);
  });
  return flatTypes
};

export const flatSyntax = flatMap(syntaxTree);
