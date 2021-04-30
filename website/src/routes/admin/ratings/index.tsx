import React, { useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Card } from '../../../components/Card';
import Pagination from '../../../components/Pagination';
import {gql, useQuery} from '@apollo/client';
import {GetRatingsQuery} from '../../../generated/graphql';
import {Heading, Table, Tbody, Td, Th, Thead, Tr} from '@chakra-ui/react';

dayjs.extend(relativeTime);

const RatesGraphQL = gql`
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
                    photoUrl
                    username
                }
                rated {
                    id
                    name
                    photoUrl
                    username
                }
            }
            count
        }
    }
`;


export function printStars(rating: number): string {
    let stars = "";

    for (let i = 0; i < rating; i++){
        stars += "⭐️";
    }

    return stars;
}

function Ratings() {
    const { data, refetch } = useQuery<GetRatingsQuery>(RatesGraphQL, { variables: { offset: 0, show: 25 }});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageLimit = 25;

    async function fetchRatings(page: number) {
        refetch({ 
            offset: page
        });
    }

    return <>
        <Heading>Ratings</Heading>

        <Pagination
            resultCount={data?.getRatings.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchRatings}/>

        <Card>
            <Table>
                <Thead>
                    <Th>Rater</Th>
                    <Th>Rated</Th>
                    <Th>Message</Th>
                    <Th>Stars</Th>
                    <Th>Date</Th>
                </Thead>
                <Tbody>
                    {data?.getRatings && (data.getRatings.items).map(rate => {
                        return (
                            <Tr key={rate.id}>
                                <Td>
                                    {rate.rater.name}
                                </Td>
                                <Td>
                                    {rate.rated.name}
                                </Td>
                                <Td>{rate.message}</Td>
                                <Td>{printStars(rate.stars)}</Td>
                                <Td>{dayjs().to(rate.timestamp)}</Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </Card>

        <Pagination
            resultCount={data?.getRatings.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchRatings}/>
    </>;
}

export default Ratings;
