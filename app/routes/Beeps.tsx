import React, { useContext } from 'react';
import { Layout, Text, Divider, List, ListItem, Spinner, TopNavigationAction, TopNavigation } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import ProfilePicture from '../components/ProfilePicture';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainNavParamList } from '../navigators/MainTabs';
import { gql, useQuery } from '@apollo/client';
import { GetBeepHistoryQuery, Beep } from '../generated/graphql';
import { UserContext } from '../utils/UserContext';
import { BackIcon } from '../utils/Icons';

interface Props {
  navigation: BottomTabNavigationProp<MainNavParamList>;
}

const GetBeepHistory = gql`
  query GetBeepHistory($id: String) {
    getBeeps(id: $id) {
      items {
        id
        start
        end
        groupSize
        origin
        destination
        rider {
          id
          name
          first
          last
          photoUrl
        }
        beeper {
          id
          name
          first
          last
          photoUrl
        }
      }
      count
    }
  }
`;

export function BeepsScreen(props: Props): JSX.Element {
  const user = useContext(UserContext);
  const { data, loading, error } = useQuery<GetBeepHistoryQuery>(GetBeepHistory, { variables: { id: user.id } });

  const beeps = data?.getBeeps;

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => props.navigation.goBack()} />
  );

  const renderItem = ({ item }: { item: Beep }) => {
    const otherUser = user.id === item.rider.id ? item.beeper : item.rider;
    return (
      <ListItem
        accessoryLeft={() => (
          <ProfilePicture
            size={50}
            url={otherUser.photoUrl || ''}
          />
        )}
        onPress={() => props.navigation.push("Profile", { id: otherUser.id, beep: item.id })}
        title={user.id === item.rider.id ?
          `${otherUser.name} beeped you` : `You beeped ${otherUser.name}`
        }
        description={`Group size: ${item.groupSize}\nOrigin: ${item.origin}\nDestination: ${item.destination}\nDate: ${new Date(item.start)}`}
      />
    );
  };

  const renderBody = () => {
    if (error) return <Text category='h5'>{error.message}</Text>;
    if (loading) {
      return (
        <>
          <Text category='h5'>Loading your history</Text>
          <Spinner />
        </>
      );
    }
    if (beeps && beeps.items.length > 0) {
      return (
        <List
          style={{ width: "100%" }}
          data={beeps.items}
          ItemSeparatorComponent={Divider}
          renderItem={renderItem}
        />
      );
    }
    return (
      <>
        <Text category='h5'>Nothing to display!</Text>
        <Text appearance='hint'>You have no previous beeps to display</Text>
      </>
    );
  };

  return (
    <>
      <TopNavigation
        title='Your Beeps'
        subtitle={`${beeps?.count || 'N/A'} beeps`}
        alignment='center'
        accessoryLeft={BackAction}
      />
      <Layout style={styles.container}>
        {renderBody()}
      </Layout>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: "center",
    justifyContent: 'center'
  }
});
