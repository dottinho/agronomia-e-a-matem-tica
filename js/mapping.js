// Satellite Mapping and Area Delimitation Functions

let map;
let drawingLayer;
let currentPolygon;
let isDrawing = false;
let polygonPoints = [];

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
});

function initializeMap() {
    try {
        // Initialize Leaflet map
        map = L.map('map').setView([-15.7942, -47.8822], 10); // Brasília coordinates as default
        
        // Add satellite tile layer (using OpenStreetMap as fallback)
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 18
        });
        
        // Fallback to OpenStreetMap if satellite fails
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        });
        
        // Try satellite first, fallback to OSM
        satelliteLayer.addTo(map);
        
        // Handle tile loading errors
        satelliteLayer.on('tileerror', function() {
            console.log('Satellite tiles failed, switching to OpenStreetMap');
            map.removeLayer(satelliteLayer);
            osmLayer.addTo(map);
        });
        
        // Initialize drawing layer
        drawingLayer = L.layerGroup().addTo(map);
        
        // Add scale control
        L.control.scale({
            metric: true,
            imperial: false,
            position: 'bottomleft'
        }).addTo(map);
        
        // Add location control
        addLocationControl();
        
        // Add click handler for drawing
        map.on('click', handleMapClick);
        
        console.log('Map initialized successfully');
        
    } catch (error) {
        console.error('Error initializing map:', error);
        document.getElementById('map').innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f5f5f5; color: #666;">
                <div style="text-align: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i><br>
                    Erro ao carregar o mapa. Verifique sua conexão com a internet.
                </div>
            </div>
        `;
    }
}

function addLocationControl() {
    const locationControl = L.control({ position: 'topright' });
    
    locationControl.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'leaflet-control-location');
        div.innerHTML = '<button title="Localizar minha posição"><i class="fas fa-crosshairs"></i></button>';
        
        div.onclick = function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    map.setView([lat, lng], 15);
                    
                    // Add marker for current location
                    L.marker([lat, lng])
                        .addTo(map)
                        .bindPopup('Sua localização atual')
                        .openPopup();
                }, function(error) {
                    showNotification('Não foi possível obter sua localização: ' + error.message, 'error');
                });
            } else {
                showNotification('Geolocalização não é suportada pelo seu navegador', 'error');
            }
        };
        
        return div;
    };
    
    locationControl.addTo(map);
}

function enableDrawing() {
    if (isDrawing) {
        showNotification('Modo de desenho já está ativo. Clique no mapa para adicionar pontos.', 'info');
        return;
    }
    
    isDrawing = true;
    polygonPoints = [];
    
    // Change cursor
    document.getElementById('map').style.cursor = 'crosshair';
    
    showNotification('Modo de desenho ativado. Clique no mapa para delimitar a área. Clique duas vezes para finalizar.', 'info');
    
    // Update button state
    const drawButton = document.querySelector('button[onclick="enableDrawing()"]');
    if (drawButton) {
        drawButton.innerHTML = '<i class="fas fa-stop"></i> Parar Desenho';
        drawButton.onclick = stopDrawing;
    }
}

function stopDrawing() {
    isDrawing = false;
    document.getElementById('map').style.cursor = '';
    
    // Update button state
    const drawButton = document.querySelector('button[onclick="stopDrawing()"]');
    if (drawButton) {
        drawButton.innerHTML = '<i class="fas fa-draw-polygon"></i> Delimitar Área';
        drawButton.onclick = enableDrawing;
    }
    
    showNotification('Modo de desenho desativado', 'info');
}

function handleMapClick(e) {
    if (!isDrawing) return;
    
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
    polygonPoints.push([lat, lng]);
    
    // Add point marker
    const marker = L.circleMarker([lat, lng], {
        radius: 5,
        fillColor: '#ff0000',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(drawingLayer);
    
    // Update polygon if we have more than 2 points
    if (polygonPoints.length > 2) {
        updatePolygon();
    }
    
    // Update coordinates display
    updateCoordinatesDisplay();
    
    showNotification(`Ponto ${polygonPoints.length} adicionado. ${polygonPoints.length < 3 ? 'Adicione mais pontos.' : 'Clique duas vezes para finalizar.'}`, 'info');
}

function updatePolygon() {
    // Remove existing polygon
    if (currentPolygon) {
        drawingLayer.removeLayer(currentPolygon);
    }
    
    // Create new polygon
    currentPolygon = L.polygon(polygonPoints, {
        color: '#2E7D32',
        weight: 3,
        opacity: 0.8,
        fillColor: '#4CAF50',
        fillOpacity: 0.3
    }).addTo(drawingLayer);
    
    // Add double-click handler to finish drawing
    currentPolygon.on('dblclick', function() {
        if (isDrawing) {
            stopDrawing();
            calculatePolygonArea();
        }
    });
}

function clearDrawing() {
    drawingLayer.clearLayers();
    polygonPoints = [];
    currentPolygon = null;
    isDrawing = false;
    
    document.getElementById('map').style.cursor = '';
    document.getElementById('polygon-area').textContent = '0 hectares';
    document.getElementById('coordinates').value = '';
    
    // Reset button
    const drawButton = document.querySelector('button[onclick="stopDrawing()"], button[onclick="enableDrawing()"]');
    if (drawButton) {
        drawButton.innerHTML = '<i class="fas fa-draw-polygon"></i> Delimitar Área';
        drawButton.onclick = enableDrawing;
    }
    
    showNotification('Área delimitada removida', 'info');
}

function calculatePolygonArea() {
    if (!currentPolygon || polygonPoints.length < 3) {
        showNotification('Delimite uma área primeiro com pelo menos 3 pontos', 'error');
        return;
    }
    
    try {
        // Calculate area using Leaflet's built-in method
        const areaM2 = L.GeometryUtil.geodesicArea(polygonPoints);
        const areaHectares = areaM2 / 10000;
        
        // Update display
        document.getElementById('polygon-area').textContent = `${areaHectares.toFixed(4)} hectares`;
        
        // Show detailed information
        const perimeter = calculatePolygonPerimeter(polygonPoints);
        const perimeterKm = perimeter / 1000;
        
        showNotification(`Área calculada: ${areaHectares.toFixed(4)} ha (${formatNumber(Math.round(areaM2))} m²)`, 'success');
        
        // Add popup to polygon with area information
        if (currentPolygon) {
            currentPolygon.bindPopup(`
                <div style="text-align: center;">
                    <strong>Área Delimitada</strong><br>
                    <span style="font-size: 1.2em; color: #2E7D32;">${areaHectares.toFixed(4)} hectares</span><br>
                    <small>${formatNumber(Math.round(areaM2))} m²</small><br>
                    <small>Perímetro: ${perimeterKm.toFixed(2)} km</small>
                </div>
            `).openPopup();
        }
        
    } catch (error) {
        console.error('Error calculating area:', error);
        showNotification('Erro ao calcular a área. Tente novamente.', 'error');
    }
}

function calculatePolygonPerimeter(points) {
    if (points.length < 2) return 0;
    
    let perimeter = 0;
    for (let i = 0; i < points.length; i++) {
        const point1 = points[i];
        const point2 = points[(i + 1) % points.length];
        perimeter += calculateDistance(point1[0], point1[1], point2[0], point2[1]);
    }
    
    return perimeter;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function updateCoordinatesDisplay() {
    const coordinates = polygonPoints.map((point, index) => 
        `Ponto ${index + 1}: ${point[0].toFixed(6)}, ${point[1].toFixed(6)}`
    ).join('\n');
    
    document.getElementById('coordinates').value = coordinates;
}

function exportCoordinates() {
    if (polygonPoints.length === 0) {
        showNotification('Nenhuma área delimitada para exportar', 'error');
        return;
    }
    
    try {
        // Create export data
        const exportData = {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [polygonPoints.map(point => [point[1], point[0]])] // GeoJSON uses [lng, lat]
            },
            properties: {
                name: 'Área Agrícola Delimitada',
                area_hectares: (L.GeometryUtil.geodesicArea(polygonPoints) / 10000).toFixed(4),
                created: new Date().toISOString(),
                coordinates_count: polygonPoints.length
            }
        };
        
        // Create downloadable file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `area_agricola_${new Date().toISOString().split('T')[0]}.geojson`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Coordenadas exportadas com sucesso!', 'success');
        
    } catch (error) {
        console.error('Error exporting coordinates:', error);
        showNotification('Erro ao exportar coordenadas', 'error');
    }
}

// Search location functionality
function searchLocation(query) {
    if (!query || query.trim() === '') {
        showNotification('Digite um local para buscar', 'error');
        return;
    }
    
    // Simple geocoding using Nominatim (OpenStreetMap)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=br`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);
                
                map.setView([lat, lng], 15);
                
                // Add marker
                L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup(`<strong>${result.display_name}</strong>`)
                    .openPopup();
                
                showNotification(`Local encontrado: ${result.display_name}`, 'success');
            } else {
                showNotification('Local não encontrado. Tente ser mais específico.', 'error');
            }
        })
        .catch(error => {
            console.error('Geocoding error:', error);
            showNotification('Erro ao buscar localização', 'error');
        });
}

// Add search control to map
function addSearchControl() {
    const searchControl = L.control({ position: 'topleft' });
    
    searchControl.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'leaflet-control-search');
        div.innerHTML = `
            <input type="text" placeholder="Buscar localização..." id="location-search">
            <button onclick="searchLocation(document.getElementById('location-search').value)">
                <i class="fas fa-search"></i>
            </button>
        `;
        
        // Prevent map interaction when typing
        L.DomEvent.disableClickPropagation(div);
        
        // Add enter key handler
        const input = div.querySelector('input');
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchLocation(this.value);
            }
        });
        
        return div;
    };
    
    searchControl.addTo(map);
}

// Initialize search control when map is ready
if (typeof map !== 'undefined') {
    addSearchControl();
}

// Export functions for global access
window.enableDrawing = enableDrawing;
window.clearDrawing = clearDrawing;
window.calculatePolygonArea = calculatePolygonArea;
window.exportCoordinates = exportCoordinates;
window.searchLocation = searchLocation;

