#!/bin/bash
# Script para inicializar Ollama com o modelo Llama 3.2 3B

echo "🚀 Aguardando Ollama inicializar..."
sleep 10

echo "📥 Baixando modelo llama3.2:3b..."
docker exec productengineering-ollama ollama pull llama3.2:3b

echo "✅ Modelo llama3.2:3b baixado com sucesso!"
echo "🧪 Testando modelo..."
docker exec productengineering-ollama ollama run llama3.2:3b "Responda apenas: funcionando"

echo "✅ Ollama configurado e pronto para uso!"
