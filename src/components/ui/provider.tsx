"use client";

import {
	ChakraProvider,
	createSystem,
	defaultConfig,
	defineConfig,
} from "@chakra-ui/react";

import { ColorModeProvider } from "./color-mode";

const config = defineConfig({
	globalCss: {
		html: {
			colorPalette: "purple",
			fontFamily: `"Montserrat", sans-serif`,
		},
	},
});

const system = createSystem(defaultConfig, config);

export function Provider(props: { children: React.ReactNode }) {
	return (
		<ChakraProvider value={system}>
			<ColorModeProvider forcedTheme="light">
				{props.children}
			</ColorModeProvider>
		</ChakraProvider>
	);
}
