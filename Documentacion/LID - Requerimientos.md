### **Perfil de Cliente Ideal (ICP) de La Internacional**

### **1\. Perfil Profesional (B2B \- Business to Business)**

* ### **Ocupación:** Cosmetólogas, esteticistas, dueñas de centros de estética, dermatólogas y profesionales de la belleza.

* ### **Condición Excluyente:** Deben contar con **credencial profesional** o matrícula que valide su actividad. No compran para uso personal, compran insumos para trabajar o revender a sus propios pacientes.

### **2\. Ubicación Geográfica**

* ### **Zona Principal:** Córdoba y provincias del interior del país.

* ### **Zonas de Exclusión / Derivación:** CABA y Buenos Aires (por temas de logística, distribución o estrategias de marca, estos perfiles se filtran en el primer contacto para no hacer perder tiempo a las vendedoras locales).

### **3\. Comportamiento de Compra y Rentabilidad**

* ### **Ticket Promedio Objetivo:** Compras de entre **$150 y $200 USD** por pedido.

* ### **Frecuencia de Compra:** Alta recurrencia. Son clientes que necesitan reponer stock de forma constante (quincenal o mensual).

* ### **Toma de Decisión:** Valoran la velocidad. Al ser profesionales, necesitan que les pasen la lista de precios actualizada rápido, les confirmen el stock por colores/lotes sin demoras y les despachen ágilmente.

### **4\. Puntos de Dolor (Por qué eligen a La Internacional)**

* ### Necesitan un proveedor confiable que tenga stock real.

* ### Odian la fricción: quieren hacer el pedido rápido por WhatsApp sin tener que entrar a páginas web complicadas.

* ### Valoran estar informadas de las novedades (por eso la importancia de que reciban la difusión del Congreso y las listas semanales).

# **REQUERIMIENTOS**

### **1\. Módulo de Recepción y Omnicanalidad (Primer Contacto)**

* **Bandeja de entrada unificada:** Integración de las 5 líneas de WhatsApp actuales y los mensajes directos de Instagram en una sola interfaz de gestión. Esa interfaz de gestion deberia ser mas que nada para el diseño de las difusiones, y para un admin que vea como vienen los vendedores con cada uno de sus clientes asociados.

  Queda por discutir si los asesores deben poder ver todos los clientes o solo los suyos.

  Es fundamental que al cliente se le asigne un “tipo” entonces se machea el tipo con el asesor y por ende el cliente se asigna automatico.

	Cuando el cliente ya fue asignado se generarán oportunidades para ese cliente y ese

asesor particular que atiende a ese cliente.

	Es importante que ellas no tengan que estar revisando a quien pertenece cada numero, deben poder ingresar el listado de numeros de wsp al programa y que el programa chequee si ese numero ya està registrado para un asesor, para evitar que tengan que fijarse manualmente si un cliente es nuevo o si ya està dentro del sistema. FUNDAMENTAL.

* **Triaje y cualificación automática:** Bot inicial o flujo automatizado que solicite credenciales profesionales.  
* **Asignación inteligente de leads:** Sistema que asigne cada tipo de cliente con el asesor que atiende a los clientes de ese tipo en particular  
* **Etiquetado de estados:** Capacidad de marcar el estado de cada chat en tiempo real (ej. *Recibido, En validación, Presupuestando, Sin comprobante, Agendado*). Buscan la menor cantidad de estados posibles ya que no se quieren complicar.

### **2\. Módulo de Gestión de Clientes (CRM Core)**

* **Directorio centralizado (Anti-Duplicidad):** Base de datos única que cruce el número de teléfono entrante con los registros existentes para identificar instantáneamente si el cliente ya existe y qué asesora tiene asignada (eliminando el uso del grupo de consultas interno).  
* **Segmentación y priorización:** Funcionalidad para clasificar a los clientes según etiquetas (ej. profesión, nivel de compra, inactividad) para dar prioridad de atención a perfiles de alto valor.  
* **Historial unificado:** Visualización rápida de interacciones previas, tickets de compra y preferencias del profesional en la misma pantalla del chat.

### **3\. Módulo de Marketing y Difusiones (Motor de Envíos)**

* **Integración nativa con WhatsApp Business API:** Conexión oficial mediante la API de Cloud de Meta (aprovechando los tokens y webhooks ya configurados) para garantizar envíos masivos 100% legales y sin riesgo de bloqueos.  
* **Gestor de listas de difusión dinámicas:** Eliminación del armado manual de listas de 250 contactos. El sistema debe permitir filtrar por segmento (ej. "Cosmetólogas de Córdoba") y disparar plantillas aprobadas (Templates) de forma masiva y automatizada.  
* **Gestión de Opt-in / Opt-out:** Control de suscripciones para cumplir con las políticas de Meta y enviar promociones solo a quienes acepten recibirlas, cuidando la calidad de la cuenta.

### **4\. Módulo de Automatización Postventa**

* **Secuencias de seguimiento automático:** Disparo de plantillas (Templates de Utilidad o Marketing) programadas a los 7 días posteriores a una compra, especialmente para clientes con el ticket promedio objetivo ($150-$200 USD).

La parte de mensajes de postventa queremos ver si la podemos hacer pasar sin necesidad de usar plantillas, porque no son mensajes masivos sino particulares a cada cliente, podriamos utilizar un metodo de envio de mensajes mediante web api de whatsapp pero sin plantilla, tratando de camuflar el envio de manera automatica.

Creemos que es posible porque no seria envio masivo ni frecuente pero necesitamos comprobarlo antes de lanzarlo a despliegue (Fundamental construir un entorno que nos permita realizar esto)

Esto deberiamos hacerlo como modulo aparte, como un microservicio, de manera tal que quede funcional para posibles clientes nuevos pero tambien de manera tal que si se cae no afecte al rendimiento del resto del sistema.

Cabe aclarar que toda nuestra solucion tendrá una bd separada de la del sistema de gestion que tienen actual, pero duplicarà algunos datos apropòsito para poder manejarlos por separado

* **Reactivación de inactivos:** Alertas o mensajes automatizados para clientes que superen un determinado periodo sin realizar pedidos.  
* Esto tambien sucederia con el modulo de envio de mensaje automatico gratuito, es decir, camuflado para que no se tengan que pagar porque el envio de mensajes igual que para el caso de seguimiento es puntual y no masivo.

  Lo que buscamos hacer es eliminar el tiempo que le demora a una vendedora buscar un numero, armar el mensaje, chequear cuales son los clientes a recuperar y/o que quieren hacer seguimiento.

  El modulo funcionaria de manera tal que podriamos enviar mensaje para cada telefono (5) por lo cual desde el telefono de un asesor solo se mandarina mensajes a esos clientes que tiene asignado.

  Va a ser muy importante entonces no solo tener el dato de los telefonos de cada cliente sino tambien de los telefonos de cada asesor asi podremos crear correctamente la secuencia de emisor y receptor. asesor y cliente.

### **5\. Módulo de Analítica y Reportes (Business Intelligence)**

* **Embudos de conversión:** Visualización de la tasa de conversión general de ventas y, específicamente, la tasa de conversión del "primer contacto" (nuevos leads que se vuelven clientes).  
* **Auditoría de fallas:** Identificación de las etapas donde se caen las ventas (ej. abandono post-presupuesto).

	Fundamental que nos centremos en la parte que implica las tasas de converison, en funicon de los estados que creemos para los clientes y en funcion de lo que paguemos por cada difusion debemos ser capaces de medir para cada asesor:  
1\) La cantidad de dinero que se invierte en difusiones (mensajes)

2\) para esa difusion como resultaron las ventas

3\) Debemos poder calcular las tasas de conversion de cada estado por el que pasa el cliente para que junto con el calculo del dinero gastado en esa difusion podamos calcular el costo que tiene que el cliente pase por cada uno de los estados.

Asi si se gastaron 100 en difusion y me hablaron dos clientes pero comprò uno solo, el costo de que ese cliente llegue al estado de comprar es de 100\.

### **6\. Requerimientos Técnicos y de Integración (Arquitectura)**

* **Sincronización Bidireccional (API REST):** El nuevo módulo debe poder comunicarse (leer y escribir) con el sistema propietario en la nube (desarrollado por el ingeniero freelancer) para consultar stock por colores/lotes, enviar cotizaciones y cargar pagos sin duplicar la carga de datos.  
* **Gestión de Webhooks:** Escucha activa de eventos de Meta para registrar confirmaciones de lectura, entrega de mensajes y respuestas de los clientes en tiempo real dentro del CRM.  
* **Arquitectura Escalable:** Capacidad de soportar el incremento de bases de datos masivas (más de 20.000 contactos totales) y picos de tráfico generados por eventos como congresos o listas semanales de precios.  
* **Preparación para E-commerce:** El diseño de la base de datos debe contemplar la futura habilitación de un canal de reclamos y dudas vinculado a la tienda online proyectada para el segundo semestre de 2025\.

Luego tambien hay una cuestión relacionada directamente con la conexion del sistema que ellas ya tienen y la que nosotros vamos a hacer y tenemos que tratar de que esa conexión sea lo mas limpia posible. Porque por un lado tenemos que poder reflejar las ventas del sistema suyo en nuestro sistema.

Como hacemos esto? Nosotros tenemos que poder detectar automáticamente cuando comienza una venta desde wsp, tanto desde el cliente como desde el lado del vendedor.

En ese momento debemos registrar en nuestro sistema que comenzó una nueva venta y luego debemos poder registrar los cambios de estado, etc…

La parte mas importante es que cuando se crea el “comprobante” de la venta en el sistema que ellos ya tienen, nosotros debemos poder cruzar eso con los datos de las ventas que ya tenemos y que la venta de nuestro sistema se “cierre”.

Basicamente seria hacer que se crucen los datos y que los estados del cliente se coincidan con los estados de los comprobantes.

Importante seria averiguar si los comprobantes tienen una arquitectura de estados o simplemente se los marca con colorcitos.

Estaria bueno chequear si tienen o no documentacion.

