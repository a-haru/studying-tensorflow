import * as tmImage from '@teachablemachine/image';

interface src {
  model: string,
  metadata: string
}

export interface imageModel {
  model?: tmImage.CustomMobileNet,
  webcam?: tmImage.Webcam;
}

let props: imageModel = {
  model: undefined,
  webcam: undefined
};

export async function makeTmImageApp(canvas: HTMLCanvasElement, src: src, width: number = 640, height: number = 360): Promise<imageModel>
{
  // Load the model.
  props.model = await tmImage.load(src.model, src.metadata);
  
  props.webcam = new tmImage.Webcam(width, height, true);
  props.webcam.canvas = canvas
  canvas.width = width;
  canvas.height = height;

  return props;
}
