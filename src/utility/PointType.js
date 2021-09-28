export const externalToInternal = value => {
    switch (value.toUpperCase()) {
      case 'CORRECT':
        return 0;
      case 'INCORRECT' || 'ERROR':
        return 1;
      case 'PROMPT':
        return 2;
      default:
        return -1;
    }
  };

  export const internalToExternal = value => {
    switch (value) {
      case 0:
        return 'Correct';
      case 1:
        return 'Incorrect';
      case 2:
        return 'Prompt';
      default:
        return '';
    }
  };