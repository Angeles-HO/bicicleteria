# Proyecto: Bicicleteria

**Desarrollo:** Aplicacion WEB para mostrar productos de una tienda de bicicletas.
**Metodologia aplicada *(Personal)***
*Desarrollo Iterativo Modular con Refactorizacion Progresiva*

# Estructura de la Metodologia:

1. **Fase 1 - MVP *(Producto Minimo Viable)* Funcional:**
    Se crea una version minima con estructura HTML basica, carga desde JSON local, y renderizado directo de productos.
2. **Fase 2 - Refactorizacion modular:**
    Se encapsua la logica en classes reutilizables: renderizado, filtrado, acceso a datos, almacenamiento etc.
    Esto facilita el mantenimiento, escalabilidad y lectura del codigo.
3. **Fase 3 - Integracion dinamica de contenido:**
    Se agregan filtros dinamicos (modelo, pago, moneda), precios con descuento final, alerta de stock y eventos de compra.
4. **Fase 4 - Integracion y mejora continua:**
    Repetimos el proceso con mejoras incrementales:
    - Separacion de la logica de filtrado.
    - Mejora y automatizacion de calculo a precio final de precios con descuento.
    - Validacion de estados.
    - Posibilidad de agregar mas funcionalidades sin afectar el resto de elementos.
    

# Desarrollo Actual
**Estado del proyecto: En Desarrollo**
**Contenido Actual:**
- [x] Carga de productos
- [x] Renderizado modular
- [x] Filtros dinamicos
- [x] Capacidad de register/login con logout y almacenar el usuario para iniciar sesion de vuelta

### Contenido en desarrollo:
- [ ] Carrito de compras
- [ ] Finalizar compra (el envio de datos ya funciona; falta CSS y logica secundaria)
- [ ] Edicion del perfil de usuario
- [ ] Paginacion de productos (ej: mostrar solo 10 por pagina)