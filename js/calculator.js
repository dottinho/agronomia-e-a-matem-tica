// Agricultural Calculator Functions

// Area calculation functions
function calculateArea() {
    const areaType = document.getElementById('area-type').value;
    let area = 0;
    let resultText = '';
    
    try {
        switch (areaType) {
            case 'rectangular':
                area = calculateRectangularArea();
                break;
            case 'circular':
                area = calculateCircularArea();
                break;
            case 'triangular':
                area = calculateTriangularArea();
                break;
            default:
                throw new Error('Tipo de área não reconhecido');
        }
        
        if (area > 0) {
            const hectares = convertToHectares(area);
            resultText = `
                <div class="result-value">${formatNumber(area.toFixed(2))} m²</div>
                <div class="result-unit">${hectares.toFixed(4)} hectares</div>
                <div style="margin-top: 1rem; padding: 1rem; background: #e8f5e8; border-radius: 8px;">
                    <strong>Informações adicionais:</strong><br>
                    • Perímetro estimado: ${calculatePerimeter(areaType, area).toFixed(2)} m<br>
                    • Equivalente a ${(hectares * 2.47).toFixed(2)} acres<br>
                    • Equivalente a ${(area / 1000000).toFixed(6)} km²
                </div>
            `;
        } else {
            throw new Error('Área calculada inválida');
        }
    } catch (error) {
        resultText = `<div style="color: #f44336;">Erro: ${error.message}</div>`;
    }
    
    document.getElementById('area-result').innerHTML = resultText;
}

function calculateRectangularArea() {
    const length = validateNumericInput(document.getElementById('length').value, 0.1);
    const width = validateNumericInput(document.getElementById('width').value, 0.1);
    
    if (!length || !width) {
        throw new Error('Por favor, insira valores válidos para comprimento e largura');
    }
    
    return length * width;
}

function calculateCircularArea() {
    const radius = validateNumericInput(document.getElementById('radius').value, 0.1);
    
    if (!radius) {
        throw new Error('Por favor, insira um valor válido para o raio');
    }
    
    return Math.PI * radius * radius;
}

function calculateTriangularArea() {
    const base = validateNumericInput(document.getElementById('base').value, 0.1);
    const height = validateNumericInput(document.getElementById('height').value, 0.1);
    
    if (!base || !height) {
        throw new Error('Por favor, insira valores válidos para base e altura');
    }
    
    return (base * height) / 2;
}

function calculatePerimeter(areaType, area) {
    switch (areaType) {
        case 'rectangular':
            const length = parseFloat(document.getElementById('length').value);
            const width = parseFloat(document.getElementById('width').value);
            return 2 * (length + width);
        case 'circular':
            const radius = parseFloat(document.getElementById('radius').value);
            return 2 * Math.PI * radius;
        case 'triangular':
            // Approximation for equilateral triangle
            const side = Math.sqrt(area * 4 / Math.sqrt(3));
            return 3 * side;
        default:
            return 0;
    }
}

// Seeds calculation
function calculateSeeds() {
    try {
        const area = validateNumericInput(document.getElementById('seeds-area').value, 0.01);
        const cropType = document.getElementById('crop-type').value;
        const rowSpacing = validateNumericInput(document.getElementById('row-spacing').value, 1);
        const plantSpacing = validateNumericInput(document.getElementById('plant-spacing').value, 1);
        
        if (!area || !rowSpacing || !plantSpacing) {
            throw new Error('Por favor, preencha todos os campos com valores válidos');
        }
        
        // Convert area to square meters
        const areaM2 = convertToSquareMeters(area);
        
        // Convert spacing from cm to m
        const rowSpacingM = rowSpacing / 100;
        const plantSpacingM = plantSpacing / 100;
        
        // Calculate plants per square meter
        const plantsPerM2 = 1 / (rowSpacingM * plantSpacingM);
        
        // Total plants needed
        const totalPlants = Math.ceil(plantsPerM2 * areaM2);
        
        // Get crop-specific data
        const cropData = getCropData(cropType);
        
        // Calculate seeds needed (considering germination rate)
        const seedsNeeded = Math.ceil(totalPlants / (cropData.germination / 100));
        
        // Calculate weight
        const weightKg = (seedsNeeded * cropData.seedWeight) / 1000;
        
        const resultText = `
            <div class="result-value">${formatNumber(seedsNeeded)} sementes</div>
            <div class="result-unit">${weightKg.toFixed(2)} kg</div>
            <div style="margin-top: 1rem; padding: 1rem; background: #e8f5e8; border-radius: 8px;">
                <strong>Detalhes do plantio:</strong><br>
                • Plantas por m²: ${plantsPerM2.toFixed(1)}<br>
                • Total de plantas: ${formatNumber(totalPlants)}<br>
                • Taxa de germinação: ${cropData.germination}%<br>
                • Peso médio por semente: ${cropData.seedWeight}g<br>
                • Custo estimado: R$ ${(weightKg * cropData.pricePerKg).toFixed(2)}
            </div>
        `;
        
        document.getElementById('seeds-result').innerHTML = resultText;
    } catch (error) {
        document.getElementById('seeds-result').innerHTML = `<div style="color: #f44336;">Erro: ${error.message}</div>`;
    }
}

function getCropData(cropType) {
    const cropDatabase = {
        milho: {
            germination: 85,
            seedWeight: 0.3, // grams
            pricePerKg: 25.00
        },
        soja: {
            germination: 80,
            seedWeight: 0.15,
            pricePerKg: 18.00
        },
        feijao: {
            germination: 75,
            seedWeight: 0.4,
            pricePerKg: 12.00
        },
        arroz: {
            germination: 85,
            seedWeight: 0.025,
            pricePerKg: 8.00
        },
        trigo: {
            germination: 90,
            seedWeight: 0.04,
            pricePerKg: 15.00
        }
    };
    
    return cropDatabase[cropType] || cropDatabase.milho;
}

// Fertilizer calculation
function calculateFertilizer() {
    try {
        const area = validateNumericInput(document.getElementById('fert-area').value, 0.01);
        const nitrogen = validateNumericInput(document.getElementById('nitrogen').value, 0);
        const phosphorus = validateNumericInput(document.getElementById('phosphorus').value, 0);
        const potassium = validateNumericInput(document.getElementById('potassium').value, 0);
        
        if (!area || nitrogen === false || phosphorus === false || potassium === false) {
            throw new Error('Por favor, preencha todos os campos com valores válidos');
        }
        
        // Calculate total nutrients needed
        const totalN = nitrogen * area;
        const totalP = phosphorus * area;
        const totalK = potassium * area;
        
        // Calculate fertilizer formulations
        const npkFormulations = calculateNPKFormulations(totalN, totalP, totalK);
        
        // Calculate costs
        const totalCost = calculateFertilizerCost(npkFormulations);
        
        const resultText = `
            <div class="result-value">NPK Total: ${(totalN + totalP + totalK).toFixed(1)} kg</div>
            <div class="result-unit">Custo estimado: R$ ${totalCost.toFixed(2)}</div>
            <div style="margin-top: 1rem; padding: 1rem; background: #e8f5e8; border-radius: 8px;">
                <strong>Nutrientes necessários:</strong><br>
                • Nitrogênio (N): ${totalN.toFixed(1)} kg<br>
                • Fósforo (P₂O₅): ${totalP.toFixed(1)} kg<br>
                • Potássio (K₂O): ${totalK.toFixed(1)} kg<br><br>
                <strong>Formulações sugeridas:</strong><br>
                ${npkFormulations.map(f => `• ${f.name}: ${f.quantity.toFixed(1)} kg - R$ ${f.cost.toFixed(2)}`).join('<br>')}
            </div>
        `;
        
        document.getElementById('fertilizer-result').innerHTML = resultText;
    } catch (error) {
        document.getElementById('fertilizer-result').innerHTML = `<div style="color: #f44336;">Erro: ${error.message}</div>`;
    }
}

function calculateNPKFormulations(totalN, totalP, totalK) {
    const formulations = [
        { name: 'NPK 20-10-20', n: 20, p: 10, k: 20, price: 2.80 },
        { name: 'NPK 10-10-10', n: 10, p: 10, k: 10, price: 2.20 },
        { name: 'Ureia (45-00-00)', n: 45, p: 0, k: 0, price: 2.50 },
        { name: 'Superfosfato (00-18-00)', n: 0, p: 18, k: 0, price: 1.80 },
        { name: 'Cloreto de Potássio (00-00-60)', n: 0, p: 0, k: 60, price: 2.00 }
    ];
    
    const recommendations = [];
    
    // Calculate for balanced NPK
    const maxNutrient = Math.max(totalN, totalP, totalK);
    const balancedFormulation = formulations[0]; // NPK 20-10-20
    const quantity = maxNutrient / Math.max(balancedFormulation.n, balancedFormulation.p, balancedFormulation.k) * 100;
    
    recommendations.push({
        name: balancedFormulation.name,
        quantity: quantity,
        cost: quantity * balancedFormulation.price
    });
    
    // Calculate individual nutrients if needed
    if (totalN > 0) {
        const ureaQuantity = totalN / 45 * 100;
        recommendations.push({
            name: 'Ureia (complemento N)',
            quantity: ureaQuantity,
            cost: ureaQuantity * 2.50
        });
    }
    
    return recommendations.slice(0, 3); // Return top 3 recommendations
}

function calculateFertilizerCost(formulations) {
    return formulations.reduce((total, f) => total + f.cost, 0);
}

// Irrigation calculation
function calculateIrrigation() {
    try {
        const area = validateNumericInput(document.getElementById('irrig-area').value, 0.01);
        const evapotranspiration = validateNumericInput(document.getElementById('evapotranspiration').value, 0);
        const efficiency = validateNumericInput(document.getElementById('efficiency').value, 1, 100);
        const precipitation = validateNumericInput(document.getElementById('precipitation').value, 0);
        
        if (!area || evapotranspiration === false || !efficiency || precipitation === false) {
            throw new Error('Por favor, preencha todos os campos com valores válidos');
        }
        
        // Calculate net irrigation requirement (mm/day)
        const netIrrigation = Math.max(0, evapotranspiration - precipitation);
        
        // Calculate gross irrigation requirement considering efficiency
        const grossIrrigation = netIrrigation / (efficiency / 100);
        
        // Convert area to square meters
        const areaM2 = convertToSquareMeters(area);
        
        // Calculate daily water volume (liters)
        const dailyVolume = (grossIrrigation / 1000) * areaM2 * 1000; // mm to m, then m³ to liters
        
        // Calculate weekly and monthly volumes
        const weeklyVolume = dailyVolume * 7;
        const monthlyVolume = dailyVolume * 30;
        
        // Calculate irrigation frequency
        const irrigationFrequency = calculateIrrigationFrequency(netIrrigation);
        
        // Calculate costs
        const dailyCost = calculateWaterCost(dailyVolume);
        const monthlyCost = dailyCost * 30;
        
        const resultText = `
            <div class="result-value">${formatNumber(Math.round(dailyVolume))} L/dia</div>
            <div class="result-unit">R$ ${monthlyCost.toFixed(2)}/mês</div>
            <div style="margin-top: 1rem; padding: 1rem; background: #e8f5e8; border-radius: 8px;">
                <strong>Necessidades de irrigação:</strong><br>
                • Lâmina líquida: ${netIrrigation.toFixed(1)} mm/dia<br>
                • Lâmina bruta: ${grossIrrigation.toFixed(1)} mm/dia<br>
                • Volume semanal: ${formatNumber(Math.round(weeklyVolume))} L<br>
                • Volume mensal: ${formatNumber(Math.round(monthlyVolume))} L<br>
                • Frequência sugerida: ${irrigationFrequency}<br>
                • Custo diário: R$ ${dailyCost.toFixed(2)}
            </div>
        `;
        
        document.getElementById('irrigation-result').innerHTML = resultText;
    } catch (error) {
        document.getElementById('irrigation-result').innerHTML = `<div style="color: #f44336;">Erro: ${error.message}</div>`;
    }
}

function calculateIrrigationFrequency(netIrrigation) {
    if (netIrrigation <= 2) {
        return 'A cada 3-4 dias';
    } else if (netIrrigation <= 4) {
        return 'A cada 2-3 dias';
    } else if (netIrrigation <= 6) {
        return 'Diariamente';
    } else {
        return 'Duas vezes ao dia';
    }
}

function calculateWaterCost(volumeLiters) {
    // Water cost estimation (R$ per 1000L)
    const costPer1000L = 3.50;
    return (volumeLiters / 1000) * costPer1000L;
}

// Productivity and economic analysis
function calculateProductivity(area, cropType, inputCosts) {
    const productivityData = {
        milho: { yield: 8500, price: 0.65 }, // kg/ha, R$/kg
        soja: { yield: 3200, price: 1.20 },
        feijao: { yield: 2800, price: 2.50 },
        arroz: { yield: 7500, price: 1.10 },
        trigo: { yield: 3500, price: 0.85 }
    };
    
    const crop = productivityData[cropType] || productivityData.milho;
    const totalProduction = area * crop.yield;
    const grossRevenue = totalProduction * crop.price;
    const netRevenue = grossRevenue - inputCosts;
    const roi = ((netRevenue / inputCosts) * 100);
    
    return {
        production: totalProduction,
        grossRevenue: grossRevenue,
        netRevenue: netRevenue,
        roi: roi,
        breakEven: inputCosts / crop.price
    };
}

// Export functions for global access
window.calculateArea = calculateArea;
window.calculateSeeds = calculateSeeds;
window.calculateFertilizer = calculateFertilizer;
window.calculateIrrigation = calculateIrrigation;
window.calculateProductivity = calculateProductivity;

