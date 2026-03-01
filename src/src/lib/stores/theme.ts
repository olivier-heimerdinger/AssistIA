import { writable } from "svelte/store";
import { browser } from "$app/environment";

export type ThemeType = "light" | "dark" | "auto";

function createThemeStore() {
    // Start with auto, but on the client we will read localStorage
    const { subscribe, set, update } = writable<ThemeType>("auto");

    if (browser) {
        const storedTheme = localStorage.getItem("theme") as ThemeType;
        if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "auto") {
            set(storedTheme);
        }

        // Subscribe to changes and update the DOM and localStorage
        subscribe((theme) => {
            if (theme !== "auto") {
                localStorage.setItem("theme", theme);
                document.documentElement.setAttribute("data-theme", theme);
            } else {
                localStorage.removeItem("theme");
                // For auto, determine if the system is dark, then set data-theme accordingly
                const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                document.documentElement.setAttribute("data-theme", systemPrefersDark ? "dark" : "light");
            }
        });

        // Listen for system preference changes when in auto mode
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
            const currentTheme = localStorage.getItem("theme");
            if (!currentTheme || currentTheme === "auto") {
                document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
            }
        });
    }

    return {
        subscribe,
        setTheme: (theme: ThemeType) => set(theme),
    };
}

export const theme = createThemeStore();
