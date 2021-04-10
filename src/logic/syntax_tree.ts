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

enum Languages {
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
      name: "List",
      value: "list",
      subTypes: [],
      languages: [
        {
          language: Languages.Rust,
          syntax: "Vec<str>",
        },
        {
          language: Languages.Dart,
          syntax: "List",
        },
        {
          language: Languages.TypeScript,
          syntax: "Array",
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
              value: "unsignedInteger",
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

let flatMap = (dataType: DataType, flatTypesBase: Array<DataType> = [syntaxTree]) => {
  let flatTypes: Array<DataType> = flatTypesBase;
  dataType.subTypes.forEach((type) => {
    flatTypes.push(type);
    flatTypes = flatMap(type, flatTypes);
  });
  return flatTypes
};

export const flatSyntax = flatMap(syntaxTree);
