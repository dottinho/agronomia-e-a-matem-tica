# AgroTech - Site de Agronomia

Um site completo para facilitar o acesso entre o agricultor e a área de cultivo, com ferramentas avançadas de cálculo matemático e mapeamento por satélite.

## 🌱 Funcionalidades

### Calculadora Agrícola
- **Cálculo de Área**: Suporte para terrenos retangulares, circulares e triangulares
- **Cálculo de Sementes**: Estimativa baseada no tipo de cultura e espaçamento
- **Cálculo de Fertilizantes**: Recomendações NPK personalizadas
- **Cálculo de Irrigação**: Necessidades hídricas baseadas em evapotranspiração

### Mapeamento por Satélite
- **Visualização Satelital**: Imagens de alta resolução via ArcGIS
- **Delimitação de Terreno**: Ferramenta interativa para marcar áreas
- **Cálculo Automático**: Área em hectares e metros quadrados
- **Exportação de Dados**: Coordenadas em formato GeoJSON

### Recursos Adicionais
- **Design Responsivo**: Compatível com desktop e mobile
- **Interface Moderna**: Design clean e profissional
- **Animações Suaves**: Transições e micro-interações
- **Geolocalização**: Localização automática do usuário

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Flexbox, Grid, animações
- **JavaScript ES6+**: Funcionalidades interativas

### Bibliotecas
- **Leaflet.js**: Mapas interativos
- **Font Awesome**: Ícones vetoriais
- **ArcGIS**: Imagens de satélite

### APIs
- **Nominatim**: Geocodificação
- **Geolocation API**: Localização do usuário

## 📁 Estrutura do Projeto

```
site-agronomia/
├── index.html              # Página principal
├── css/
│   └── style.css           # Estilos principais
├── js/
│   ├── main.js            # Funcionalidades gerais
│   ├── calculator.js      # Cálculos matemáticos
│   └── mapping.js         # Mapeamento e GIS
├── images/
│   ├── zDEHUzHSdgyd.jpg   # Imagem hero
│   └── ...                # Outras imagens
└── README.md              # Documentação
```

## 🧮 Cálculos Matemáticos Implementados

### 1. Área de Plantio
- **Retangular**: A = comprimento × largura
- **Circular**: A = π × raio²
- **Triangular**: A = (base × altura) ÷ 2

### 2. Densidade de Plantio
```javascript
plantsPerM2 = 1 / (rowSpacing × plantSpacing)
totalPlants = plantsPerM2 × area
seedsNeeded = totalPlants / (germination / 100)
```

### 3. Fertilização NPK
```javascript
totalN = nitrogen_per_ha × area_ha
totalP = phosphorus_per_ha × area_ha
totalK = potassium_per_ha × area_ha
```

### 4. Irrigação
```javascript
netIrrigation = evapotranspiration - precipitation
grossIrrigation = netIrrigation / (efficiency / 100)
dailyVolume = (grossIrrigation / 1000) × area_m2 × 1000
```

### 5. Área de Polígono (Coordenadas GPS)
Utiliza o algoritmo de Shoelace para calcular área geodésica:
```javascript
area = L.GeometryUtil.geodesicArea(polygonPoints)
```

## 🌍 Funcionalidades de Mapeamento

### Delimitação de Terreno
1. **Ativar Modo de Desenho**: Clique em "Delimitar Área"
2. **Marcar Pontos**: Clique no mapa para adicionar vértices
3. **Finalizar**: Duplo clique ou botão "Parar Desenho"
4. **Calcular**: Área automática em hectares

### Exportação de Dados
- **Formato**: GeoJSON padrão
- **Coordenadas**: Latitude/Longitude (WGS84)
- **Metadados**: Área, data de criação, número de pontos

### Geolocalização
- **Localização Automática**: GPS do dispositivo
- **Busca por Endereço**: Geocodificação via Nominatim
- **Marcadores**: Pontos de interesse no mapa

## 📱 Responsividade

### Breakpoints
- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: < 480px

### Adaptações Mobile
- Menu hambúrguer
- Botões touch-friendly
- Formulários otimizados
- Mapas responsivos

## 🎨 Design System

### Paleta de Cores
- **Verde Principal**: #2E7D32 (agricultura/natureza)
- **Verde Claro**: #4CAF50
- **Azul**: #1976D2 (tecnologia)
- **Marrom Terra**: #5D4037
- **Cinza**: #757575

### Tipografia
- **Títulos**: Roboto Bold
- **Texto**: Roboto Regular
- **Dados**: Courier New (monospace)

## 🚀 Como Usar

### 1. Abrir o Site
Abra o arquivo `index.html` em qualquer navegador moderno.

### 2. Calculadora Agrícola
1. Navegue até a seção "Calculadora"
2. Escolha o tipo de cálculo (Área, Sementes, Fertilizantes, Irrigação)
3. Preencha os campos necessários
4. Clique em "Calcular" para ver os resultados

### 3. Mapeamento por Satélite
1. Vá para a seção "Mapeamento"
2. Use os controles para navegar no mapa
3. Clique em "Delimitar Área" para marcar seu terreno
4. Clique nos pontos do perímetro da sua propriedade
5. Finalize e veja a área calculada automaticamente

### 4. Exportar Dados
1. Após delimitar uma área, clique em "Exportar Coordenadas"
2. Um arquivo GeoJSON será baixado com as coordenadas
3. Use este arquivo em outros softwares GIS

## 🔧 Configurações Avançadas

### Personalizar Culturas
Edite o arquivo `js/calculator.js` na função `getCropData()`:
```javascript
const cropDatabase = {
    nova_cultura: {
        germination: 85,      // Taxa de germinação (%)
        seedWeight: 0.3,      // Peso por semente (g)
        pricePerKg: 25.00     // Preço por kg (R$)
    }
};
```

### Adicionar Camadas de Mapa
No arquivo `js/mapping.js`, adicione novos provedores:
```javascript
const novaLayer = L.tileLayer('URL_DO_PROVEDOR', {
    attribution: 'Atribuição',
    maxZoom: 18
});
```

## 📊 Dados de Referência

### Culturas Suportadas
| Cultura | Germinação | Peso/Semente | Preço/kg |
|---------|------------|--------------|----------|
| Milho   | 85%        | 0.3g         | R$ 25.00 |
| Soja    | 80%        | 0.15g        | R$ 18.00 |
| Feijão  | 75%        | 0.4g         | R$ 12.00 |
| Arroz   | 85%        | 0.025g       | R$ 8.00  |
| Trigo   | 90%        | 0.04g        | R$ 15.00 |

### Formulações NPK
| Formulação | N-P-K | Preço/kg |
|------------|-------|----------|
| NPK 20-10-20 | 20-10-20 | R$ 2.80 |
| NPK 10-10-10 | 10-10-10 | R$ 2.20 |
| Ureia | 45-00-00 | R$ 2.50 |
| Superfosfato | 00-18-00 | R$ 1.80 |
| Cloreto K | 00-00-60 | R$ 2.00 |

## 🌐 Compatibilidade

### Navegadores Suportados
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Recursos Necessários
- JavaScript habilitado
- Conexão com internet (para mapas)
- Geolocalização (opcional)

## 📈 Futuras Melhorias

### Funcionalidades Planejadas
- [ ] Integração com dados meteorológicos
- [ ] Análise de solo por imagem
- [ ] Histórico de cultivos
- [ ] Relatórios em PDF
- [ ] API para integração externa
- [ ] Modo offline para cálculos

### Melhorias Técnicas
- [ ] PWA (Progressive Web App)
- [ ] Cache de mapas offline
- [ ] Compressão de imagens
- [ ] Otimização de performance

## 📞 Suporte

Para dúvidas ou sugestões:
- **Email**: contato@agrotech.com.br
- **Telefone**: (11) 9999-9999

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

**AgroTech** - Tecnologia que conecta o agricultor ao campo 🌱

