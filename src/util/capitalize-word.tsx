function capitalizeFirstLetter(string:string) {
  return string.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

export default capitalizeFirstLetter;