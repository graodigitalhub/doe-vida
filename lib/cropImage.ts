export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

/**
 * Recorta a imagem com base na área em pixels e redimensiona para tamanho padrão (600x600px)
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  targetSize = 600
): Promise<{ blob: Blob; url: string }> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Não foi possível inicializar o contexto 2d do canvas');
  }

  // Define o tamanho final padronizado
  canvas.width = targetSize;
  canvas.height = targetSize;

  // Desenha a área selecionada no canvas redimensionado
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetSize,
    targetSize
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas vazio ao gerar o recorte'));
          return;
        }
        const fileUrl = URL.createObjectURL(blob);
        resolve({ blob, url: fileUrl });
      },
      'image/jpeg',
      0.9
    );
  });
}
