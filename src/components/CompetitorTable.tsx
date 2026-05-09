import { useMemo, useState } from "react";

import {
	Badge,
	Box,
	Button,
	Center,
	Drawer,
	HStack,
	Icon,
	Popover,
	Portal,
	Skeleton,
	Stack,
	Table,
	Text,
	VStack,
	useBreakpointValue,
} from "@chakra-ui/react";

import { LuArrowUpDown, LuEye } from "react-icons/lu";

import { useQuery } from "@tanstack/react-query";

import type { CompetitorScore } from "../types/domain";

import { getScores } from "../services/competitor";

import CompetitorDetail from "./CompetitorDetail";

type SortField = "name" | "belt" | "total";

interface CompetitorTableProps {
	category: string;
}

export default function CompetitorTable({ category }: CompetitorTableProps) {
	const [sortField, setSortField] = useState<SortField>("total");

	const [ascending, setAscending] = useState(false);

	const [selectedCompetitor, setSelectedCompetitor] =
		useState<CompetitorScore | null>(null);

	const isMobile = useBreakpointValue({
		base: true,
		md: false,
	});

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

	const renderCompetitorContent = (competitor: CompetitorScore) => (
		<VStack align="start" gap="3">
			<Text fontWeight="bold" fontSize="lg">
				{competitor.name}
			</Text>

			<HStack wrap="wrap">
				<Badge colorPalette="blue">{competitor.belt}</Badge>

				<Badge colorPalette="green">{competitor.total} pts</Badge>
			</HStack>

			<Box>
				<Text>Instructor</Text>

				<Text>{competitor.instructor}</Text>
			</Box>

			<Box>
				<Text>Escuela</Text>

				<Text>{competitor.school}</Text>
			</Box>

			<Box>
				<Text>Edad</Text>

				<Text>{competitor.age}</Text>
			</Box>
		</VStack>
	);

	return (
		<Stack gap="4">
			<Box borderWidth="1px" overflowX="auto">
				<Table.Root size="sm" variant="outline" interactive>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader>
								<Button
									size="xs"
									variant="ghost"
									onClick={() => handleSort("name")}
								>
									Competidor
									<Icon as={LuArrowUpDown} />
								</Button>
							</Table.ColumnHeader>

							<Table.ColumnHeader>
								<Button
									size="xs"
									variant="ghost"
									onClick={() => handleSort("belt")}
								>
									Cinturón
									<Icon as={LuArrowUpDown} />
								</Button>
							</Table.ColumnHeader>

							<Table.ColumnHeader textAlign="end">
								<Button
									size="xs"
									variant="ghost"
									onClick={() => handleSort("total")}
								>
									TOTAL
									<Icon as={LuArrowUpDown} />
								</Button>
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
											<Skeleton height="40px" />
										</Table.Cell>

										<Table.Cell>
											<Skeleton height="40px" />
										</Table.Cell>

										<Table.Cell>
											<Skeleton height="40px" />
										</Table.Cell>
									</Table.Row>
								))
							: sortedCompetitors.map((competitor) => (
									<Table.Row key={`${competitor.name}-${competitor.school}`}>
										<Table.Cell>
											<HStack gap="3">
												{isMobile ? (
													<Drawer.Root>
														<Drawer.Trigger asChild>
															<Button
																size="xs"
																variant="ghost"
																onClick={() =>
																	setSelectedCompetitor(competitor)
																}
															>
																<Icon as={LuEye} />
															</Button>
														</Drawer.Trigger>

														<Portal>
															<Drawer.Backdrop />

															<Drawer.Positioner>
																<Drawer.Content>
																	<Drawer.Header>
																		<Drawer.Title>Competidor</Drawer.Title>
																	</Drawer.Header>

																	<Drawer.Body>
																		{selectedCompetitor &&
																			renderCompetitorContent(
																				selectedCompetitor,
																			)}
																	</Drawer.Body>
																</Drawer.Content>
															</Drawer.Positioner>
														</Portal>
													</Drawer.Root>
												) : (
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
												)}

												<Text>{competitor.name}</Text>
											</HStack>
										</Table.Cell>

										<Table.Cell>
											<Badge colorPalette="blue">{competitor.belt}</Badge>
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
