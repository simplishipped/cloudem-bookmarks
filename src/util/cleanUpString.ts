function cleanStringForDBInsertion(inputString: string) {
  // Define characters to be escaped or removed
  const invalidCharacters = ["'", "\\"];

  // Check if the input string contains any invalid characters
  for (let i = 0; i < invalidCharacters.length; i++) {
      if (inputString.includes(invalidCharacters[i])) {
          return null; // Return null to indicate invalid input
      }
  }

  // If no invalid characters found, return the cleaned string
  return inputString;
}

export default cleanStringForDBInsertion