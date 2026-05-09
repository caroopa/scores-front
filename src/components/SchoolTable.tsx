import { useEffect, useState } from "react";

import {
	Box,
	Table,
	Text,
	VStack,
	Skeleton,
	Center,
	ButtonGroup,
	IconButton,
} from "@chakra-ui/react";
import { FaMinus, FaPlusMinus } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";

import type { SchoolScore } from "../types/domain";
import { adjustSchoolScore, getSchoolScores } from "../services/school";

interface SchoolTableProps {
	reloadKey: number;
}

export default function SchoolTable({ reloadKey }: SchoolTableProps) {
	const [schools, setSchools] = useState<SchoolScore[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let ignore = false;

		const fetchSchools = async () => {
			try {
				setLoading(true);

				const data = await getSchoolScores();

				if (!ignore) {
					setSchools(data);
				}
			} catch (error) {
				console.error(error);
			} finally {
				if (!ignore) {
					setLoading(false);
				}
			}
		};

		fetchSchools();

		return () => {
			ignore = true;
		};
	}, [reloadKey]);

	const handleAdjustScore = async (schoolId: number, delta: number) => {
		try {
			await adjustSchoolScore(schoolId, delta);

			setSchools((prev) =>
				prev.map((s) =>
					s.id_school === schoolId ? { ...s, total: s.total + delta } : s,
				),
			);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<VStack align="stretch" gap="5">
			<Box borderWidth="1px" overflowX="auto">
				<Table.Root size="sm" variant="outline">
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader>
								<Text>#</Text>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<Text>Escuela</Text>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<Text>Total</Text>
							</Table.ColumnHeader>
							<Table.ColumnHeader>
								<Center>
									<FaPlusMinus />
								</Center>
							</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{loading
							? Array.from({ length: 6 }).map((_, i) => (
									<Table.Row key={i}>
										{Array.from({ length: 3 }).map((__, j) => (
											<Table.Cell key={j}>
												<Skeleton height="20px" />
											</Table.Cell>
										))}
									</Table.Row>
								))
							: schools.map((school, index) => (
									<Table.Row key={index}>
										<Table.Cell>{index + 1}</Table.Cell>

										<Table.Cell>
											<Text>{school.name}</Text>
										</Table.Cell>

										<Table.Cell>
											<Center>
												<Text fontWeight="bold">{school.total}</Text>
											</Center>
										</Table.Cell>

										<Table.Cell>
											<ButtonGroup size="sm" variant="outline">
												<IconButton
													aria-label="increase"
													onClick={() => handleAdjustScore(school.id_school, 1)}
												>
													<MdAdd />
												</IconButton>
												<IconButton
													aria-label="decrease"
													onClick={() =>
														handleAdjustScore(school.id_school, -1)
													}
												>
													<FaMinus />
												</IconButton>
											</ButtonGroup>
										</Table.Cell>
									</Table.Row>
								))}
					</Table.Body>
				</Table.Root>
			</Box>

			{!loading && schools.length === 0 && (
				<Box borderWidth="1px" borderRadius="xl" p="8" textAlign="center">
					<Text>No hay escuelas 👀</Text>
				</Box>
			)}
		</VStack>
	);
}
