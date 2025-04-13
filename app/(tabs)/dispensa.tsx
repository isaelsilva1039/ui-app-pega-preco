import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text as RNText, ScrollView } from 'react-native';
import { Text, IconButton, Button, Menu, Provider, Checkbox } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import HeaderUserInfo from '@/components/HeaderUserInfo';
import { buscarEstados, buscarCidades, buscarCoordenadasCidade } from '../../src/services/localizacaoService';

interface Estado {
  id: number;
  nome: string;
  sigla: string;
}

interface Cidade {
  id: number;
  nome: string;
}

interface Coordenadas {
  lat: number;
  lon: number;
}

export default function DispensaScreen(): JSX.Element {
  const [raio, setRaio] = useState<number>(50);
  const [estado, setEstado] = useState<string>('');
  const [cidade, setCidade] = useState<string>('');
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [coordenadas, setCoordenadas] = useState<Coordenadas | null>(null);
  const [semRaio, setSemRaio] = useState<boolean>(false);

  const [menuEstadoVisible, setMenuEstadoVisible] = useState<boolean>(false);
  const [menuCidadeVisible, setMenuCidadeVisible] = useState<boolean>(false);

  useEffect(() => {
    buscarEstados().then((data: Estado[]) => {
      setEstados(data.sort((a, b) => a.nome.localeCompare(b.nome)));
    });
  }, []);

  useEffect(() => {
    if (estado) {
      buscarCidades(estado).then((data: Cidade[]) => {
        setCidades(data.sort((a, b) => a.nome.localeCompare(b.nome)));
      });
    }
  }, [estado]);

  useEffect(() => {
    if (estado && cidade) {
      buscarCoordenadasCidade(estado, cidade).then((coord: Coordenadas | null) => {
        if (coord) setCoordenadas(coord);
      });
    }
  }, [estado, cidade]);

  const usarLocalizacaoAtual = async (): Promise<void> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const pos = await Location.getCurrentPositionAsync({});
    const [info] = await Location.reverseGeocodeAsync(pos.coords);

    const estadoCorrespondente = estados.find(
      (e) => e.nome.toLowerCase() === info.region?.toLowerCase()
    );
    if (estadoCorrespondente) {
      setEstado(estadoCorrespondente.sigla);
    }
    if (info.city) {
      setCidade(info.city);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>



        <View style={styles.localizacaoBox}>

          <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', marginTop: -40 }}>
          <IconButton icon="crosshairs-gps" size={30} onPress={usarLocalizacaoAtual} />
          <View style={{ flex: 1 , marginTop: -10 }}>
            <Text style={styles.localizacaoTitle}>DEFINIR LOCALIZAÇÃO</Text>
            <Text style={styles.localizacaoSubtitle}>Até {semRaio ? '∞' : `${raio} KM`}</Text>
          </View>
          <IconButton icon="map-marker" size={30} />
          </View>
        </View>

        <View style={styles.contentBox}>
          <Text style={styles.label}>PAÍS</Text>
          <Button disabled mode="outlined" style={[styles.menuButton, styles.menuButtonActive]} labelStyle={styles.menuButtonLabel}>Brasil</Button>

          <Text style={styles.label}>ESTADO</Text>
          <Menu
            visible={menuEstadoVisible}
            onDismiss={() => setMenuEstadoVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuEstadoVisible(true)}
                style={[styles.menuButton, styles.menuButtonActive]}
                labelStyle={styles.menuButtonLabel}
              >
                {estado ? estados.find((e) => e.sigla === estado)?.nome : 'Selecione o estado'}
              </Button>
            }
          >
            <ScrollView style={{ maxHeight: 300 }}>
              {estados.map((e) => (
                <Menu.Item
                  key={e.id}
                  onPress={() => {
                    setEstado(e.sigla);
                    setCidade('');
                    setMenuEstadoVisible(false);
                  }}
                  title={e.nome}
                />
              ))}
            </ScrollView>
          </Menu>

          <Text style={styles.label}>CIDADE</Text>
          <Menu
            visible={menuCidadeVisible}
            onDismiss={() => setMenuCidadeVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuCidadeVisible(true)}
                style={[styles.menuButton, styles.menuButtonActive]}
                labelStyle={styles.menuButtonLabel}
                disabled={!estado}
              >
                {cidade || 'Selecione a cidade'}
              </Button>
            }
          >
            <ScrollView style={{ maxHeight: 300 }}>
              {cidades.map((c) => (
                <Menu.Item
                  key={c.id}
                  onPress={() => {
                    setCidade(c.nome);
                    setMenuCidadeVisible(false);
                  }}
                  title={c.nome}
                />
              ))}
            </ScrollView>
          </Menu>

          <View style={styles.raioContainerCheckbox }>
            <Checkbox.Android
              status={semRaio ? 'checked' : 'unchecked'}
              onPress={() => setSemRaio(!semRaio)}
              uncheckedColor="#0070C0"
              color="#0070C0"
            />
            <Text style={[styles.label, { marginTop: 4}]}>Não definir o raio</Text>
          </View>

          <View style={styles.sliderBox}>
            <View style={styles.triangulo} />
            <Slider
              style={{ flex: 1 }}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={raio}
              onValueChange={(value: number) => setRaio(value)}
              minimumTrackTintColor="#1E88E5"
              maximumTrackTintColor="#888"
              disabled={semRaio}
            />
          </View>

          {!semRaio && <RNText style={styles.raioTexto}>{raio} KM</RNText>}
        </View>

      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // height: 40,
    // padding: 10,
    // paddingTop: 30,
    backgroundColor: '#F2F4F7', // tom de cinza claro para contraste
  },
  localizacaoBox: {
    height: 290,
    flexDirection: 'row',
    alignItems: 'center',
    
    // flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0070C0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  localizacaoTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  localizacaoSubtitle: {
    color: '#D0E6FF',
    fontSize: 13,
    marginTop: 2,
  },
  contentBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    width: '92%',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    marginTop: -120,
    shadowOffset: { width: 2, height: 2 },
  },
  label: {
    fontWeight: '600',
    color: '#0D3D56',
    marginBottom: 6,
    marginTop: 16,
    fontSize: 14,
  },
  menuButton: {
    justifyContent: 'flex-start',
    marginBottom: 12,
    borderColor: '#0070C0',
    color: '#07587D',
    // backgroundColor:'#000000',
    // borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 6,
  },
  botaoIcone: {
    backgroundColor: '#07587D',
    marginRight: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  raioContainer : {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  raioContainerCheckbox : {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  sliderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  triangulo: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderRightWidth: 18,
    borderRightColor: '#07587D',
    marginRight: 10,
  },
  raioTexto: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#0D3D56',
    marginTop: -8,
  },
  menuButtonLabel: {
    color: '#000', // cor preta para o texto selecionado
    textAlign: 'left',
    fontSize: 14,
  },
  menuButtonActive: {
    borderColor: '#D0D5DD', // cinza claro para a borda
    backgroundColor: '#fff',
  },
  
});