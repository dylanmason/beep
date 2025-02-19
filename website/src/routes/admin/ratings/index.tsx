import React from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Pagination } from '../../../components/Pagination';
import { gql, useQuery } from '@apollo/client';
import { GetRatingsQuery } from '../../../generated/graphql';
import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { TdUser } from '../../../components/TdUser';
import { NavLink, useSearchParams } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Loading } from '../../../components/Loading';
import { Error } from '../../../components/Error';

dayjs.extend(relativeTime);

export const RatesGraphQL = gql`
  query getRatings($show: Int, $offset: Int) {
    getRatings(show: $show, offset: $offset) {
      items {
        id
        timestamp
        message
        stars
        rater {
          id
          name
          photo
          username
        }
        rated {
          id
          name
          photo
          username
        }
      }
      count
    }
  }
`;

export function printStars(rating: number): string {
  let stars = "";

  for (let i = 0; i < rating; i++) {
    stars += "⭐️";
  }

  return stars;
}

export function Ratings() {
  const pageLimit = 20;
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.has('page') ? Number(searchParams.get('page')) : 1;

  const { data, loading, error } = useQuery<GetRatingsQuery>(RatesGraphQL, {
    variables: {
      offset: (page - 1) * pageLimit,
      show: pageLimit
    }
  });

  const setCurrentPage = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  if (error) {
    return <Error error={error} />;
  }

  return (
    <Box>
      <Heading>Ratings</Heading>
      <Pagination
        resultCount={data?.getRatings.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr>
              <Th>Rater</Th>
              <Th>Rated</Th>
              <Th>Message</Th>
              <Th>Stars</Th>
              <Th>Date</Th>
              <Th> </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.getRatings && (data.getRatings.items).map(rating => (
              <Tr key={rating.id}>
                <TdUser user={rating.rater} />
                <TdUser user={rating.rated} />
                <Td>{rating.message || "N/A"}</Td>
                <Td>{printStars(rating.stars)}</Td>
                <Td>{dayjs().to(rating.timestamp)}</Td>
                <Td>
                  <NavLink to={`/admin/ratings/${rating.id}`}>
                    <ExternalLinkIcon />
                  </NavLink>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {loading && <Loading />}
      <Pagination
        resultCount={data?.getRatings.count}
        limit={pageLimit}
        currentPage={page}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}