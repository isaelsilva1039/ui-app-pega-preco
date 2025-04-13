export interface Estado {
    id: number;
    nome: string;
    sigla: string;
  }
  
  export interface Cidade {
    id: number;
    nome: string;
  }
  
  export interface Coordenadas {
    lat: number;
    lon: number;
  }
  
  export async function buscarEstados(): Promise<Estado[]> {
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    return response.json();
  }
  
  export async function buscarCidades(estadoSigla: string): Promise<Cidade[]> {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSigla}/municipios`);
    return response.json();
  }
  
  export async function buscarCoordenadasCidade(estado: string, cidade: string): Promise<Coordenadas | null> {
    const query = `${cidade}, ${estado}, Brasil`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
      return null;
    }
  }
  