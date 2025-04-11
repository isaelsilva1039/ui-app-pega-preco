import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, IconButton } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';

export default function LocalizacaoScreen() {
  const [raio, setRaio] = useState(50);
  const [localAtual, setLocalAtual] = useState('');
  const [pais, setPais] = useState('Brasil');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');

  const usarLocalizacaoAtual = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const pos = await Location.getCurrentPositionAsync({});
    const [info] = await Location.reverseGeocodeAsync(pos.coords);

    setPais(info.country || 'Brasil');
    setEstado(info.region || '');
    setCidade(info.city || '');
    setLocalAtual(`${info.city} - ${info.region}`);
  };

  useEffect(() => {
    usarLocalizacaoAtual();
  }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Title
          title="DEFINIR LOCALIZAÇÃO"
          subtitle={`Até ${raio} KM`}
          left={() => <IconButton icon="crosshairs-gps" onPress={usarLocalizacaoAtual} />}
          right={() => <IconButton icon="map-marker" />}
        />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.label}>PAÍS</Text>
        <Picker selectedValue={pais} onValueChange={setPais} style={styles.picker}>
          <Picker.Item label="Brasil" value="Brasil" />
          <Picker.Item label="Argentina" value="Argentina" />
        </Picker>

        <Text style={styles.label}>ESTADO</Text>
        <Picker selectedValue={estado} onValueChange={setEstado} style={styles.picker}>
          <Picker.Item label="Maranhão" value="Maranhão" />
          <Picker.Item label="São Paulo" value="São Paulo" />
        </Picker>

        <Text style={styles.label}>CIDADE</Text>
        <Picker selectedValue={cidade} onValueChange={setCidade} style={styles.picker}>
          <Picker.Item label="São Luís" value="São Luís" />
          <Picker.Item label="São Paulo" value="São Paulo" />
        </Picker>

        <Text style={styles.label}>DEFINIR RAIO</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={raio}
          onValueChange={setRaio}
          minimumTrackTintColor="#2196F3"
          maximumTrackTintColor="#000000"
        />
        <Text style={styles.raioText}>{raio} KM</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  headerCard: { marginBottom: 16 },
  card: { padding: 16 },
  label: { fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  picker: {
    backgroundColor: '#e0f0ff',
    borderRadius: 8,
    marginBottom: 8,
  },
  raioText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
  },
});
