import {
	Box,
	ButtonGroup,
	Center,
	IconButton,
	Skeleton,
	Table,
	Text,
	Stack,
} from "@chakra-ui/react";

import { FaMinus, FaPlusMinus } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adjustSchoolScore, getSchoolScores } from "../services/school";

export default function SchoolTable() {
	const queryClient = useQueryClient();

	const {
		data: schools = [],
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["schools"],
		queryFn: getSchoolScores,
	});

	const adjustMutation = useMutation({
		mutationFn: ({ schoolId, delta }: { schoolId: number; delta: number }) =>
			adjustSchoolScore(schoolId, delta),

		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ["schools"],
				}),

				queryClient.invalidateQueries({
					queryKey: ["competitors"],
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

	const handleAdjustScore = async (schoolId: number, delta: number) => {
		try {
			await adjustMutation.mutateAsync({
				schoolId,
				delta,
			});
		} catch (error) {
			console.error(error);
		}
	};

	const skeletonRows = schools.length > 0 ? schools.length : 6;

	return (
		<Stack gap="5">
			<Box borderWidth="1px" overflowX="auto">
				<Table.Root size="sm" variant="outline">
					<Table.Header h="47px">
						<Table.Row>
							<Table.ColumnHeader>
								<Text textAlign="center">#</Text>
							</Table.ColumnHeader>

							<Table.ColumnHeader>
								<Text>Escuela</Text>
							</Table.ColumnHeader>

							<Table.ColumnHeader>
								<Text textAlign="center">Total</Text>
							</Table.ColumnHeader>

							<Table.ColumnHeader>
								<Center>
									<FaPlusMinus />
								</Center>
							</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{isLoading || isFetching
							? Array.from({
									length: skeletonRows,
								}).map((_, i) => (
									<Table.Row key={i}>
										{Array.from({
											length: 4,
										}).map((__, j) => (
											<Table.Cell key={j}>
												<Skeleton height="40px" />
											</Table.Cell>
										))}
									</Table.Row>
								))
							: schools.map((school, index) => {
									const isUpdating =
										adjustMutation.isPending &&
										adjustMutation.variables?.schoolId === school.id_school;

									return (
										<Table.Row key={school.id_school}>
											<Table.Cell>
												<Center>{index + 1}</Center>
											</Table.Cell>

											<Table.Cell>
												<Text>{school.name}</Text>
											</Table.Cell>

											<Table.Cell>
												<Center>
													{isUpdating ? (
														<Skeleton height="40px" width="40px" />
													) : (
														<Text fontWeight="bold">{school.total}</Text>
													)}
												</Center>
											</Table.Cell>

											<Table.Cell>
												<Center>
													<ButtonGroup size="sm" variant="outline">
														<IconButton
															aria-label="increase"
															disabled={isUpdating}
															onClick={() =>
																handleAdjustScore(school.id_school, 1)
															}
														>
															<MdAdd />
														</IconButton>

														<IconButton
															aria-label="decrease"
															disabled={isUpdating}
															onClick={() =>
																handleAdjustScore(school.id_school, -1)
															}
														>
															<FaMinus />
														</IconButton>
													</ButtonGroup>
												</Center>
											</Table.Cell>
										</Table.Row>
									);
								})}
					</Table.Body>
				</Table.Root>
			</Box>

			{!isLoading && schools.length === 0 && (
				<Box borderWidth="1px" p="8" textAlign="center">
					<Text>No hay escuelas 👀</Text>
				</Box>
			)}
		</Stack>
	);
}
