# 🧪 Guia de Teste Local

## ❌ Por que não funciona com `file://`

O sistema de formulário **não funcionará** se você abrir o arquivo diretamente no navegador (`file://`) porque:

- **Netlify Forms**: Requer servidor hospedado no Netlify
- **CORS**: Cross-Origin Resource Sharing bloqueia requisições locais
- **HTTPS**: Netlify requer conexão segura
- **JavaScript**: Fetch API não funciona com protocolo `file://`

## ✅ Como Testar Localmente

### **1. Servidor Python (Recomendado)**
```bash
# Na pasta site/
python -m http.server 8000
```
Acesse: `http://localhost:8000`

### **2. Live Server (VS Code)**
- Instale a extensão "Live Server"
- Clique com botão direito no `index.html`
- Selecione "Open with Live Server"

### **3. Servidor Node.js**
```bash
npx serve .
```

### **4. Servidor PHP**
```bash
php -S localhost:8000
```

## 🔧 Modificação Implementada

O código foi modificado para detectar ambiente local e simular o funcionamento:

```javascript
// Detecta se está rodando localmente
const isLocal = window.location.protocol === 'file:' || 
               window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1';

if (isLocal) {
    // Simula sucesso localmente
    console.log('Form data (local test):', data);
    showSuccessModal();
    return;
}
```

## 📊 Comportamento Local vs Produção

| Ambiente | Comportamento |
|----------|---------------|
| **Local** | Simula envio, mostra sucesso, salva no console |
| **Netlify** | Envia email real para evandrotielcop@gmail.com |

## 🎯 Testando o Formulário

### **Localmente**
1. Abra `http://localhost:8000`
2. Preencha o formulário
3. Veja os dados no console do navegador
4. Modal de sucesso será exibido

### **Em Produção**
1. Deploy no Netlify
2. Preencha o formulário
3. Email será enviado para evandrotielcop@gmail.com
4. Modal de sucesso será exibido

## 🚀 Deploy para Produção

Para funcionar completamente:

1. **Netlify**: Conecte o repositório GitHub
2. **Configuração**: Netlify Forms será ativado automaticamente
3. **Teste**: Formulário funcionará completamente

## 📝 Logs de Debug

No console do navegador você verá:
- **Local**: `Form data (local test): {email: "...", subject: "...", ...}`
- **Produção**: Requisição real para Netlify Forms

---

**Nota**: O sistema foi projetado para funcionar tanto localmente (para testes) quanto em produção (com envio real de emails).
