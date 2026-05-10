import {
	Box,
	ButtonGroup,
	Center,
	HStack,
	Icon,
	IconButton,
	Skeleton,
	Table,
	Text,
	VStack,
} from "@chakra-ui/react";

import { LuTrophy } from "react-icons/lu";
import { FaMinus, FaPlusMinus } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adjustTrophy, getTrophies } from "../../services/trophies";

import type { MedalType } from "../../types/domain";

const medalTypeMap: Record<string, MedalType> = {
	Oro: "gold",
	Plata: "silver",
	Bronce: "bronze",
};

export default function TrophyTable() {
	const queryClient = useQueryClient();

	const {
		data: trophies = [],
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["trophies"],
		queryFn: getTrophies,
	});

	const adjustMutation = useMutation({
		mutationFn: adjustTrophy,

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["trophies"],
			});
		},
	});

	const handleAdjustTrophy = async (place: string, value: number) => {
		try {
			await adjustMutation.mutateAsync({
				medal_type: medalTypeMap[place],
				value,
			});
		} catch (error) {
			console.error(error);
		}
	};

	const skeletonRows = trophies.length > 0 ? trophies.length : 3;

	return (
		<VStack align="stretch" gap="5">
			<Box borderWidth="1px" overflow="hidden">
				<Table.Root size="sm" variant="outline" tableLayout="fixed">
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader width="50%">
								<Center>
									<Text>Puesto</Text>
								</Center>
							</Table.ColumnHeader>

							<Table.ColumnHeader width="20%">
								<Center>
									<Text>Cantidad</Text>
								</Center>
							</Table.ColumnHeader>

							<Table.ColumnHeader width="30%">
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
								}).map((_, index) => (
									<Table.Row key={index}>
										<Table.Cell>
											<Skeleton height="20px" width="120px" mx="auto" />
										</Table.Cell>

										<Table.Cell>
											<Skeleton height="20px" width="40px" mx="auto" />
										</Table.Cell>

										<Table.Cell>
											<Skeleton height="32px" width="80px" mx="auto" />
										</Table.Cell>
									</Table.Row>
								))
							: trophies.map((trophy) => {
									const isUpdating =
										adjustMutation.isPending &&
										adjustMutation.variables?.medal_type ===
											medalTypeMap[trophy.place];

									return (
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
													{isUpdating ? (
														<Skeleton height="20px" width="40px" />
													) : (
														<Text fontWeight="bold">{trophy.count}</Text>
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
																handleAdjustTrophy(trophy.place, 1)
															}
														>
															<MdAdd />
														</IconButton>

														<IconButton
															aria-label="decrease"
															disabled={isUpdating}
															onClick={() =>
																handleAdjustTrophy(trophy.place, -1)
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

			{!isLoading && trophies.length === 0 && (
				<Box borderWidth="1px" p="8" textAlign="center">
					<Text>No hay medallas 👀</Text>
				</Box>
			)}
		</VStack>
	);
}
