export interface EditorElement {
  id: string;
  type: 'text' | 'button' | 'image' | 'container';
  props: Record<string, any>;
}

export interface EditorState {
  elements: EditorElement[];
  selectedElementId: string | null;
}
