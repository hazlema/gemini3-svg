export interface SvgGenerationResponse {
  svgCode: string;
  description: string;
  title: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  data: SvgGenerationResponse | null;
}

export enum ViewMode {
  PREVIEW = 'PREVIEW',
  CODE = 'CODE',
}
