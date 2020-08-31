import * as tmImage from '@teachablemachine/image';

interface modelSrc {
  model: string,
  metadata: string
}

export interface comparePicture {
  model?: tmImage.CustomMobileNet,
  webcam?: tmImage.Webcam;
}

let props: comparePicture = {
  model: undefined,
  webcam: undefined
};

export async function compare(canvas: HTMLCanvasElement, modelSrc: modelSrc, width: number = 640, height: number = 360): Promise<comparePicture>
{
  // Load the model.
  props.model = await tmImage.load(modelSrc.model, modelSrc.metadata);
  
  props.webcam = new tmImage.Webcam(width, height, true);
  props.webcam.canvas = canvas
  canvas.width = width;
  canvas.height = height;

  return props;
}
