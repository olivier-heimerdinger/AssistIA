<script lang="ts">
    import { builderStore } from "$lib/builder/store.svelte";

    // We will conditionally render editors based on selected node
    const selectedNode = $derived(builderStore.getSelectedNode());

    function handleImageUpload(e: Event) {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file && selectedNode) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                builderStore.updateNodeAttributes(selectedNode.id, {
                    src: base64,
                });
            };
            reader.readAsDataURL(file);
        }
    }
</script>

<aside class="sidebar-right">
    <div class="header">Propriétés</div>

    <div class="properties-container">
        {#if selectedNode}
            <div class="node-info">
                <span class="badge">{selectedNode.type}</span>
                <span class="id">#{selectedNode.id.slice(0, 8)}</span>
            </div>

            <!-- Attributs (spécifiques par type) -->
            {#if selectedNode.type === "image"}
                <div class="section">
                    <div class="section-title">Attributs de l'image</div>
                    <div class="form-group">
                        <label for="img-upload">Ou uploader une image</label>
                        <input
                            id="img-upload"
                            type="file"
                            accept="image/*"
                            onchange={handleImageUpload}
                        />
                    </div>
                    <div class="form-group">
                        <label for="img-src"
                            >URL de l'image (src ou base64)</label
                        >
                        <input
                            id="img-src"
                            type="text"
                            placeholder="https://... ou data:image/..."
                            value={selectedNode.attributes.src || ""}
                            oninput={(e) =>
                                builderStore.updateNodeAttributes(
                                    selectedNode.id,
                                    { src: e.currentTarget.value },
                                )}
                        />
                    </div>
                    <div class="form-group">
                        <label for="img-alt">Texte alternatif (alt)</label>
                        <input
                            id="img-alt"
                            type="text"
                            placeholder="Description courte"
                            value={selectedNode.attributes.alt || ""}
                            oninput={(e) =>
                                builderStore.updateNodeAttributes(
                                    selectedNode.id,
                                    { alt: e.currentTarget.value },
                                )}
                        />
                    </div>
                </div>
            {/if}

            <!-- Typographie -->
            <div class="section">
                <div class="section-title">Typographie</div>
                <div class="form-group">
                    <label for="font-size">Taille de police</label>
                    <input
                        id="font-size"
                        type="text"
                        placeholder="ex: 16px"
                        value={selectedNode.styles.fontSize || ""}
                        oninput={(e) =>
                            builderStore.updateNodeStyles(selectedNode.id, {
                                fontSize: e.currentTarget.value,
                            })}
                    />
                </div>
                <div class="form-group">
                    <label for="text-color">Couleur du texte</label>
                    <input
                        id="text-color"
                        type="color"
                        value={selectedNode.styles.color || "#000000"}
                        oninput={(e) =>
                            builderStore.updateNodeStyles(selectedNode.id, {
                                color: e.currentTarget.value,
                            })}
                    />
                </div>
                <div class="form-group">
                    <label for="text-align">Alignement</label>
                    <select
                        id="text-align"
                        value={selectedNode.styles.textAlign || "left"}
                        onchange={(e) =>
                            builderStore.updateNodeStyles(selectedNode.id, {
                                textAlign: e.currentTarget.value,
                            })}
                    >
                        <option value="left">Gauche</option>
                        <option value="center">Centre</option>
                        <option value="right">Droite</option>
                    </select>
                </div>
            </div>

            <!-- Layout & Spacing -->
            <div class="section">
                <div class="section-title">Mise en page</div>
                <div class="form-group">
                    <label for="display">Display</label>
                    <select
                        id="display"
                        value={selectedNode.styles.display || "block"}
                        onchange={(e) =>
                            builderStore.updateNodeStyles(selectedNode.id, {
                                display: e.currentTarget.value,
                            })}
                    >
                        <option value="block">Block</option>
                        <option value="inline-block">Inline Block</option>
                        <option value="flex">Flex</option>
                    </select>
                </div>

                <div class="grid-inputs">
                    <div class="form-group">
                        <label for="padding-top">Padding Top</label>
                        <input
                            id="padding-top"
                            type="text"
                            placeholder="0px"
                            value={selectedNode.styles.paddingTop || ""}
                            oninput={(e) =>
                                builderStore.updateNodeStyles(selectedNode.id, {
                                    paddingTop: e.currentTarget.value,
                                })}
                        />
                    </div>
                    <div class="form-group">
                        <label for="padding-bottom">Padding Bot</label>
                        <input
                            id="padding-bottom"
                            type="text"
                            placeholder="0px"
                            value={selectedNode.styles.paddingBottom || ""}
                            oninput={(e) =>
                                builderStore.updateNodeStyles(selectedNode.id, {
                                    paddingBottom: e.currentTarget.value,
                                })}
                        />
                    </div>
                </div>
            </div>

            <!-- Décoration -->
            <div class="section">
                <div class="section-title">Décoration</div>
                <div class="form-group">
                    <label for="bg-color">Couleur de fond</label>
                    <input
                        id="bg-color"
                        type="color"
                        value={selectedNode.styles.backgroundColor || "#000000"}
                        oninput={(e) =>
                            builderStore.updateNodeStyles(selectedNode.id, {
                                backgroundColor: e.currentTarget.value,
                            })}
                    />
                </div>
                <div class="form-group">
                    <label for="border-radius">Arrondi</label>
                    <input
                        id="border-radius"
                        type="text"
                        placeholder="0px"
                        value={selectedNode.styles.borderRadius || ""}
                        oninput={(e) =>
                            builderStore.updateNodeStyles(selectedNode.id, {
                                borderRadius: e.currentTarget.value,
                            })}
                    />
                </div>
            </div>
        {:else}
            <div class="empty-state">
                <div class="icon">🖱️</div>
                <p>
                    Sélectionnez un élément sur le canvas pour modifier ses
                    propriétés.
                </p>
            </div>
        {/if}
    </div>
</aside>

<style>
    .sidebar-right {
        width: 300px;
        background: var(--color-surface);
        border-left: 1px solid var(--color-border);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    .header {
        padding: 1rem;
        font-weight: 600;
        border-bottom: 1px solid var(--color-border);
        color: var(--color-text);
    }

    .properties-container {
        padding: 1rem;
        flex: 1;
    }

    .node-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
        border-bottom: 1px dashed var(--color-border);
    }

    .badge {
        background: var(--color-surface-3);
        padding: 0.2rem 0.5rem;
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.05em;
        color: var(--color-text);
    }

    .id {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        font-family: monospace;
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        color: var(--color-text-muted);
        padding: 2rem;
        gap: 1rem;
    }

    .empty-state .icon {
        font-size: 2.5rem;
        opacity: 0.5;
    }

    .empty-state p {
        font-size: 0.9rem;
        line-height: 1.5;
    }

    .section {
        margin-bottom: 1.5rem;
    }

    .section-title {
        font-size: 0.8rem;
        text-transform: uppercase;
        font-weight: 700;
        color: var(--color-text-muted);
        margin-bottom: 1rem;
        letter-spacing: 0.05em;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    label {
        font-size: 0.85rem;
        color: var(--color-text);
    }

    input,
    select {
        padding: 0.5rem;
        background: var(--color-surface-2);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        color: var(--color-text);
        font-family: inherit;
        font-size: 0.9rem;
    }

    input[type="color"] {
        padding: 0;
        height: 40px;
        width: 100%;
        cursor: pointer;
    }

    .grid-inputs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
    }
</style>
