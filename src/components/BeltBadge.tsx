import { Badge } from "@chakra-ui/react";

const beltConfig: Record<
	string,
	{
		colorPalette: string;
		variant: "surface" | "outline";
	}
> = {
	BLANCO: {
		colorPalette: "gray",
		variant: "outline",
	},

	"BLANCO PUNTA AMARILLA": {
		colorPalette: "gray",
		variant: "outline",
	},

	AMARILLO: {
		colorPalette: "yellow",
		variant: "surface",
	},

	"AMARILLO PUNTA VERDE": {
		colorPalette: "yellow",
		variant: "surface",
	},

	VERDE: {
		colorPalette: "green",
		variant: "surface",
	},

	"VERDE PUNTA AZUL": {
		colorPalette: "green",
		variant: "surface",
	},

	AZUL: {
		colorPalette: "blue",
		variant: "surface",
	},

	"AZUL PUNTA ROJA": {
		colorPalette: "blue",
		variant: "surface",
	},

	ROJO: {
		colorPalette: "red",
		variant: "surface",
	},

	"ROJO PUNTA NEGRA": {
		colorPalette: "red",
		variant: "surface",
	},

	"PRIMER DAN": {
		colorPalette: "gray",
		variant: "surface",
	},

	"SEGUNDO DAN": {
		colorPalette: "gray",
		variant: "surface",
	},

	"TERCER DAN": {
		colorPalette: "gray",
		variant: "surface",
	},

	"CUARTO DAN": {
		colorPalette: "gray",
		variant: "surface",
	},

	"QUINTO DAN": {
		colorPalette: "gray",
		variant: "surface",
	},

	"SEXTO DAN": {
		colorPalette: "gray",
		variant: "surface",
	},

	"SÉPTIMO DAN": {
		colorPalette: "gray",
		variant: "surface",
	},

	"OCTAVO DAN": {
		colorPalette: "gray",
		variant: "surface",
	},

	"NOVENO DAN": {
		colorPalette: "gray",
		variant: "surface",
	},
};

export default function BeltBadge({ belt }: { belt: string }) {
	const normalizedBelt = belt.toUpperCase().trim();

	const config = beltConfig[normalizedBelt] ?? {
		colorPalette: "gray",
		variant: "subtle",
	};

	return (
		<Badge colorPalette={config.colorPalette} variant={config.variant}>
			{normalizedBelt}
		</Badge>
	);
}
