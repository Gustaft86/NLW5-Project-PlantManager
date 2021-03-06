import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { PlantProps, loadPlant, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';

import { Header } from '../component/Header';
import { PlantCardSecundary } from '../component/PlantCardSecundary';
import { Load } from '../component/Load';

import waterdrop from '../assets/waterdrop.png';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();

  function handleRemove(plant: PlantProps) {
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
      {
        text: 'Não 🙏',
        style: 'cancel',
      },
      {
        text: 'Sim 😢',
        onPress: async () => {
          try {
            // const data = await AsyncStorage.getItem('@plantmanager:plants');
            // const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

            // delete plants[plant.id];
            
            // await AsyncStorage.setItem(
            //   '@plantmanager:plants',
            //   JSON.stringify(plants)
            // );

            await removePlant(plant.id);

            setMyPlants((oldData) => (
              oldData.filter((item) => item.id !== plant.id)
            ));

          } catch (error) {
            Alert.alert('Não foi possível remover! 😢')
          }
        }
      }
    ]);
  }

  function handleDone(plant: PlantProps) {
    // Criar logica para salvar quantidades de regadas por planta.
  }

  useEffect(() => {
    async function loadStorageData() {
      const plantsStoraged = await loadPlant();
      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: pt }
      );

      setNextWatered(
        `Não esqueça de regar a ${ plantsStoraged[0].name } à ${ nextTime }.`
      )   

      setMyPlants(plantsStoraged);
      setLoading(false);
    }
    loadStorageData();
  }, [])

  if (loading) {
    return <Load />
  }

  return (
    <View style={ styles.container }>
      <Header />

      <View style={ styles.spotlight }>
        <Image
          source={ waterdrop }
          style={ styles.spotlightImage }
        />

        <Text style={ styles.spotlightText }>
          { nextWatered }
        </Text>
      </View>

      <View style={ styles.plants }>
        <Text style={ styles.plantsTitle }>
          Próximos regadas
        </Text>

        <FlatList
          data={myPlants}
          keyExtractor={ (item) => String(item.id) }
          renderItem={ ({ item }) => (
            <PlantCardSecundary
              data={item}
              handleRemove={() => handleRemove(item)}
              handleDone={() => handleDone(item)}
            />
          )}
          showsVerticalScrollIndicator={ false }
          contentContainerStyle={ { flex: 1} }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  plants: {
    flex: 1,
    width: '100%',
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 10,
  }
});