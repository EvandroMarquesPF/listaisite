# 🔧 Guia de Troubleshooting - Netlify Forms

## ❌ Problemas Comuns e Soluções

### **1. Erro: "Form not found"**
**Causa**: Netlify não detectou o formulário
**Solução**:
- ✅ Verificar se `netlify` está no `<form>`
- ✅ Verificar se `name="beta-signup"` está correto
- ✅ Verificar se `data-netlify="true"` está presente
- ✅ Fazer novo deploy após mudanças

### **2. Erro: "Invalid form submission"**
**Causa**: Dados do formulário inválidos
**Solução**:
- ✅ Verificar se todos os campos têm `name`
- ✅ Verificar se `form-name` hidden field está presente
- ✅ Verificar se email é válido

### **3. Erro: "CORS" ou "Network Error"**
**Causa**: Problema de JavaScript/AJAX
**Solução**:
- ✅ Usar `action="/success.html"` no form
- ✅ Deixar o formulário submeter naturalmente
- ✅ Remover JavaScript de submit se necessário

### **4. Formulário não aparece no Netlify Dashboard**
**Causa**: Deploy não detectou o formulário
**Solução**:
- ✅ Fazer novo deploy completo
- ✅ Verificar se arquivo HTML está na raiz
- ✅ Aguardar alguns minutos após deploy

## ✅ Configuração Correta Implementada

### **HTML Form**
```html
<form id="betaForm" class="beta-form" 
      name="beta-signup" 
      netlify 
      netlify-honeypot="bot-field" 
      data-netlify="true" 
      action="/success.html">
    <input type="hidden" name="form-name" value="beta-signup">
    <div style="display: none;">
        <input name="bot-field" />
    </div>
    <!-- campos do formulário -->
</form>
```

### **JavaScript Melhorado**
- ✅ Detecção de ambiente local vs produção
- ✅ Headers corretos para Netlify
- ✅ Fallback para submit natural

### **Arquivos Criados**
- ✅ `success.html`: Página de confirmação
- ✅ `netlify.toml`: Configuração do Netlify
- ✅ Honeypot: Proteção contra spam

## 🚀 Passos para Deploy

### **1. Commit das Alterações**
```bash
git add .
git commit -m "fix: Melhorias no formulário Netlify"
git push origin main
```

### **2. Deploy no Netlify**
1. Conectar repositório GitHub
2. Configurar build settings:
   - **Build command**: `echo 'Static site'`
   - **Publish directory**: `.` (raiz)
3. Deploy

### **3. Verificar Formulário**
1. Acessar site no Netlify
2. Preencher formulário
3. Verificar se redireciona para `/success.html`
4. Verificar emails no Netlify Dashboard

## 📧 Configuração de Email

### **Netlify Dashboard**
1. Ir para **Forms** no dashboard
2. Selecionar formulário `beta-signup`
3. Configurar notificações:
   - **Email notifications**: Ativar
   - **Email**: `evandrotielcop@gmail.com`
   - **Subject**: `Novo testador beta: {{email}}`

### **Teste de Email**
- ✅ Preencher formulário no site
- ✅ Verificar se email chega em `evandrotielcop@gmail.com`
- ✅ Verificar spam/lixo eletrônico

## 🔍 Debug

### **Console do Navegador**
```javascript
// Verificar se formulário está configurado
console.log(document.getElementById('betaForm').attributes);

// Verificar se Netlify está ativo
console.log(window.netlify);
```

### **Netlify Logs**
1. Ir para **Functions** no dashboard
2. Verificar logs de erro
3. Verificar se formulário está sendo processado

## 📞 Suporte

Se ainda houver problemas:
1. Verificar logs do Netlify
2. Testar formulário simples sem JavaScript
3. Verificar configurações de domínio
4. Contatar suporte do Netlify

---

**Nota**: As melhorias implementadas devem resolver os problemas mais comuns com Netlify Forms.
