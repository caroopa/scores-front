import { useMemo, useState } from "react";

import {
	Badge,
	Box,
	Button,
	ButtonGroup,
	Center,
	HStack,
	Icon,
	IconButton,
	Input,
	InputGroup,
	NativeSelect,
	Pagination,
	Popover,
	Portal,
	Skeleton,
	Spinner,
	Table,
	Text,
	VStack,
} from "@chakra-ui/react";

import { LuArrowUpDown, LuEye, LuSearch } from "react-icons/lu";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { General, Score } from "../../types/domain";

import {
	calculateTotal,
	getCompetitors,
	type ScorePayload,
} from "../../services/general";

import CompetitorDetail from "../CompetitorDetail";

const radioOptions = [1, 2, 3, 0];

interface SortConfig {
	field: keyof General;
	ascending: boolean;
}

type MutationVariables = {
	competitorId: number;
	score: ScorePayload;
};

export default function GeneralTable() {
	const queryClient = useQueryClient();

	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);

	const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

	const {
		data: competitors = [],
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["competitors"],
		queryFn: getCompetitors,
	});

	const calculateMutation = useMutation({
		mutationFn: ({ competitorId, score }: MutationVariables) =>
			calculateTotal(competitorId, score),

		onSuccess: async () => {
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
		},
	});

	const normalizeText = (text: string) =>
		text
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "");

	const filteredCompetitors = useMemo(() => {
		const normalizedSearch = normalizeText(search);

		const filtered = competitors.filter((competitor) => {
			const searchable = normalizeText(`
					${competitor.name}
					${competitor.school}
					${competitor.instructor}
				`);

			return searchable.includes(normalizedSearch);
		});

		if (!sortConfig) {
			return filtered;
		}

		return filtered.sort((a, b) => {
			const { field, ascending } = sortConfig;

			const direction = ascending ? 1 : -1;

			const valueA = a[field];
			const valueB = b[field];

			if (typeof valueA === "string" && typeof valueB === "string") {
				return valueA.localeCompare(valueB) * direction;
			}

			return (Number(valueA) - Number(valueB)) * direction;
		});
	}, [competitors, search, sortConfig]);

	const paginatedCompetitors = filteredCompetitors.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	const startItem =
		filteredCompetitors.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;

	const endItem = Math.min(currentPage * pageSize, filteredCompetitors.length);

	const handleSort = (field: keyof General) => {
		setSortConfig((prev) => {
			if (!prev || prev.field !== field) {
				return {
					field,
					ascending: true,
				};
			}

			return {
				field,
				ascending: !prev.ascending,
			};
		});
	};

	const handleCalculateTotal = async (
		competitor: General,
		field: keyof Score,
		value: number,
	) => {
		const score: ScorePayload = {
			forms: field === "forms" ? value : competitor.forms,

			combat: field === "combat" ? value : competitor.combat,

			jump: field === "jump" ? value : competitor.jump,
		};

		try {
			await calculateMutation.mutateAsync({
				competitorId: competitor.id_competitor,
				score,
			});
		} catch (error) {
			console.error(error);
		}
	};

	const renderRadioGroup = (
		competitor: General,
		field: keyof Score,
		disabled = false,
	) => {
		return (
			<HStack gap="0">
				{radioOptions.map((option) => {
					const checked = competitor[field] === option;

					return (
						<Box
							as="label"
							key={option}
							cursor={disabled ? "not-allowed" : "pointer"}
						>
							<input
								type="radio"
								checked={checked}
								disabled={disabled}
								onChange={() => handleCalculateTotal(competitor, field, option)}
								style={{
									position: "absolute",
									opacity: 0,
									pointerEvents: "none",
								}}
							/>

							<Box
								px="3"
								py="2"
								borderWidth="1px"
								borderColor={checked ? "purple.500" : "gray.300"}
								bg={
									checked
										? disabled
											? "gray.300"
											: "purple.50"
										: disabled
											? "gray.100"
											: "white"
								}
								color={checked ? "purple.600" : "gray.700"}
								transition="0.2s"
								fontWeight="medium"
								_hover={
									disabled
										? {}
										: {
												bg: "purple.50",
											}
								}
								borderLeftRadius={option === 1 ? "md" : undefined}
								borderRightRadius={option === 0 ? "md" : undefined}
							>
								{option}
							</Box>
						</Box>
					);
				})}
			</HStack>
		);
	};

	return (
		<VStack align="stretch" gap="5">
			<InputGroup flex="1" startElement={<LuSearch />}>
				<Input
					placeholder="Buscar competidor..."
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);

						setCurrentPage(1);
					}}
				/>
			</InputGroup>

			<Box borderWidth="1px" overflowX="auto">
				<Table.Root size="sm" variant="outline" interactive>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader>
								<Button
									size="xs"
									variant="ghost"
									onClick={() => handleSort("school")}
								>
									Escuela
									<Icon as={LuArrowUpDown} />
								</Button>
							</Table.ColumnHeader>

							<Table.ColumnHeader>
								<Button
									size="xs"
									variant="ghost"
									onClick={() => handleSort("instructor")}
								>
									Instructor
									<Icon as={LuArrowUpDown} />
								</Button>
							</Table.ColumnHeader>

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

							<Table.ColumnHeader>Categoría</Table.ColumnHeader>

							<Table.ColumnHeader>Formas</Table.ColumnHeader>

							<Table.ColumnHeader>Combate</Table.ColumnHeader>

							<Table.ColumnHeader>Salto</Table.ColumnHeader>

							<Table.ColumnHeader>
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
									length: pageSize,
								}).map((_, index) => (
									<Table.Row key={index}>
										{Array.from({
											length: 8,
										}).map((_, cellIndex) => (
											<Table.Cell key={cellIndex}>
												<Skeleton height="40px" />
											</Table.Cell>
										))}
									</Table.Row>
								))
							: paginatedCompetitors.map((competitor) => {
									const isUpdating =
										calculateMutation.isPending &&
										calculateMutation.variables?.competitorId ===
											competitor.id_competitor;

									return (
										<Table.Row key={competitor.id_competitor}>
											<Table.Cell>{competitor.school}</Table.Cell>

											<Table.Cell>{competitor.instructor}</Table.Cell>

											<Table.Cell>
												<HStack gap="3">
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

													<Text>{competitor.name}</Text>
												</HStack>
											</Table.Cell>

											<Table.Cell>
												<Badge
													colorPalette={competitor.is_dan ? "red" : "green"}
												>
													{competitor.is_dan ? "DAN" : "COLOR"}
												</Badge>
											</Table.Cell>

											<Table.Cell>
												{renderRadioGroup(competitor, "forms", isUpdating)}
											</Table.Cell>

											<Table.Cell>
												{renderRadioGroup(competitor, "combat", isUpdating)}
											</Table.Cell>

											<Table.Cell>
												{competitor.is_dan
													? "-"
													: renderRadioGroup(competitor, "jump", isUpdating)}
											</Table.Cell>

											<Table.Cell>
												<Center>
													{isUpdating ? (
														<Spinner size="sm" />
													) : (
														<Text fontWeight="bold">{competitor.total}</Text>
													)}
												</Center>
											</Table.Cell>
										</Table.Row>
									);
								})}
					</Table.Body>
				</Table.Root>
			</Box>

			{!isLoading && filteredCompetitors.length > 0 && (
				<HStack justify="space-between" wrap="wrap" gap="4">
					<HStack>
						<Text fontSize="sm" color="gray.600">
							{startItem}-{endItem} de {filteredCompetitors.length}
						</Text>

						<NativeSelect.Root size="sm" width="90px">
							<NativeSelect.Field
								value={pageSize}
								onChange={(e) => {
									setPageSize(Number(e.target.value));

									setCurrentPage(1);
								}}
							>
								<option value={5}>5</option>

								<option value={10}>10</option>

								<option value={20}>20</option>

								<option value={50}>50</option>
							</NativeSelect.Field>
						</NativeSelect.Root>
					</HStack>

					<Pagination.Root
						count={filteredCompetitors.length}
						pageSize={pageSize}
						page={currentPage}
						onPageChange={(e) => setCurrentPage(e.page)}
					>
						<ButtonGroup attached variant="ghost" size="sm">
							<Pagination.PrevTrigger asChild>
								<IconButton>
									<HiChevronLeft />
								</IconButton>
							</Pagination.PrevTrigger>

							<Pagination.Items
								render={(page) => (
									<IconButton
										variant={currentPage === page.value ? "surface" : "ghost"}
										onClick={() => setCurrentPage(page.value)}
									>
										{page.value}
									</IconButton>
								)}
							/>

							<Pagination.NextTrigger asChild>
								<IconButton>
									<HiChevronRight />
								</IconButton>
							</Pagination.NextTrigger>
						</ButtonGroup>
					</Pagination.Root>
				</HStack>
			)}

			{!isLoading && filteredCompetitors.length === 0 && (
				<Box borderWidth="1px" borderRadius="xl" p="8" textAlign="center">
					<Text>No se encontraron competidores 👀</Text>
				</Box>
			)}
		</VStack>
	);
}
