import { useRef, useState } from "react";

import {
	Box,
	Button,
	Heading,
	HStack,
	Icon,
	Spinner,
	Tabs,
	Text,
} from "@chakra-ui/react";

// --icons --
import { LuCloudUpload, LuMedal, LuTable, LuTrophy } from "react-icons/lu";

// -- domain --
import { uploadData } from "./services/general";
import GeneralTable from "./components/GeneralTable";
import CompetitorTable from "./components/CompetitorTable";
import TrophyTable from "./components/TrophyTable";
import SchoolTable from "./components/SchoolTable";

export default function App() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState(false);

	const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file = event.target.files?.[0];
			if (!file) return;

			if (!file.name.toLowerCase().endsWith(".csv")) {
				alert("Sólo se permiten archivos CSV");
				return;
			}

			setLoading(true);
			await uploadData(file);
			alert("Datos cargados correctamente");
		} catch (error) {
			console.error(error);

			alert("Error en la carga del archivo");
		} finally {
			setLoading(false);

			if (inputRef.current) {
				inputRef.current.value = "";
			}
		}
	};

	return (
		<Box minH="100vh">
			<Box p="6">
				<HStack justify="space-between" wrap="wrap">
					<Text fontSize="2xl" fontWeight="bold">
						Copa Koguryo
					</Text>

					<Button variant="surface" onClick={() => inputRef.current?.click()}>
						{loading ? (
							<Spinner size="sm" />
						) : (
							<>
								<Icon as={LuCloudUpload} />
								Cargar CSV
							</>
						)}
					</Button>

					<input
						ref={inputRef}
						type="file"
						hidden
						accept=".csv"
						onChange={handleUpload}
					/>
				</HStack>
			</Box>

			<Box p="6">
				<Tabs.Root defaultValue="data" variant="subtle" fitted>
					<Tabs.List borderWidth="1px" mb="4">
						<Tabs.Trigger value="data">
							<Icon as={LuTable} />
							Datos
						</Tabs.Trigger>

						<Tabs.Trigger value="trophies">
							<Icon as={LuTrophy} />
							Medallas
						</Tabs.Trigger>

						<Tabs.Trigger value="ranking">
							<Icon as={LuMedal} />
							Ranking
						</Tabs.Trigger>

						<Tabs.Indicator rounded="lg" />
					</Tabs.List>

					<Tabs.Content value="data">
						<GeneralTable />
					</Tabs.Content>

					<Tabs.Content value="trophies">
						<TrophyTable />
					</Tabs.Content>

					<Tabs.Content value="ranking">
						<HStack justify="space-between" align="center">
							<Box>
								<Heading size="2xl" textAlign="center" mb="5">
									Escuelas
								</Heading>
								<SchoolTable />
							</Box>

							<Box>
								<Heading size="2xl" textAlign="center" mb="5">
									Top 10 Danes
								</Heading>
								<CompetitorTable category="dan" />
							</Box>

							<Box>
								<Heading size="2xl" textAlign="center" mb="5">
									Top 10 Colores
								</Heading>
								<CompetitorTable category="color" />
							</Box>
						</HStack>
					</Tabs.Content>
				</Tabs.Root>
			</Box>
		</Box>
	);
}
