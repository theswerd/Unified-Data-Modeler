import { DataType, Languages, syntaxTree } from "../syntax_tree";

let type = (
    dataType: DataType,
    language: Languages,

    tree: DataType = syntaxTree,
    pastTypes: Array<DataType> = [],
  ): string | null => {
  
    let newPastTypes = [tree, ...pastTypes];
    if (dataType.value == tree.value) {
      
      return backwardsSearch(newPastTypes, language);
    } else {
      for (const i in tree.subTypes) {
        const returnValue = type(dataType, language, tree.subTypes[i], newPastTypes);
        if (returnValue != null && returnValue != undefined) {
          
          return returnValue;
        }
      }
    }
  };
  
  let backwardsSearch = (history: Array<DataType>, language: Languages): string => {
    for (const index in history) {
      if (
          history[index].languages.some((value) => value.language == language)
      ) {
        return  history[index].languages.find(
          (value) => value.language == language
        ).syntax;
      } else {
        continue;
      }
    }
    throw new Error("Type Not Found");
  };
  

  export default type;