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

import { AnimatePresence, motion } from "framer-motion";

// -- icons --
import { LuCloudUpload, LuMedal, LuTable, LuTrophy } from "react-icons/lu";

// -- react query --
import { useQueryClient } from "@tanstack/react-query";

// -- services --
import { uploadData } from "./services/general";

// -- components --
import GeneralTable from "./components/Table/GeneralTable";
import CompetitorTable from "./components/Table/CompetitorTable";
import TrophyTable from "./components/Table/TrophyTable";
import SchoolTable from "./components/Table/SchoolTable";

const MotionBox = motion(Box);

const tabs = ["data", "trophies", "ranking"];

export default function App() {
	const queryClient = useQueryClient();

	const inputRef = useRef<HTMLInputElement>(null);

	const [loading, setLoading] = useState(false);

	const [tab, setTab] = useState("data");

	const [direction, setDirection] = useState(1);

	const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file = event.target.files?.[0];

			if (!file) {
				return;
			}

			if (!file.name.toLowerCase().endsWith(".csv")) {
				alert("Sólo se permiten archivos CSV");

				return;
			}

			setLoading(true);

			await uploadData(file);

			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ["competitors"],
				}),

				queryClient.invalidateQueries({
					queryKey: ["schools"],
				}),

				queryClient.invalidateQueries({
					queryKey: ["scores"],
				}),

				queryClient.invalidateQueries({
					queryKey: ["trophies"],
				}),
			]);

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
				<Tabs.Root
					value={tab}
					onValueChange={(e) => {
						const newIndex = tabs.indexOf(e.value);

						const currentIndex = tabs.indexOf(tab);

						setDirection(newIndex > currentIndex ? 1 : -1);

						setTab(e.value);
					}}
					variant="subtle"
					fitted
				>
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
				</Tabs.Root>

				<Box overflow="hidden">
					<AnimatePresence mode="wait">
						<MotionBox
							key={tab}
							initial={{
								opacity: 0,
								x: direction > 0 ? 80 : -80,
							}}
							animate={{
								opacity: 1,
								x: 0,
							}}
							exit={{
								opacity: 0,
								x: direction > 0 ? -80 : 80,
							}}
							transition={{
								duration: 0.25,
								ease: "easeInOut",
							}}
						>
							{tab === "data" && <GeneralTable />}

							{tab === "trophies" && <TrophyTable />}

							{tab === "ranking" && (
								<HStack
									justify="space-between"
									align="start"
									gap="5"
									wrap="wrap"
								>
									<Box flex="1" minW="320px">
										<Heading size="2xl" textAlign="center" mb="5">
											Escuelas
										</Heading>

										<SchoolTable />
									</Box>

									<Box flex="1" minW="320px">
										<Heading size="2xl" textAlign="center" mb="5">
											Top 10 Danes
										</Heading>

										<CompetitorTable category="dan" />
									</Box>

									<Box flex="1" minW="320px">
										<Heading size="2xl" textAlign="center" mb="5">
											Top 10 Colores
										</Heading>

										<CompetitorTable category="color" />
									</Box>
								</HStack>
							)}
						</MotionBox>
					</AnimatePresence>
				</Box>
			</Box>
		</Box>
	);
}
