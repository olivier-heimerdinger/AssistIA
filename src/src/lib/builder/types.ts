export type NodeType = 'canvas' | 'container' | 'text' | 'button' | 'image' | 'grid';

export interface StyleProps {
    // Typography
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    textAlign?: string;

    // Layout
    display?: string;
    flexDirection?: string;
    alignItems?: string;
    justifyContent?: string;
    gap?: string;

    // Spacing
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;

    // Size
    width?: string;
    height?: string;
    minHeight?: string;

    // Decoration
    backgroundColor?: string;
    borderRadius?: string;
    border?: string;
    boxShadow?: string;

    // Any other css property
    [key: string]: string | undefined;
}

export interface BuilderNode {
    id: string;             // Unique identifier (UUID)
    type: NodeType;         // Type of component
    name: string;           // Human readable name (e.g. "Hero Section")
    classes: string[];      // CSS classes
    styles: StyleProps;     // Inline styles
    attributes: Record<string, string>; // e.g. src, href, alt
    content?: string;       // Inner text/html for text nodes
    children: BuilderNode[];// Nested components
}

// Drag & Drop specific types
export interface DragState {
    isDragging: boolean;
    draggedNodeId: string | null;
    targetNodeId: string | null;    // Where we are dropping
    dropPosition: 'top' | 'bottom' | 'inside' | null;
}
