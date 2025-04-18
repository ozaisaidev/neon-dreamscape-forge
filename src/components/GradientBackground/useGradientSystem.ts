
import { useCallback } from 'react';
import { Blob } from './Blob';
import { BLOB_CONFIG } from './constants';

export const useGradientSystem = () => {
  const initBlobs = useCallback((canvas: HTMLCanvasElement) => {
    return BLOB_CONFIG.map(config => new Blob(config, canvas.width, canvas.height));
  }, []);

  return { initBlobs };
};
