import React from "react";
import { Box } from "@chakra-ui/react";
import { GetBeepersQuery } from "../../../generated/graphql";
import { Marker } from "../../../components/Marker";
import { Map } from "../../../components/Map";

interface Props {
  beepers: GetBeepersQuery['getBeepers'];
}

export function BeepersMap(props: Props) {
  const { beepers } = props;

  return (
    <Box mb={4} mt={4} height={450} width='100%'>
      <Map
        initialViewState={{
          latitude: 36.215735,
          longitude: -81.674205,
          zoom: 12,
        }}
      >
        {beepers?.map((beeper) => (
          <Marker
            key={beeper.id}
            latitude={beeper.location?.latitude || 0}
            longitude={beeper.location?.longitude || 0}
            userId={beeper.id}
            photo={beeper.photo}
            name={beeper.name}
            username={beeper.username}
            variant='queue'
          />
        ))}
      </Map>
    </Box>
  );
}