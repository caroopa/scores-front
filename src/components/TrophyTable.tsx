import { useEffect, useState } from "react";

import {
	Box,
	Center,
	HStack,
	Icon,
	Skeleton,
	Table,
	Text,
	VStack,
} from "@chakra-ui/react";
import { LuTrophy } from "react-icons/lu";
import type { TrophyCount } from "../types/domain";
import { trophiesCounts } from "../services/general";

interface TrophyTableProps {
	reloadKey: number;
}

export default function TrophyTable({ reloadKey }: TrophyTableProps) {
	const [trophies, setTrophies] = useState<TrophyCount[]>([]);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let ignore = false;

		const fetchTrophies = async () => {
			try {
				setLoading(true);

				const data = await trophiesCounts();

				if (!ignore) {
					setTrophies(data);
				}
			} catch (error) {
				console.error(error);
			} finally {
				if (!ignore) {
					setLoading(false);
				}
			}
		};

		fetchTrophies();

		return () => {
			ignore = true;
		};
	}, [reloadKey]);

	return (
		<VStack align="stretch" gap="5">
			<Box borderWidth="1px" overflow="hidden">
				<Table.Root size="sm" variant="outline">
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader>
								<Center>
									<Text>Puesto</Text>
								</Center>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<Center>
									<Text>Cantidad</Text>
								</Center>
							</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{loading
							? Array.from({
									length: 4,
								}).map((_, index) => (
									<Table.Row key={index}>
										{Array.from({
											length: 2,
										}).map((__, cellIndex) => (
											<Table.Cell key={cellIndex}>
												<Skeleton height="20px" />
											</Table.Cell>
										))}
									</Table.Row>
								))
							: trophies.map((trophy) => (
									<Table.Row key={trophy.place}>
										<Table.Cell>
											<Center>
												<HStack gap="3">
													<Icon as={LuTrophy} color={trophy.color} />

													<Text>{trophy.place}</Text>
												</HStack>
											</Center>
										</Table.Cell>

										<Table.Cell>
											<Center>
												<Text fontWeight="bold">{trophy.count}</Text>
											</Center>
										</Table.Cell>
									</Table.Row>
								))}
					</Table.Body>
				</Table.Root>
			</Box>

			{!loading && trophies.length === 0 && (
				<Box borderWidth="1px" borderRadius="xl" p="8" textAlign="center">
					<Text>No hay medallas 👀</Text>
				</Box>
			)}
		</VStack>
	);
}
