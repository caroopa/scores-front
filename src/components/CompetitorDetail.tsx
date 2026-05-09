import { Badge, Text, VStack } from "@chakra-ui/react";
import type { General, CompetitorScore } from "../types/domain";

type CompetitorDetailProps = {
	competitor: General | CompetitorScore;
};

export default function CompetitorDetail({
	competitor,
}: CompetitorDetailProps) {
	const hasGenre = "genre" in competitor;

	return (
		<VStack align="start" gap="3">
			<Text fontWeight="bold" fontSize="lg">
				{competitor.name}
			</Text>

			<Badge colorPalette="purple">{competitor.belt}</Badge>

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
