# Auditoría SEO y plan de migración de PODARCIS SL

**Fecha de auditoría:** 4 de agosto de 2026  
**Web de origen:** `https://www.podarcis.com` (WordPress)  
**Web de destino:** aplicación Laravel 13 + Inertia 3 + React 19 de este repositorio  
**Mercado prioritario:** Mallorca e Islas Baleares, sin renunciar a proyectos nacionales  
**Objetivo:** captar solicitudes cualificadas de empresas, hoteles, constructoras, promotores y administraciones que necesitan consultoría ambiental, cumplimiento, sostenibilidad o soluciones digitales.

> Las referencias marcadas como **[INFORMACIÓN NECESARIA]** deben confirmarse antes de publicar. No deben sustituirse por datos supuestos.

---

## 1. Diagnóstico general de la web

### Resumen ejecutivo

PODARCIS parte de una posición mejor que la de una web nueva: el dominio publicado dispone de páginas de servicio, cerca de noventa contenidos históricos, señales locales, menciones de proyectos y presencia visible para consultas de consultoría medioambiental en Mallorca. La nueva aplicación mejora la organización visual y ya incluye modelos separados para servicios, artículos, casos y ajustes del sitio, pero aún no está preparada para reemplazar la web actual sin una pérdida SEO relevante.

Los tres frentes prioritarios son:

1. **Conservar la autoridad existente.** El origen declara 24 páginas y 90 entradas en sus sitemaps. El destino solo contiene 11 servicios, 3 artículos y 2 casos. Debe migrarse el histórico útil y aplicarse una redirección individual a cada URL antigua.
2. **Hacer indexable el contenido del destino.** El HTML inicial devuelve `lang="en"`, `<title>Laravel</title>` y un `<div id="app"></div>` vacío. Los metadatos y el contenido aparecen únicamente tras ejecutar JavaScript. No hay sitemap y `robots.txt` no lo referencia.
3. **Convertir la experiencia local en relevancia demostrable.** Las páginas de servicio del CMS prácticamente no mencionan Mallorca ni Baleares; el nuevo ajuste de contacto tampoco contiene teléfono ni dirección. La web publicada sí muestra datos locales, pero existen discrepancias de dirección y tres correos diferentes.

### Fortalezas existentes

- Dominio consolidado y arquitectura histórica con páginas específicas para servicios ambientales, normas ISO y evaluación ambiental.
- Nueva aplicación con URLs limpias, una ficha por servicio, blog, casos de éxito y campos CMS para title, description e imágenes alternativas.
- Contenido extenso en la mayoría de servicios nuevos: huella de carbono, circularidad, legislación, sistemas de gestión, formación, UuupsApp y ESG Suite ya tienen base suficiente para ser reeditados.
- Experiencia publicada en proyectos de Baleares y en organizaciones de ámbito nacional; constituye una buena base de autoridad si cada afirmación y cliente se valida.
- Uso inicial de `Service`, `Article` y `Organization` en JSON-LD, aunque actualmente sea incompleto y dependa del cliente.

### Debilidades principales

- Riesgo severo de pérdida de tráfico por migración: faltan contenidos históricos y redirecciones.
- Metadatos, canonical y JSON-LD no están presentes en el HTML inicial.
- Idioma y nombre de aplicación incorrectos en la configuración actual.
- No existe `/sitemap.xml`; `robots.txt` solo contiene una regla vacía.
- No hay aviso legal en el destino.
- No existen breadcrumbs públicos ni paginación del blog.
- La ficha de visores cartográficos tiene solo unas decenas de palabras y carece de estructura.
- Home, servicios y contacto no consolidan claramente la ubicación en Mallorca.
- Teléfono y dirección están vacíos en el nuevo CMS. La web pública muestra distintos emails (`administracion@`, `info@`) y el destino usa `contacto@`.
- Los testimonios nuevos usan personas y empresas genéricas. No deben publicarse como prueba social hasta confirmar que corresponden a testimonios reales y autorizados.
- Dos casos nuevos son genéricos y no identifican proyecto, localización ni evidencia verificable.
- El H1 de la home contiene una errata (“Consultroría”). La navegación contiene “Quienés somos”.

### Oportunidad orgánica

La consulta genérica “consultoría ambiental Mallorca” tiene competencia local media: aparecen consultoras especializadas de Baleares, directorios y empresas nacionales con páginas locales. PODARCIS puede diferenciarse mediante:

- cobertura conjunta de consultoría técnica, auditoría y software propio;
- especialización en obligaciones autonómicas baleares;
- experiencia demostrable en obra pública, turismo, huella de carbono y cumplimiento legal;
- contenidos firmados por especialistas y basados en CAIB, BOIB, BOE, MITECO y organismos sectoriales;
- páginas específicas que resuelvan una necesidad comercial, no páginas locales repetidas.

---

## 2. Problemas SEO detectados

| Prioridad | Problema | Evidencia | Impacto | Acción recomendada |
|---|---|---|---|---|
| Crítica | Contenido no renderizado en servidor | El HTML inicial contiene `Laravel`, `lang="en"` y el contenedor Inertia vacío | Rastreo menos fiable, snippets incorrectos y pérdida de señales | Activar SSR de Inertia y probar el HTML sin JavaScript |
| Crítica | Migración incompleta | Origen: 24 páginas y 90 entradas; destino: 3 artículos | 404, pérdida de enlaces y caída de rankings | Migrar el contenido útil y desplegar la matriz 301 completa |
| Crítica | Sin sitemap en el destino | `/sitemap.xml` devuelve 404 | Descubrimiento deficiente y peor control de indexación | Generar sitemap dinámico y declararlo en robots |
| Crítica | NAP sin confirmar | Nuevo CMS sin teléfono/dirección; correos y oficina inconsistentes | Debilita SEO local, confianza y schema | Confirmar una ficha maestra y replicarla en todos los canales |
| Alta | Canonical calculado en navegador | `SeoHead` usa `window.location` | Ausente en HTML inicial y sensible al host solicitado | Generar URL absoluta en servidor con dominio canónico fijo |
| Alta | Datos estructurados aislados | `Service` y `Article` no enlazan con IDs persistentes | Entidades débiles o duplicadas | Crear un grafo con `@id` para organización, web, página y servicio |
| Alta | Ausencia de señales locales en servicios | Cero menciones de Mallorca/Baleares en las descripciones actuales | Menor relevancia local | Añadir contexto útil, normativa y cobertura territorial sin repetir keywords |
| Alta | Arquitectura digital inconsistente | Productos digitales aparecen bajo `/servicios/{slug}` aunque tienen índice propio | Jerarquía ambigua y breadcrumbs incoherentes | Mover productos a `/soluciones-digitales/{slug}` con 301 |
| Alta | Falta una página de consultoría ESG | Solo existe el software ESG Suite | Se mezcla intención de servicio e intención de producto | Crear `/servicios/consultoria-sostenibilidad-esg` |
| Alta | Legislación: servicio y software mezclados | Legislación Online cubre producto y asesoramiento | Riesgo de no responder a “asesoría legal ambiental” | Separar consultoría de cumplimiento y solución digital |
| Alta | Contenido muy escaso de visores | Descripción de 251 caracteres, sin detalle | Thin content, escasa conversión | Redactar caso de uso, metodología, entregables, sectores y FAQ |
| Alta | Blog no paginado | El controlador carga todos los artículos | Escalabilidad, rendimiento y rastreo | Paginar y añadir enlaces `prev`/`next` y canonicals propios |
| Alta | Sin breadcrumbs públicos | Solo existe un componente interno de aplicación | Peor orientación y menor contexto semántico | Breadcrumb visible + `BreadcrumbList` |
| Alta | Legales incompletos | No hay aviso legal en las rutas nuevas | Confianza y cumplimiento | Publicar aviso legal y mantener privacidad/cookies accesibles |
| Media | Open Graph incompleto | Faltan locale, site name, image dimensions/alt y Twitter card | Previsualizaciones inconsistentes | Completar metadatos por tipo de página |
| Media | Página 404 genérica | No orienta hacia servicios, blog o contacto | Mala experiencia y pérdida de navegación | Crear 404 pública, noindex, con buscador/enlaces útiles |
| Media | Autores poco informativos | “Administrador PODARCIS” | Menor E-E-A-T en contenido técnico | Autor/revisor real con ficha profesional |
| Media | Prueba social genérica | Testimonios y casos sin evidencia identificable | Riesgo reputacional | Despublicar hasta validar o convertirlos en ejemplos claramente etiquetados |
| Media | Titles demasiado genéricos | “Servicios”, “Blog”, “Contacto” | Menor relevancia y CTR | Reescribir títulos según intención y localización |
| Media | Configuración local incorrecta | `APP_NAME=Laravel`, `APP_LOCALE=en` | Marca e idioma equivocados | Establecer PODARCIS, `es` y zona Europe/Madrid |
| Media | Recursos precargados en exceso | Se precargan varias variantes de fuente y múltiples módulos | Puede perjudicar LCP | Precargar solo fuente crítica y recurso LCP real |
| Futura | Sin páginas de categoría editorial | Hay categorías en CMS, pero no rutas públicas | Se desaprovechan clústeres temáticos | Activarlas cuando cada categoría tenga al menos 4–5 artículos útiles |

---

## 3. Arquitectura web recomendada

```text
/
├── servicios/
│   ├── estudios-ambientales/
│   │   ├── evaluacion-impacto-ambiental/
│   │   ├── evaluacion-ambiental-estrategica/
│   │   ├── red-natura-2000/
│   │   └── impacto-paisajistico/
│   ├── vigilancia-ambiental-de-obras/
│   ├── calculo-huella-carbono/
│   ├── sistemas-de-gestion/
│   │   ├── iso-9001/
│   │   ├── iso-14001/
│   │   ├── iso-45001/
│   │   ├── iso-27001/
│   │   └── iso-50001/
│   ├── consultoria-sostenibilidad-esg/
│   ├── planes-circularidad-hoteles/
│   ├── cumplimiento-legislacion-ambiental/
│   ├── formacion-medioambiental/
│   ├── visores-cartograficos/
│   ├── sonometria/                       [INFORMACIÓN NECESARIA: confirmar servicio activo]
│   └── double-u-certificate/
├── soluciones-digitales/
│   ├── legislacion-online/
│   ├── uuupsapp/
│   └── esg-suite-solutions/
├── casos-de-exito/
│   └── {slug}/
├── blog/
│   └── {slug}/
├── quienes-somos/
├── contacto/
├── aviso-legal/
├── politica-de-privacidad/
└── politica-de-cookies/
```

### Decisiones de arquitectura

- La home es la única landing local general. Debe responder a “consultoría ambiental Mallorca”; no se creará `/mallorca/` ni páginas por municipio.
- `/servicios` responde a “servicios ambientales Mallorca” y distribuye autoridad a cada especialidad.
- Huella de carbono es un servicio de consultoría, aunque se apoye en software; debe estar bajo `/servicios`.
- La consultoría ESG y ESG Suite son páginas distintas: una vende acompañamiento profesional y la otra una plataforma.
- El cumplimiento legal ambiental y Legislación Online también son páginas distintas por intención.
- Las páginas ISO y de evaluación ambiental se conservan por su intención específica y por disponer de URLs históricas. Deben enlazar a su página madre y no repetir párrafos completos.
- Las categorías del blog permanecerán sin rutas indexables durante el lanzamiento. Se habilitarán cuando exista masa crítica y una introducción editorial propia.

---

## 4. Mapa de palabras clave por URL

La competencia es una valoración cualitativa de la SERP actual, no un volumen ni una previsión de tráfico.

| URL | Keyword principal | Secundarias y variaciones | Intención | Competencia | Oportunidad local |
|---|---|---|---|---|---|
| `/` | consultoría ambiental Mallorca | consultora ambiental Mallorca, consultoría medioambiental Mallorca, empresa medioambiental Mallorca, asesoría ambiental Mallorca | Comercial local | Media-alta | Muy alta |
| `/servicios` | servicios ambientales Mallorca | servicios medioambientales, gestión ambiental Mallorca, consultoría ambiental para empresas | Comercial | Media | Alta |
| `/servicios/estudios-ambientales` | estudios ambientales Mallorca | consultora de estudios ambientales, informes ambientales, tramitación ambiental | Comercial | Media | Alta |
| `/servicios/estudios-ambientales/evaluacion-impacto-ambiental` | estudio de impacto ambiental Mallorca | evaluación de impacto ambiental, EIA, documento ambiental | Comercial/informativa | Media-alta | Alta |
| `/servicios/estudios-ambientales/evaluacion-ambiental-estrategica` | evaluación ambiental estratégica Baleares | estudio ambiental estratégico, evaluación de planes | Comercial/informativa | Media | Alta |
| `/servicios/estudios-ambientales/red-natura-2000` | estudio Red Natura 2000 Baleares | evaluación de repercusiones, espacios protegidos Mallorca | Comercial | Media | Alta |
| `/servicios/estudios-ambientales/impacto-paisajistico` | estudio de impacto paisajístico Mallorca | integración paisajística, estudio de incidencia paisajística | Comercial | Media | Alta |
| `/servicios/vigilancia-ambiental-de-obras` | vigilancia ambiental de obras Mallorca | seguimiento ambiental de obra, PVA, control ambiental construcción | Comercial | Media | Muy alta |
| `/servicios/calculo-huella-carbono` | cálculo huella de carbono empresas Mallorca | registro balear huella de carbono, reducción emisiones, ISO 14064 | Comercial/regulatoria | Media-alta | Muy alta |
| `/servicios/sistemas-de-gestion` | sistemas de gestión ambiental Mallorca | implantación ISO, auditoría interna, gestión integrada | Comercial | Alta | Alta |
| `/servicios/sistemas-de-gestion/iso-14001` | consultoría ISO 14001 Mallorca | implantación ISO 14001, auditoría ambiental ISO | Comercial | Alta | Alta |
| `/servicios/consultoria-sostenibilidad-esg` | consultoría sostenibilidad Mallorca | consultoría ESG, estrategia ESG, sostenibilidad empresarial Mallorca | Comercial | Media-alta | Muy alta |
| `/servicios/planes-circularidad-hoteles` | plan de circularidad hoteles Baleares | circularidad hotelera, Ley de Turismo Baleares, evaluación circular | Comercial/regulatoria | Media | Muy alta |
| `/servicios/cumplimiento-legislacion-ambiental` | cumplimiento legal ambiental | asesoría legislación ambiental Mallorca, requisitos legales ambientales | Comercial | Media | Alta |
| `/servicios/formacion-medioambiental` | formación medioambiental empresas | cursos ambientales Mallorca, sensibilización ambiental, formación in company | Comercial | Media | Alta |
| `/servicios/visores-cartograficos` | visores cartográficos Mallorca | soluciones GIS ambientales, mapas web, cartografía ambiental | Comercial | Baja-media | Alta |
| `/soluciones-digitales` | software de gestión ambiental | soluciones digitales ambientales, software cumplimiento ESG | Comercial | Media-alta | Media |
| `/soluciones-digitales/legislacion-online` | software de legislación ambiental | plataforma requisitos legales, evaluación de cumplimiento legal | Comercial/producto | Media | Media |
| `/soluciones-digitales/uuupsapp` | software gestión de incidencias | app incidencias ambientales, seguimiento de acciones correctivas | Comercial/producto | Media | Media |
| `/soluciones-digitales/esg-suite-solutions` | software ESG | plataforma indicadores ESG, reporting sostenibilidad, gestión ESG | Comercial/producto | Alta | Media |
| `/casos-de-exito` | proyectos de consultoría ambiental | casos de éxito sostenibilidad, proyectos ambientales Mallorca | Validación comercial | Baja | Alta |
| `/blog` | actualidad ambiental Baleares | normativa ambiental, sostenibilidad empresas, recursos ambientales | Informativa | Media | Alta |
| `/quienes-somos` | consultora ambiental PODARCIS | equipo consultoría ambiental Mallorca, PODARCIS SL | Navegacional/confianza | Baja | Alta |
| `/contacto` | contactar consultoría ambiental Mallorca | presupuesto estudio ambiental, asesoramiento ambiental Palma | Conversión local | Baja | Muy alta |

### Distribución para evitar canibalización

- “Consultoría/consultora ambiental Mallorca” pertenece a la home, no a todas las páginas.
- “Servicios ambientales Mallorca” pertenece al índice de servicios.
- Cada servicio usa la localización solo donde aporta contexto: normativa aplicable, cobertura, experiencia o tipo de proyecto.
- Los artículos informativos deben enlazar a la landing comercial, pero no copiar su title ni su H1.
- “Software ESG” pertenece al producto; “consultoría ESG” pertenece al servicio.
- “Registro balear de huella de carbono” se trabaja en un artículo transaccional-informativo que enlaza al servicio de cálculo.

---

## 5. Propuesta de SEO title, meta description, H1 y slug para cada página

### Metadatos principales

| Página | Slug | SEO title | Meta description | H1 |
|---|---|---|---|---|
| Inicio | `/` | Consultoría ambiental en Mallorca · PODARCIS | Consultoría ambiental en Mallorca para empresas, hoteles, constructoras y administraciones. Estudios, cumplimiento, sostenibilidad y soluciones digitales. | Consultoría ambiental en Mallorca para convertir obligaciones en decisiones |
| Servicios | `/servicios` | Servicios ambientales en Mallorca · PODARCIS | Estudios, vigilancia de obras, huella de carbono, sistemas de gestión, circularidad, ESG y formación para organizaciones de Mallorca y Baleares. | Servicios ambientales para empresas y administraciones |
| Estudios ambientales | `/servicios/estudios-ambientales` | Estudios ambientales en Mallorca · PODARCIS | Elaboramos estudios ambientales para proyectos, planes y actividades en Mallorca y Baleares, con análisis técnico, medidas y apoyo en la tramitación. | Estudios ambientales para proyectos viables y bien tramitados |
| Evaluación de impacto | `/servicios/estudios-ambientales/evaluacion-impacto-ambiental` | Estudios de impacto ambiental en Mallorca · PODARCIS | Evaluamos impactos, alternativas y medidas preventivas para proyectos sujetos a evaluación ambiental en Mallorca y las Islas Baleares. | Estudios de impacto ambiental en Mallorca y Baleares |
| Evaluación estratégica | `/servicios/estudios-ambientales/evaluacion-ambiental-estrategica` | Evaluación ambiental estratégica en Baleares · PODARCIS | Documentación ambiental para planes y programas, análisis de alternativas y acompañamiento durante la evaluación ambiental estratégica en Baleares. | Evaluación ambiental estratégica de planes y programas |
| Red Natura 2000 | `/servicios/estudios-ambientales/red-natura-2000` | Estudios Red Natura 2000 en Baleares · PODARCIS | Analizamos las posibles repercusiones de proyectos y planes sobre espacios Red Natura 2000 en Mallorca y Baleares. | Evaluación de repercusiones sobre Red Natura 2000 |
| Impacto paisajístico | `/servicios/estudios-ambientales/impacto-paisajistico` | Estudios de impacto paisajístico en Mallorca · PODARCIS | Estudios de incidencia e integración paisajística para proyectos e instalaciones en Mallorca, adaptados al territorio y al procedimiento aplicable. | Estudios de impacto e integración paisajística |
| Vigilancia de obras | `/servicios/vigilancia-ambiental-de-obras` | Vigilancia ambiental de obras en Mallorca · PODARCIS | Seguimiento ambiental de obras, control de condicionantes, incidencias e informes trazables para promotores, constructoras y administraciones. | Vigilancia ambiental de obras y proyectos |
| Huella de carbono | `/servicios/calculo-huella-carbono` | Cálculo de huella de carbono en Mallorca · PODARCIS | Calculamos y reducimos la huella de carbono de empresas y administraciones y acompañamos su verificación e inscripción en el registro balear. | Cálculo y reducción de la huella de carbono |
| Sistemas de gestión | `/servicios/sistemas-de-gestion` | Sistemas de gestión e ISO en Mallorca · PODARCIS | Implantación, auditoría y mejora de sistemas ISO de calidad, medioambiente, energía, seguridad y cumplimiento para organizaciones de Mallorca. | Sistemas de gestión adaptados a tu organización |
| ISO 14001 | `/servicios/sistemas-de-gestion/iso-14001` | Consultoría ISO 14001 en Mallorca · PODARCIS | Implantamos y auditamos sistemas de gestión ambiental ISO 14001 en empresas y organizaciones de Mallorca y Baleares. | Implantación y auditoría ISO 14001 |
| Sostenibilidad y ESG | `/servicios/consultoria-sostenibilidad-esg` | Consultoría de sostenibilidad y ESG en Mallorca | Estrategia, indicadores, riesgos y planes ESG para integrar la sostenibilidad en la gestión y preparar información fiable para grupos de interés. | Consultoría de sostenibilidad y ESG para empresas |
| Circularidad hotelera | `/servicios/planes-circularidad-hoteles` | Planes de circularidad para hoteles en Baleares | Elaboramos, implantamos y actualizamos planes de circularidad para hoteles y alojamientos turísticos de Mallorca y las Islas Baleares. | Planes de circularidad para hoteles y alojamientos turísticos |
| Cumplimiento ambiental | `/servicios/cumplimiento-legislacion-ambiental` | Cumplimiento legal ambiental para empresas · PODARCIS | Identificamos y evaluamos requisitos ambientales para convertir la normativa aplicable en obligaciones claras, evidencias y planes de acción. | Asesoría en legislación y cumplimiento ambiental |
| Formación | `/servicios/formacion-medioambiental` | Formación medioambiental para empresas · PODARCIS | Cursos, talleres y sensibilización ambiental presencial u online, adaptados a los riesgos, obligaciones y objetivos de cada organización. | Formación medioambiental práctica y adaptada |
| Visores | `/servicios/visores-cartograficos` | Visores cartográficos y soluciones GIS · PODARCIS | Diseñamos visores web y soluciones GIS para consultar proyectos, riesgos, activos y datos ambientales de forma clara y operativa. | Visores cartográficos para decisiones ambientales y territoriales |
| Soluciones digitales | `/soluciones-digitales` | Software de gestión ambiental y ESG · PODARCIS | Herramientas digitales para requisitos legales, incidencias, indicadores ESG, evidencias y seguimiento ambiental. | Soluciones digitales para gestionar cumplimiento y sostenibilidad |
| Legislación Online | `/soluciones-digitales/legislacion-online` | Legislación Online: software de cumplimiento legal | Centraliza normativa, requisitos, evaluaciones y evidencias de cumplimiento con una plataforma digital y apoyo técnico especializado. | Legislación Online para controlar tus requisitos legales |
| UuupsApp | `/soluciones-digitales/uuupsapp` | UuupsApp: software de gestión de incidencias | Registra, asigna y resuelve incidencias desde web y móvil con evidencias, alertas, indicadores e informes trazables. | Gestiona incidencias y acciones con UuupsApp |
| ESG Suite | `/soluciones-digitales/esg-suite-solutions` | Software ESG para indicadores y reporting · PODARCIS | Centraliza datos, indicadores, objetivos, riesgos y evidencias ESG para mejorar el seguimiento y preparar informes de sostenibilidad. | ESG Suite Solutions: convierte datos ESG en decisiones |
| Casos | `/casos-de-exito` | Proyectos ambientales y de sostenibilidad · PODARCIS | Conoce proyectos de PODARCIS en medioambiente, huella de carbono, cumplimiento, obra, sistemas de gestión y soluciones digitales. | Proyectos y resultados de PODARCIS |
| Blog | `/blog` | Actualidad ambiental y sostenibilidad en Baleares | Guías y análisis sobre normativa ambiental, huella de carbono, circularidad, obras, sistemas de gestión y ESG para empresas. | Actualidad ambiental para tomar decisiones con criterio |
| Quiénes somos | `/quienes-somos` | Equipo de consultoría ambiental en Mallorca · PODARCIS | Conoce el equipo, la metodología y la experiencia de PODARCIS en consultoría ambiental, sostenibilidad y soluciones digitales. | Especialistas en medioambiente, sostenibilidad y tecnología |
| Contacto | `/contacto` | Contacto · Consultoría ambiental en Mallorca | Cuéntanos qué estudio, obligación, auditoría o proyecto necesitas resolver. Contacta con el equipo de PODARCIS en Mallorca. | Hablemos de tu proyecto ambiental |

### Estructura y contenido mínimo por tipo de página

#### Home — 900 a 1.200 palabras

- H2: Servicios ambientales para empresas y administraciones.
- H2: Especialización en Mallorca y Baleares.
- H2: Sectores con los que trabajamos.
- H2: Método PODARCIS.
- H2: Proyectos y experiencia verificable.
- H2: Consultoría apoyada por soluciones digitales propias.
- H2: Preguntas frecuentes.
- CTA primaria: “Solicitar asesoramiento”.
- CTA secundaria: “Explorar servicios”.
- FAQ: qué hace una consultora ambiental; cuándo se necesita; ámbito geográfico; cómo pedir presupuesto.

**Extracto propuesto:** “PODARCIS ayuda a empresas, hoteles, constructoras y administraciones a resolver obligaciones ambientales y convertirlas en procesos claros. Desde Mallorca trabajamos en estudios, seguimiento de obras, huella de carbono, sistemas de gestión, circularidad y sostenibilidad, combinando criterio técnico con herramientas digitales propias.”

#### Índice de servicios — 500 a 700 palabras

- Agrupar por “Evaluación y obra”, “Clima y sostenibilidad”, “Gestión y cumplimiento” y “Formación y territorio”.
- Cada tarjeta debe explicar problema, destinatario y resultado; no limitarse al nombre.
- Incluir enlaces a casos y a soluciones digitales complementarias.

#### Fichas de servicio — 900 a 1.500 palabras

Estructura común, adaptada a cada servicio:

- H2: Qué problema resuelve.
- H2: A quién se dirige.
- H2: Qué incluye el servicio.
- H3 por entregable o fase real.
- H2: Cómo trabaja PODARCIS.
- H2: Aplicación en Mallorca y Baleares.
- H2: Casos o sectores relacionados.
- H2: Preguntas frecuentes (4–6).
- CTA: formulario con servicio preseleccionado.

Preguntas específicas:

- **Estudios:** ¿qué proyecto necesita evaluación?, ¿ordinaria o simplificada?, ¿qué documentación se entrega?, ¿PODARCIS acompaña la tramitación?
- **Vigilancia:** ¿qué controla un PVA?, ¿con qué frecuencia se visita la obra?, ¿cómo se documentan incidencias?, ¿se coordina con dirección facultativa?
- **Huella:** ¿qué empresas están obligadas en Baleares?, ¿qué son los alcances 1, 2 y 3?, ¿se necesita verificación?, ¿qué datos hay que preparar?
- **Sistemas:** ¿qué norma conviene?, ¿cuánto dura una implantación?, ¿PODARCIS certifica? La respuesta debe aclarar que la certificación corresponde a una entidad acreditada.
- **ESG:** ¿qué diferencia hay entre ESG y sostenibilidad?, ¿qué indicadores priorizar?, ¿se prepara reporting?, ¿puede combinarse con ESG Suite?
- **Circularidad:** ¿qué alojamientos están sujetos?, ¿qué contiene el plan?, ¿cada cuánto se revisa?, ¿qué indicadores se controlan?
- **Cumplimiento:** ¿cómo se identifica normativa aplicable?, ¿cómo se demuestra cumplimiento?, ¿cada cuánto se actualiza?, ¿qué aporta Legislación Online?
- **Formación:** ¿presencial u online?, ¿se adapta al puesto?, ¿se entrega evidencia?, ¿puede integrarse en ISO 14001?
- **Visores:** ¿qué datos pueden visualizarse?, ¿se integra con sistemas existentes?, ¿requiere instalar software?, ¿cómo se actualiza la información?

#### Productos digitales — 800 a 1.200 palabras

- Problema operativo y usuario objetivo.
- Funciones visibles y verificables.
- Flujo de uso y ventajas sin promesas no demostradas.
- Integraciones, seguridad, alojamiento y soporte: **[INFORMACIÓN NECESARIA]**.
- Capturas reales con alt descriptivo.
- FAQ de demo, implantación, usuarios, importación y soporte.
- CTA principal: “Solicitar una demo”.

#### Casos de éxito — 600 a 1.000 palabras

- Contexto, cliente o sector, localización, reto, alcance, metodología, resultado y servicio relacionado.
- No publicar cifras, logos ni nombres sin autorización.
- Si el cliente no puede identificarse, describir sector y contexto con suficiente precisión y explicar que se ha anonimizado.
- Añadir fecha y responsable técnico **[INFORMACIÓN NECESARIA]**.

#### Artículos — extensión según intención, normalmente 1.000 a 1.800 palabras

- Respuesta breve al principio.
- Tabla de contenidos si supera 1.500 palabras.
- Autor y revisor técnico, fecha de publicación y actualización.
- Fuentes oficiales enlazadas en contexto.
- Aviso visible si una norma ha sido modificada o derogada.
- CTA contextual hacia un único servicio principal.

### Textos alternativos

- Describir la información útil de la imagen, no la keyword: “Técnica de PODARCIS revisando medidas ambientales durante una obra viaria en Mallorca”.
- Usar `alt=""` en imágenes decorativas.
- En gráficos: resumir el mensaje y ofrecer los datos también como texto o tabla.
- En logos: “PODARCIS” o nombre real del producto; evitar “logo de” salvo que sea necesario.
- No inventar localización, cliente o actividad a partir de una imagen de stock.

---

## 6. Mejoras técnicas prioritarias

### Renderizado e indexación

1. Activar el bundle SSR de Inertia y desplegar el proceso SSR según la plataforma elegida.
2. Asegurar que el HTML inicial contenga contenido principal, title, description, canonical, robots, Open Graph y JSON-LD.
3. Configurar `APP_NAME=PODARCIS`, `APP_LOCALE=es`, `APP_FALLBACK_LOCALE=es`, `APP_URL=https://www.podarcis.com` y zona `Europe/Madrid`.
4. Generar canonicals en servidor. Ignorar parámetros de analítica y formularios (`source`, UTM) en la URL canónica.
5. Aplicar `noindex,follow` a login, recuperación, administración, resultados internos y páginas de agradecimiento; bloquear administración en robots sin confiar en robots como mecanismo de seguridad.

### Sitemap y robots

El sitemap debe incluir únicamente URLs 200, canónicas, publicadas y permitidas para indexación:

- páginas estáticas;
- servicios y subservicios;
- soluciones digitales;
- artículos;
- casos de éxito.

Debe excluir borradores, páginas futuras, admin, autenticación, contacto POST, agradecimiento, filtros y URLs con parámetros. `lastmod` debe proceder de una modificación real, no de la hora de cada solicitud.

`robots.txt` recomendado:

```text
User-agent: *
Disallow: /admin/
Disallow: /login
Disallow: /forgot-password
Disallow: /reset-password/
Disallow: /settings/

Sitemap: https://www.podarcis.com/sitemap.xml
```

No se debe bloquear CSS, JavaScript ni imágenes necesarios para renderizar.

### Datos estructurados

Usar un grafo con identificadores constantes:

- `https://www.podarcis.com/#organization`: `Organization` y, cuando el NAP esté confirmado, `ProfessionalService` o un subtipo local apropiado. No declarar varias entidades duplicadas.
- `https://www.podarcis.com/#website`: `WebSite`, publisher enlazado a la organización. No añadir `SearchAction` mientras no exista búsqueda pública funcional.
- `https://www.podarcis.com/{ruta}#webpage`: `WebPage` o subtipo correcto.
- `#service`: `Service` en cada servicio, con provider enlazado a `#organization`, `areaServed` real y `serviceType`.
- `BreadcrumbList` en fichas, artículos y casos.
- `Article` con headline, fechas, imagen, autor y publisher.
- `FAQPage` solo cuando las mismas preguntas y respuestas sean visibles; no usarlo esperando un resultado enriquecido garantizado.

Datos pendientes para entidad local: nombre legal, NIF si se desea publicar, dirección, teléfono, email principal, coordenadas, horario, logo, redes y área atendida **[INFORMACIÓN NECESARIA]**.

### Redirecciones

- Aplicar la matriz de `matriz-migracion.csv` antes de cambiar DNS o aplicación.
- Todas las redirecciones deben ser 301 directas, sin pasar por HTTP, no-www, barra final u otra URL intermedia.
- Mantener el dominio canónico `https://www.podarcis.com` y resolver HTTP y no-www directamente a él.
- No redirigir URLs sin equivalente a la home. Si un contenido no es verdadero, útil ni recuperable, devolver 410.
- Conservar las redirecciones durante un mínimo de 12 meses; preferiblemente, de forma indefinida.

### 404, paginación y duplicados

- 404 con status real 404, `noindex`, buscador o enlaces a servicios, blog y contacto.
- Blog paginado con URLs estables (`/blog?page=2` o segmentos), canonical propio en cada página y enlaces rastreables.
- No canonicalizar todas las páginas paginadas a la primera.
- Los filtros futuros deberán ser noindex o no generar URLs rastreables salvo que tengan demanda y contenido propio.
- Normalizar barra final, mayúsculas, host y protocolo mediante una sola redirección.

### Rendimiento, imágenes y accesibilidad

- Objetivos de campo en percentil 75: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1.
- Imagen LCP en WebP/AVIF, dimensiones explícitas, `fetchpriority="high"` y sin `loading="lazy"`.
- Imágenes bajo el primer scroll con lazy loading, `srcset` y `sizes`.
- No precargar todas las variantes de fuente; usar solo la fuente/peso crítico y `font-display: swap`.
- Dividir JavaScript administrativo del público y evitar librerías del CMS en visitantes anónimos.
- Cachear assets versionados durante un año e HTML según estrategia de publicación.
- Mantener un H1, jerarquía H2/H3 lógica, foco visible, labels reales, contraste AA, navegación por teclado y respeto a `prefers-reduced-motion`.

### Plan de validación técnica

- Test de respuesta HTML: contenido y metadatos presentes sin JavaScript.
- Tests de sitemap, robots, canonical, noindex, fechas y exclusión de borradores.
- Dataset de redirecciones que recorra toda la matriz y compruebe 301 + destino 200.
- Tests de páginas 404 y estados de contenido no publicado.
- Validación de JSON-LD y ausencia de campos vacíos o inventados.
- Rastreo preproducción sin enlaces rotos y comparación de URLs origen/destino.
- Lighthouse móvil en home, índice, servicio, artículo, caso y contacto.

---

## 7. Estrategia de SEO local

### NAP y entidad

Crear una ficha maestra aprobada y usarla literalmente en footer, contacto, schema, Google Business Profile, redes y directorios:

- **Nombre:** PODARCIS SL **[INFORMACIÓN NECESARIA: forma comercial exacta]**
- **Dirección:** **[INFORMACIÓN NECESARIA: confirmar oficina; existen datos públicos contradictorios]**
- **Teléfono:** **[INFORMACIÓN NECESARIA: confirmar si +34 871 961 697 sigue vigente]**
- **Email:** **[INFORMACIÓN NECESARIA: elegir entre contacto@, administracion@ o info@podarcis.com]**
- **Horario:** **[INFORMACIÓN NECESARIA]**
- **Coordenadas:** **[INFORMACIÓN NECESARIA]**

### Contenido local útil

- Home: explicar que el equipo opera desde Mallorca y conoce los procedimientos autonómicos, sin limitar el alcance nacional.
- Huella: Registro balear y criterios oficiales, enlazando a CAIB.
- Circularidad: obligaciones para alojamientos de Baleares, áreas prioritarias y revisión del plan.
- Estudios: procedimientos autonómicos, territorio insular, espacios protegidos y coordinación administrativa.
- Vigilancia: obra civil, instalaciones, proyectos turísticos y condicionantes ambientales habituales.
- Casos: indicar Mallorca, Menorca, Ibiza o Formentera solo cuando sea real y autorizable.

### Google Business Profile

- Categoría principal recomendada: “Consultora medioambiental”, si está disponible en la interfaz española.
- Secundarias: consultora de administración empresarial, ingeniero medioambiental o servicio de empresa a empresa, únicamente si describen servicios reales.
- Descripción: 650–750 caracteres naturales, con servicios prioritarios y Mallorca; sin promociones ni enlaces.
- Cargar logo, fachada/acceso, equipo, trabajo de campo y oficina. No usar solo imágenes de stock.
- Añadir cada servicio con nombre y descripción breve coherentes con su landing.
- Publicar novedades técnicas o casos una o dos veces al mes.
- Preparar respuestas a preguntas reales sobre cobertura, presupuesto, documentación y primera reunión.
- Solicitar reseñas tras hitos reales; no incentivar ni filtrar clientes según probabilidad de valoración positiva.
- Responder a todas las reseñas sin revelar información confidencial del proyecto.

### Citaciones y presencia local

- Corregir inconsistencias en Páginas Amarillas, colegios profesionales, cámaras, asociaciones y directorios sectoriales relevantes.
- Priorizar menciones editoriales y colaboraciones reales con asociaciones hoteleras, construcción, calidad, sostenibilidad y colegios profesionales.
- No comprar paquetes de directorios ni crear perfiles sin mantener.

---

## 8. Plan de contenidos para seis meses

Cadencia: dos piezas principales al mes. Cada artículo tendrá autor, revisor, fecha, fuente oficial, CTA y revisión programada cuando trate normativa.

| Mes | Contenido | Keyword/intención | CTA principal | Fuente base |
|---|---|---|---|---|
| 1 | Qué empresas deben inscribir su huella en el Registro balear | registro balear huella de carbono; informativa/comercial | Cálculo de huella | CAIB, Decreto 48/2021 |
| 1 | Checklist de datos para calcular la huella de una empresa | datos cálculo huella carbono; comercial | Solicitar diagnóstico | MITECO/CAIB |
| 2 | Plan de circularidad para hoteles: contenido, indicadores y revisión | plan circularidad hoteles Baleares; comercial | Plan de circularidad | Ley 8/2012, Ley 3/2022, guía AETIB |
| 2 | Cómo preparar un hotel para revisar su plan de circularidad | revisión plan circularidad hotel; comercial | Revisar plan existente | CAIB/AETIB |
| 3 | Cuándo necesita un proyecto evaluación de impacto ambiental en Baleares | evaluación impacto ambiental Baleares; informativa/comercial | Estudios ambientales | CAIB, D. Leg. 1/2020 |
| 3 | Evaluación ambiental ordinaria o simplificada: diferencias prácticas | EIA ordinaria o simplificada; informativa | Analizar proyecto | BOE/CAIB |
| 4 | Qué incluye un programa de vigilancia ambiental de obra | programa vigilancia ambiental obra; comercial | Vigilancia de obra | Autorización/DIA aplicable |
| 4 | Cómo registrar incidencias ambientales de obra con trazabilidad | incidencias ambientales obra; comercial/producto | Vigilancia + UuupsApp | Criterio técnico PODARCIS |
| 5 | ISO 14001 para empresas de Mallorca: proceso, tiempos y evidencias | ISO 14001 Mallorca; comercial | Sistemas de gestión | ISO, ENAC/entidades oficiales |
| 5 | Auditoría ambiental interna: documentación y errores frecuentes | auditoría ambiental empresa; comercial | Auditoría interna | ISO 14001 y experiencia validada |
| 6 | Cómo empezar una estrategia ESG sin convertirla en burocracia | consultoría ESG empresas; comercial | Consultoría ESG | Comisión Europea/EFRAG cuando aplique |
| 6 | Ayudas ambientales en Baleares: cómo decidir si una convocatoria encaja | ayudas sostenibilidad empresas Baleares; informativa/comercial | Diagnóstico de proyecto | BOIB, CAIB, AETIB |

### Contenidos de actualización continua

- Página anual “Normativa ambiental para empresas en Baleares: cambios de [año]”.
- Calendario de obligaciones y convocatorias, siempre con fecha de comprobación.
- Actualizaciones de artículos históricos cuando cambie una norma.
- Casos de éxito derivados de proyectos reales, con autorización y resultados comprobables.

### Criterios editoriales

- No convertir noticias corporativas en artículos vacíos: cada pieza debe aportar contexto, proceso o aprendizaje.
- En temas legales, indicar alcance, fecha y fuente; evitar afirmar que una obligación aplica a todos.
- No prometer certificaciones que PODARCIS no emite.
- Usar español de España y nombres oficiales de “Illes Balears” cuando se cite una institución o norma.
- Revisar contenidos regulatorios al menos cada seis meses y ante cambios normativos relevantes.

---

## 9. Estrategia de enlazado interno

### Reglas

- Cada landing de servicio debe recibir enlaces desde home, `/servicios`, al menos dos artículos y, cuando exista, un caso real.
- Cada artículo tendrá un servicio principal y hasta dos recursos secundarios; evitar bloques automáticos de diez enlaces.
- Cada caso enlazará al servicio utilizado y a otro caso del mismo sector o problema.
- Los productos digitales enlazarán al servicio profesional complementario y viceversa.
- Usar anchors descriptivos y variados; evitar repetir “haz clic aquí” o la keyword exacta en todos los enlaces.

### Relaciones prioritarias

| Origen | Destino principal | Anchors posibles |
|---|---|---|
| Artículos del Registro balear | Cálculo de huella | cálculo y reducción de emisiones; preparar la huella de la empresa |
| Artículos de circularidad turística | Planes de circularidad | elaborar o revisar el plan de circularidad; circularidad para alojamientos |
| Artículos de evaluación | Estudios ambientales | analizar la tramitación ambiental; documentación ambiental del proyecto |
| Artículos de obra | Vigilancia ambiental | seguimiento ambiental durante la obra; control de condicionantes |
| Artículos de ISO | Sistemas de gestión / ISO 14001 | implantar el sistema ambiental; preparar la auditoría interna |
| Artículos de ESG | Consultoría ESG | definir una estrategia ESG; seleccionar indicadores materiales |
| Cumplimiento legal | Legislación Online | centralizar requisitos legales; evaluar el cumplimiento en la plataforma |
| Vigilancia y casos de obra | UuupsApp | registrar incidencias con trazabilidad; seguimiento digital de acciones |
| Consultoría ESG | ESG Suite | centralizar indicadores y evidencias ESG |
| Estudios territoriales | Visores cartográficos | consultar información territorial; visualizar riesgos y activos |

### Navegación y breadcrumbs

- Servicio: Inicio → Servicios → Servicio.
- Subservicio: Inicio → Servicios → Servicio madre → Subservicio.
- Producto: Inicio → Soluciones digitales → Producto.
- Artículo: Inicio → Blog → Artículo. Añadir categoría solo cuando exista ruta pública útil.
- Caso: Inicio → Casos de éxito → Caso.

### Control

- Ninguna landing prioritaria debe quedar a más de tres clics desde la home.
- Evitar páginas huérfanas mediante test automático sobre el sitemap y enlaces internos.
- Revisar trimestralmente anchors, enlaces rotos y artículos sin salida hacia servicios.

---

## 10. Lista priorizada de tareas

### Prioridad crítica — antes de publicar

1. Confirmar NAP, email, horario, redes, certificaciones, autores, clientes y testimonios.
2. Migrar los artículos y páginas útiles del origen; aprobar la matriz URL a URL.
3. Implementar todas las redirecciones 301 y probar que cada destino responde 200.
4. Activar SSR y garantizar contenido, title, description, canonical y JSON-LD en el HTML inicial.
5. Corregir idioma, nombre, URL y zona horaria de la aplicación.
6. Crear sitemap dinámico y robots.txt.
7. Publicar aviso legal y revisar privacidad/cookies.
8. Despublicar testimonios o casos genéricos que no puedan verificarse.

### Prioridad alta — lanzamiento o primeras dos semanas

1. Reescribir home, servicios y contacto con foco Mallorca/Baleares.
2. Separar servicios profesionales de productos digitales y crear consultoría ESG/cumplimiento ambiental.
3. Completar la página de visores cartográficos.
4. Publicar breadcrumbs visibles y estructurados.
5. Completar Organization/ProfessionalService, WebSite, Service y Article.
6. Paginar el blog y crear la 404 pública.
7. Optimizar titles, descriptions, H1, imágenes y alt de todas las landings.
8. Migrar Search Console, enviar sitemap y vigilar cobertura e inspecciones.

### Prioridad media — primer trimestre

1. Ejecutar el calendario editorial de seis meses.
2. Convertir proyectos históricos autorizados en casos de éxito completos.
3. Crear perfiles de autores y proceso de revisión técnica.
4. Optimizar Core Web Vitals con datos de campo.
5. Corregir citaciones locales y completar Google Business Profile.
6. Implantar revisión periódica de legislación y fechas de actualización.

### Mejoras futuras

1. Abrir categorías editoriales cuando tengan masa crítica.
2. Evaluar versión en catalán a partir de demanda y capacidad editorial, con `hreflang` correcto; no traducir automáticamente.
3. Añadir buscador si el archivo editorial lo justifica.
4. Crear recursos descargables útiles —checklists o plantillas— sin bloquear contenido esencial para posicionar.
5. Medir leads por landing y consulta, sin almacenar datos personales innecesarios.

### Seguimiento de lanzamiento

| Momento | Control |
|---|---|
| Antes | Crawl completo, comparación de sitemaps, redirecciones, HTML SSR, analytics y Search Console |
| Día 0 | DNS/host, HTTPS, robots, sitemap, canonicals, status y formularios |
| Día 7 | Errores 404, páginas descubiertas/no indexadas, redirecciones y logs de Googlebot |
| Día 30 | Impresiones, clics, consultas, cobertura, CWV y leads por landing |
| Día 90 | Tendencia por clúster, canibalización, contenido a actualizar y nuevas oportunidades |

### Criterios de aceptación

- El 100 % de URLs del sitemap responde 200, es canónico e indexable.
- El 100 % de URLs migradas resuelve en una sola redirección hacia un destino 200.
- Todas las páginas públicas tienen un solo H1, title único, description útil y canonical absoluto.
- Los metadatos y el contenido principal están disponibles sin JavaScript.
- Ningún dato estructurado contiene dirección, cliente, certificación o valoración no verificada.
- No existen enlaces internos rotos ni páginas prioritarias huérfanas.
- La home, contacto y servicios prioritarios expresan de manera natural la relación con Mallorca y Baleares.

---

## Fuentes consultadas

- Web pública y sitemap de PODARCIS: `https://www.podarcis.com/`, `page-sitemap.xml` y `post-sitemap.xml`.
- Registro balear de huella de carbono: https://www.caib.es/seucaib/es/201/empreses/tramites/tramite/5140303/
- Preguntas frecuentes del Decreto 48/2021: https://www.caib.es/sites/canviclimatic2/es/preguntes_freqaents_sobre_el_decret_faqs/
- Evaluación de impacto ambiental ordinaria en Baleares: https://www.caib.es/seucaib/es/200/Personas/tramites/tramite/2893276
- Texto refundido de evaluación ambiental de las Illes Balears: https://www.caib.es/sites/instruccionsicirculars/es/n/decreto_legislativo_por_el_que_se_aprueba_el_texto_refundido_de_la_ley_122016_de_17_de_agosto_de_evaluacion_ambiental_de_las_illes_balears/
- Medidas de sostenibilidad y circularidad turística: https://www.boe.es/buscar/doc.php?id=BOE-A-2022-9388
- Guía del plan de circularidad para establecimientos turísticos: https://www.caib.es/webgoib/documents/20121/660230/guia_plan_circularidad_establecimientos_turisticos_es.pdf/19c35e5f-9db1-ae54-06b3-066600a6fbcb
