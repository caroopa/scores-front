import { useEffect, useMemo, useState } from "react";

import {
	Box,
	Button,
	ButtonGroup,
	HStack,
	Icon,
	IconButton,
	Pagination,
	Skeleton,
	Table,
	Text,
	VStack,
	NativeSelect,
	Center,
} from "@chakra-ui/react";

import { LuArrowUpDown } from "react-icons/lu";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import type { InstructorScore } from "../types/domain";
import { getInstructorScores } from "../services/instructor";

interface InstructorTableProps {
	reloadKey: number;
}

type SortField = "index" | "name" | "total";

export default function InstructorTable({ reloadKey }: InstructorTableProps) {
	const [instructors, setInstructors] = useState<InstructorScore[]>([]);
	const [loading, setLoading] = useState(false);
	const [sortField, setSortField] = useState<SortField>("total");
	const [ascending, setAscending] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(11);

	useEffect(() => {
		let ignore = false;

		const fetchInstructors = async () => {
			try {
				setLoading(true);

				const data = await getInstructorScores();

				if (!ignore) {
					setInstructors(data);
				}
			} catch (error) {
				console.error(error);
			} finally {
				if (!ignore) {
					setLoading(false);
				}
			}
		};

		fetchInstructors();

		return () => {
			ignore = true;
		};
	}, [reloadKey]);

	const sortedInstructors = useMemo(() => {
		return [...instructors].sort((a, b) => {
			const direction = ascending ? 1 : -1;

			const valueA = a[sortField];

			const valueB = b[sortField];

			if (typeof valueA === "string" && typeof valueB === "string") {
				return valueA.localeCompare(valueB) * direction;
			}

			return (Number(valueA) - Number(valueB)) * direction;
		});
	}, [instructors, sortField, ascending]);

	const paginatedInstructors = useMemo(() => {
		const start = (currentPage - 1) * pageSize;

		return sortedInstructors.slice(start, start + pageSize);
	}, [sortedInstructors, currentPage, pageSize]);

	const startItem = (currentPage - 1) * pageSize + 1;

	const endItem = Math.min(currentPage * pageSize, sortedInstructors.length);

	const handleSort = (field: SortField) => {
		setSortField(field);

		setAscending((prev) => (sortField === field ? !prev : true));
	};

	return (
		<VStack align="stretch" gap="5">
			<Box borderWidth="1px" borderRadius="xl" overflowX="auto">
				<Table.Root size="sm" variant="outline" interactive>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader>
								<Button
									size="xs"
									variant="ghost"
									onClick={() => handleSort("index")}
								>
									#
									<Icon as={LuArrowUpDown} />
								</Button>
							</Table.ColumnHeader>

							<Table.ColumnHeader>
								<Button
									size="xs"
									variant="ghost"
									onClick={() => handleSort("name")}
								>
									Instructor
									<Icon as={LuArrowUpDown} />
								</Button>
							</Table.ColumnHeader>

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
						{loading
							? Array.from({
									length: 8,
								}).map((_, index) => (
									<Table.Row key={index}>
										{Array.from({
											length: 3,
										}).map((__, cellIndex) => (
											<Table.Cell key={cellIndex}>
												<Skeleton height="20px" />
											</Table.Cell>
										))}
									</Table.Row>
								))
							: paginatedInstructors.map((instructor) => (
									<Table.Row key={instructor.name}>
										<Table.Cell>{instructor.index}</Table.Cell>

										<Table.Cell>
											<Text>{instructor.name}</Text>
										</Table.Cell>

										<Table.Cell>
											<Center>
												<Text fontWeight="bold">{instructor.total}</Text>
											</Center>
										</Table.Cell>
									</Table.Row>
								))}
					</Table.Body>
				</Table.Root>
			</Box>

			{!loading && sortedInstructors.length > 0 && (
				<HStack justify="space-between" wrap="wrap" gap="4">
					<HStack>
						<Text>
							{startItem}-{endItem} de {sortedInstructors.length}
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

								<option value={11}>11</option>

								<option value={20}>20</option>

								<option value={50}>50</option>
							</NativeSelect.Field>
						</NativeSelect.Root>
					</HStack>

					<Pagination.Root
						count={sortedInstructors.length}
						pageSize={pageSize}
						page={currentPage}
						onPageChange={(e) => setCurrentPage(e.page)}
					>
						<ButtonGroup attached variant="outline" size="sm">
							<Pagination.PrevTrigger asChild>
								<IconButton>
									<HiChevronLeft />
								</IconButton>
							</Pagination.PrevTrigger>

							<Pagination.Items
								render={(page) => (
									<IconButton
										variant={currentPage === page.value ? "solid" : "outline"}
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

			{!loading && sortedInstructors.length === 0 && (
				<Box borderWidth="1px" borderRadius="xl" p="8" textAlign="center">
					<Text>No hay instructores 👀</Text>
				</Box>
			)}
		</VStack>
	);
}
