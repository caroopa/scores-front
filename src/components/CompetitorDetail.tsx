import { HStack, Text, VStack } from "@chakra-ui/react";
import type { General, CompetitorScore } from "../types/domain";
import BeltBadge from "./BeltBadge";

type CompetitorDetailProps = {
	competitor: General | CompetitorScore;
};

export default function CompetitorDetail({
	competitor,
}: CompetitorDetailProps) {
	const hasGenre = "genre" in competitor;

	return (
		<VStack align="start" gap="3">
			<HStack w="100%" justify="space-between">
				<Text fontWeight="bold" fontSize="lg">
					{competitor.name}
				</Text>

				<BeltBadge belt={competitor.belt} />
			</HStack>

			<Text>
				<strong>Edad:</strong> {competitor.age}
			</Text>

			{hasGenre && (
				<Text>
					<strong>Género:</strong> {competitor.genre}
				</Text>
			)}

			<Text>
				<strong>Escuela:</strong> {competitor.school}
			</Text>

			<Text>
				<strong>Instructor:</strong> {competitor.instructor}
			</Text>
		</VStack>
	);
}
