# 🚀 Inicio Rápido - La Internacional CRM en Railway

## Para Empezar Ahora Mismo

### Opción 1: Desarrollo Local (Recomendado primero)

```bash
# 1. Copiar template de env
cp .env.local.example .env.local

# 2. Editar .env.local y agregar:
#    - META_APP_ID (de Meta Console)
#    - META_ACCESS_TOKEN (token de acceso)
#    - META_PHONE_NUMBER_ID
#    - META_BUSINESS_ACCOUNT_ID

# 3. Iniciar todo en Docker
docker-compose up

# 4. Abrir en navegador
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
```

### Opción 2: Railway (Producción)

```bash
# 1. Conectar con Railway
railway init
railway link

# 2. En Railway Dashboard → Variables, agregar:
#    Todos los valores de .env.example

# 3. Deploy
railway up

# 4. Ver logs
railway logs
```

---

## 📋 Checklist Rápido

### Antes de deployar:
- [ ] Tengo credenciales Meta (token, phone ID, WABA ID)
- [ ] Generé JWT_SECRET fuerte (ver ENV-VARIABLES.md)
- [ ] .env.local.example tiene los comentarios útiles
- [ ] Database URL es correcto

### Después de pushear a Railway:
- [ ] Servicios están corriendo (railway status)
- [ ] No hay errores en logs (railway logs)
- [ ] Frontend carga en: https://app.up.railway.app
- [ ] Backend responde: curl https://app.up.railway.app/health

---

## 🔐 Lo Más Importante: Meta Token

**Nunca lo commits a Git, nunca lo compartes en chat.**

```
✅ Lo correcto:
   - Railway Variables UI → paste token
   - .env.local (git ignored)
   - Variables de entorno solo

❌ Lo incorrecto:
   - Código fuente
   - .env en git
   - Chats / tickets / notas públicas
```

**Obtenerlo:**
1. https://developers.facebook.com
2. Ir a app → WhatsApp
3. System Users → Crear usuario
4. Generar token de acceso
5. Copiar a Railway Variables

---

## 📚 Documentación Importante

| Necesito... | Ver archivo... |
|-------------|----------------|
| Deploy a Railway paso a paso | `DEPLOYMENT-RAILWAY.md` |
| Setup local con Docker | `DOCKER-SETUP.md` |
| Qué significa cada variable | `ENV-VARIABLES.md` |
| Resumen técnico de todo | `IMPLEMENTATION-SUMMARY.md` |
| Checklist y FAQs | `SETUP-COMPLETE.md` |

---

## ⚡ Troubleshooting Rápido

**Docker no inicia:**
```bash
# Verificar que Docker está corriendo
docker ps

# Si no funciona, reiniciar Docker Desktop
```

**Base de datos no conecta:**
```bash
# Revisar DATABASE_URL en .env.local
# Debe ser: postgresql://postgres:postgres@postgres:5432/lid

# Reiniciar postgres
docker-compose down -v postgres
docker-compose up postgres
```

**Meta token inválido:**
```
Error: META_ACCESS_TOKEN not configured

Solución:
1. Verificar que el token esté en Railway Variables
2. No está expirado (cada 60 días hay que renovar)
3. Reiniciar servicio: railway restart
```

**Frontend no carga:**
```bash
# Verificar nginx config
docker logs lid-frontend

# Verificar VITE_API_BASE_URL en Railway Variables
# Debe apuntar al domain correcto del backend
```

---

## 📞 Preguntas Frecuentes

**¿Cuándo debo rotar el Meta token?**
- Meta lo requiere cada 60 días
- Genera uno nuevo → actualiza en Railway Variables → redeploy

**¿Los 8 servicios se hablan entre sí?**
- Sí, via `http://{servicio}.railway.internal:{puerto}`
- Configurado automáticamente en `railway.toml`

**¿Puedo testear sin token real?**
- Sí, en local con `VITE_USE_MOCKS=true`
- Todo funciona con datos en localStorage

**¿Es seguro dejar token en Railway Variables?**
- Sí, Railway encripta variables
- Nunca aparecen en logs ni en el código

**¿Qué pasa si me olvido una variable?**
- El servicio falla al iniciar
- Verás error claro: "META_ACCESS_TOKEN no configurado"

---

## 🎯 Próximos Pasos

1. **Ahora:** Leer `SETUP-COMPLETE.md` para entender todo
2. **Luego:** Probar localmente con `docker-compose up`
3. **Después:** Configurar Railway con credenciales
4. **Finalmente:** Deploy con `railway up`

---

**¿Necesitas más ayuda?** Revisa los archivos de documentación en el proyecto.
