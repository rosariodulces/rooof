
export enum AppView {
  IMAGE_EDITING = 'Roof Visualizer',
  IMAGE_ANALYSIS = 'Damage Inspector',
  IMAGE_GENERATION = 'Inspiration Generator',
  CHAT = 'AI Assistant',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
