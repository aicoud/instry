export const presetFilters = [
  { name: 'Normal', class: '' },
  { name: 'Clarendon', class: 'contrast-125 saturate-125' },
  { name: 'Gingham', class: 'brightness-105 hue-rotate-15 sepia-[0.2]' },
  { name: 'Moon', class: 'grayscale brightness-110 contrast-110' },
  { name: 'Lark', class: 'contrast-90 saturate-150 brightness-110' },
  { name: 'Reyes', class: 'sepia-[0.3] contrast-90 brightness-110 saturate-75' },
  { name: 'Juno', class: 'contrast-105 saturate-150 brightness-110 sepia-[0.2]' },
  { name: 'Slumber', class: 'sepia-[0.3] saturate-125 brightness-105 hue-rotate-[-10deg]' },
  { name: 'Crema', class: 'sepia-[0.5] contrast-90 brightness-110' },
  { name: 'Ludwig', class: 'saturate-200 contrast-90 brightness-110 hue-rotate-[-10deg]' },
];

export const getFilterStyle = (customFilters: {
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  grayscale: number;
}) => {
  return {
    filter: `
      brightness(${customFilters.brightness}%) 
      contrast(${customFilters.contrast}%) 
      saturate(${customFilters.saturation}%) 
      sepia(${customFilters.sepia}%) 
      grayscale(${customFilters.grayscale}%)
    `,
  };
};

export const defaultCustomFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  sepia: 0,
  grayscale: 0,
};
