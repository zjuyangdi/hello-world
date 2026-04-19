export type InputMode = 'voice' | 'keyboard';

export type RecordingState = 'idle' | 'recording';

export interface StructuredSummary {
  title: string;
  keyPoints: string[];
  actionItems?: string[];
  entities?: {
    names: string[];
    places: string[];
    dates: string[];
  };
}
