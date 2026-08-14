export type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol';

export interface Block {
    id: string;
    type: BlockType;
    content: string;
}

export interface Document {
    $id?: string;
    title: string;
    blocks: string; // JSON string of Block[]
    authorId?: string;
    clientId?: string;
    $createdAt?: string;
    $updatedAt?: string;
}
