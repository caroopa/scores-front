import { useMemo, useState } from "react";

import {
	Box,
	Button,
	Center,
	HStack,
	Icon,
	Popover,
	Portal,
	Skeleton,
	Stack,
	Table,
	Text,
} from "@chakra-ui/react";

import { LuArrowUpDown, LuEye } from "react-icons/lu";

import { useQuery } from "@tanstack/react-query";

import { getScores } from "../../services/competitor";

import CompetitorDetail from "../CompetitorDetail";
import BeltBadge from "../BeltBadge";

type SortField = "name" | "belt" | "total";

interface CompetitorTableProps {
	category: string;
}

export default function CompetitorTable({ category }: CompetitorTableProps) {
	const [sortField, setSortField] = useState<SortField>("total");

	const [ascending, setAscending] = useState(false);

	const {
		data: competitors = [],
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["scores", category],
		queryFn: () => getScores(category),
	});

	const sortedCompetitors = useMemo(() => {
		return [...competitors].sort((a, b) => {
			const direction = ascending ? 1 : -1;

			switch (sortField) {
				case "name":
					return a.name.localeCompare(b.name) * direction;

				case "belt":
					return a.belt.localeCompare(b.belt) * direction;

				case "total":
					return (a.total - b.total) * direction;

				default:
					return 0;
			}
		});
	}, [competitors, sortField, ascending]);

	const handleSort = (field: SortField) => {
		if (field === sortField) {
			setAscending((prev) => !prev);

			return;
		}

		setSortField(field);

		setAscending(true);
	};

	const skeletonRows = competitors.length > 0 ? competitors.length : 6;

	return (
		<Stack gap="4">
			<Box borderWidth="1px" overflowX="auto">
				<Table.Root size="sm" variant="outline" interactive tableLayout="fixed">
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader width="55%">
								<Button
									size="xs"
									variant="ghost"
									onClick={() => handleSort("name")}
								>
									Competidor
									<Icon as={LuArrowUpDown} />
								</Button>
							</Table.ColumnHeader>

							<Table.ColumnHeader width="25%">
								<Button
									size="xs"
									variant="ghost"
									onClick={() => handleSort("belt")}
								>
									Cinturón
									<Icon as={LuArrowUpDown} />
								</Button>
							</Table.ColumnHeader>

							<Table.ColumnHeader width="20%">
								<Center>
									<Button
										size="xs"
										variant="ghost"
										onClick={() => handleSort("total")}
									>
										TOTAL
										<Icon as={LuArrowUpDown} />
									</Button>
								</Center>
							</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{isLoading || isFetching
							? Array.from({
									length: skeletonRows,
								}).map((_, index) => (
									<Table.Row key={index}>
										<Table.Cell>
											<Skeleton height="20px" width="180px" />
										</Table.Cell>

										<Table.Cell>
											<Skeleton height="20px" width="90px" />
										</Table.Cell>

										<Table.Cell>
											<Skeleton height="20px" width="40px" mx="auto" />
										</Table.Cell>
									</Table.Row>
								))
							: sortedCompetitors.map((competitor) => (
									<Table.Row key={`${competitor.name}-${competitor.school}`}>
										<Table.Cell>
											<HStack gap="3" overflow="hidden">
												<Popover.Root lazyMount unmountOnExit>
													<Popover.Trigger asChild>
														<Button size="xs" variant="ghost">
															<Icon as={LuEye} />
														</Button>
													</Popover.Trigger>

													<Portal>
														<Popover.Positioner>
															<Popover.Content>
																<Popover.Arrow />

																<Popover.Body>
																	<CompetitorDetail competitor={competitor} />
																</Popover.Body>
															</Popover.Content>
														</Popover.Positioner>
													</Portal>
												</Popover.Root>

												<Text truncate>{competitor.name}</Text>
											</HStack>
										</Table.Cell>

										<Table.Cell>
											<BeltBadge belt={competitor.belt} />
										</Table.Cell>

										<Table.Cell>
											<Center>
												<Text fontWeight="bold">{competitor.total}</Text>
											</Center>
										</Table.Cell>
									</Table.Row>
								))}
					</Table.Body>
				</Table.Root>
			</Box>

			{!isLoading && sortedCompetitors.length === 0 && (
				<Box borderWidth="1px" borderRadius="lg" p="8" textAlign="center">
					<Text>No se encontraron competidores 👀</Text>
				</Box>
			)}
		</Stack>
	);
}
