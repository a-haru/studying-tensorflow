import * as tmImage from '@teachablemachine/image';

export type TmImageSrc = {
  model: string;
  metadata: string;
}

export type ImageModel = {
  model?: tmImage.CustomMobileNet;
  webcam?: tmImage.Webcam;
}

export async function makeTmImageApp(canvas: HTMLCanvasElement, src: TmImageSrc, width: number = 640, height: number = 360): Promise<ImageModel>
{
  let props: ImageModel = {
    model: undefined,
    webcam: undefined
  };

  // Load the model.
  props.model = await tmImage.load(src.model, src.metadata);
  
  props.webcam = new tmImage.Webcam(width, height, true);
  props.webcam.canvas = canvas
  canvas.width = width;
  canvas.height = height;

  return props;
}
