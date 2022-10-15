import { fetchPublications } from "@/fetch/fetchData";
import { Box, Container, Image, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { DateTime } from "luxon";

interface Props {
  condition: string;
  color: string;
}

const LensPost = ({ condition, color }: Props) => {
  const [publicationData, setPublicationData] = useState([]);
  useEffect(() => {
    const searchPublications = async () => {
      const response = await fetchPublications(condition);
      setPublicationData(response?.data.search.items);
    };
    searchPublications();
  }, [condition]);
  return (
    <Container w='100%' centerContent>
      {publicationData && (
        <SimpleGrid columns={1}>
          {publicationData.map((data) => {
            const { createdAt, metadata, profile, stats, id } = data;
            const dt = DateTime.fromISO(createdAt);

            return (
              <Box display='flex' key={id}>
                <Card
                  date={dt.toFormat("yyyy-MM-dd HH:mm:ss")}
                  picture={profile.coverPicture?.original.url}
                  summary={metadata.content}
                  ne={metadata.description}
                  color={color}
                />
              </Box>
            );
          })}
        </SimpleGrid>
      )}
    </Container>
  );
};

export default LensPost;
