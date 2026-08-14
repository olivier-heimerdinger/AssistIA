import type { BuilderNode, DragState, StyleProps } from './types';

export class BuilderStore {
    // The root node of the canvas
    rootNode = $state<BuilderNode>({
        id: 'root',
        type: 'canvas',
        name: 'Body',
        classes: [],
        styles: {
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            paddingTop: '20px',
            paddingRight: '20px',
            paddingBottom: '20px',
            paddingLeft: '20px'
        },
        attributes: {},
        children: []
    });

    // Currently selected node for styling
    selectedNodeId = $state<string | null>(null);

    // Drag & Drop state
    dragState = $state<DragState>({
        isDragging: false,
        draggedNodeId: null,
        targetNodeId: null,
        dropPosition: null
    });

    // UI state
    uiState = $state({
        showSidebarLeft: true,
        showSidebarRight: true
    });

    // Helper to find a node by ID recursively
    findNode(id: string, currentNode: BuilderNode = this.rootNode): BuilderNode | null {
        if (currentNode.id === id) return currentNode;
        for (const child of currentNode.children) {
            const found = this.findNode(id, child);
            if (found) return found;
        }
        return null;
    }

    // Helper to find a node's parent and its index
    findParent(id: string, currentNode: BuilderNode = this.rootNode): { parent: BuilderNode, index: number } | null {
        for (let i = 0; i < currentNode.children.length; i++) {
            if (currentNode.children[i].id === id) {
                return { parent: currentNode, index: i };
            }
            const found = this.findParent(id, currentNode.children[i]);
            if (found) return found;
        }
        return null;
    }

    selectNode(id: string | null) {
        this.selectedNodeId = id;
    }

    getSelectedNode(): BuilderNode | null {
        if (!this.selectedNodeId) return null;
        return this.findNode(this.selectedNodeId);
    }

    updateNodeStyles(id: string, newStyles: Partial<StyleProps>) {
        const node = this.findNode(id);
        if (node) {
            node.styles = { ...node.styles, ...newStyles };
        }
    }

    updateNodeAttributes(id: string, newAttributes: Record<string, string>) {
        const node = this.findNode(id);
        if (node) {
            node.attributes = { ...node.attributes, ...newAttributes };
        }
    }

    updateNodeContent(id: string, content: string) {
        const node = this.findNode(id);
        if (node) {
            node.content = content;
        }
    }

    removeNode(id: string) {
        if (id === 'root') return; // Cannot remove root
        const result = this.findParent(id);
        if (result) {
            result.parent.children.splice(result.index, 1);
            if (this.selectedNodeId === id) {
                this.selectedNodeId = null;
            }
        }
    }

    // Add a new node or move an existing one
    insertNode(node: BuilderNode, targetId: string, position: 'top' | 'bottom' | 'inside') {
        const targetNode = this.findNode(targetId);
        if (!targetNode) return;

        // If we are moving an existing node, remove it first
        this.removeNode(node.id);

        if (position === 'inside') {
            targetNode.children.push(node);
        } else {
            const targetResult = this.findParent(targetId);
            if (targetResult) {
                const insertIndex = position === 'top' ? targetResult.index : targetResult.index + 1;
                targetResult.parent.children.splice(insertIndex, 0, node);
            }
        }
    }

    // Load from DB
    loadFromJSON(jsonString: string) {
        try {
            const parsed = JSON.parse(jsonString);
            if (parsed && parsed.id === 'root') {
                this.rootNode = parsed;
                this.selectedNodeId = null;
            }
        } catch (e) {
            console.error("Failed to parse builder JSON", e);
        }
    }

    // Save to DB
    toJSON(): string {
        return JSON.stringify(this.rootNode);
    }
}

// Export a singleton instance
export const builderStore = new BuilderStore();
