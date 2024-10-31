// Automatically imports all images from the '../assets/menuPhotos' directory
const importAll = (requireContext) =>
    requireContext.keys().map(requireContext);
  
  // Import all images as an array
  const menuImages = importAll(require.context('../assets/menuPhotos', false, /\.(png|jpe?g|svg)$/));
  
  export default menuImages;
  