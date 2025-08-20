# API - Tienda de Productos

## Descripción

Este proyecto es un API backend diseñada para gestionar el flujo completo de compra de productos. Permite a los usuarios consultar productos, crear clientes, generar órdenes de compra y procesar pagos a través de la pasarela de pagos de **Wompi**.

El sistema está construido con **Nest.js** y sigue los principios de la **Arquitectura Hexagonal** para garantizar una clara separación de responsabilidades y facilitar su mantenimiento y escalabilidad.

## Repositorio

* Backend: [https://github.com/yavemu/products_shop_api](https://github.com/yavemu/products_shop_api)
* Frontend: [https://github.com/yavemu/products_shop](https://github.com/yavemu/products_shop)

## Características Principales

*   Consulta de catálogo de productos.
*   Gestión de clientes.
*   Creación de órdenes en estado `PENDING`.
*   Integración con la pasarela de pagos **Wompi** (Sandbox) para procesar transacciones.
*   Actualización del estado de la transacción y la orden (éxito o fallo).
*   Actualización automática del stock de productos tras una compra exitosa.
*   Documentación de la API con Swagger.

## Arquitectura

El proyecto implementa **Arquitectura Hexagonal (Puertos y Adaptadores)** para separar la lógica de negocio del framework y las dependencias externas (como la base de datos o APIs de terceros).

*   **Domain**: Contiene los modelos de negocio, interfaces (puertos) y la lógica de dominio pura. No tiene dependencias externas.
*   **Application**: Orquesta los casos de uso (use cases), conectando los puertos de entrada (controladores) con la lógica de dominio.
*   **Infrastructure**: Implementa los adaptadores para los puertos definidos en el dominio. Aquí se encuentran las conexiones a la base de datos (TypeORM), las llamadas a APIs externas (Wompi) y los controladores web.

## Diseño de la Base de Datos (PostgreSQL)

Se utilizan las siguientes entidades principales:

### `Product`
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único del producto. |
| `name` | `varchar` | Nombre del producto. |
| `description` | `text` | Descripción detallada. |
| `price` | `numeric` | Precio del producto. |
| `stock` | `integer` | Cantidad disponible en inventario. |

### `Customer`
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único del cliente. |
| `email` | `varchar` | Correo electrónico del cliente. |
| `fullName` | `varchar` | Nombre completo del cliente. |
| `phone` | `varchar` | Número de teléfono. |

### `Order`
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único de la orden. |
| `customerId` | `uuid` | FK al cliente que realiza la orden. |
| `totalAmount`| `numeric` | Monto total de la orden. |
| `status` | `varchar` | Estado de la orden (`PENDING`, `PAID`, `FAILED`). |

### `Transaction`
| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único de la transacción. |
| `orderId` | `uuid` | FK a la orden asociada. |
| `wompiId` | `varchar` | ID de la transacción en Wompi. |
| `status` | `varchar` | Estado de la transacción (`PENDING`, `APPROVED`, `DECLINED`, `ERROR`). |
| `amount` | `numeric` | Monto de la transacción. |

---

## Instalación y Uso

1.  Clonar el repositorio:
    ```bash
    git clone https://github.com/yavemu/products_shop_api.git
    cd products_shop_api
    ```
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Configurar las variables de entorno. Copiar el archivo `.env.example` a `.env` y rellenar los valores correspondientes.
    ```bash
    cp .env.example .env
    ```
    *   Asegúrate de configurar las credenciales de la base de datos y las claves de Wompi.
    *   Para el desarrollo inicial, `DB_SYNCHRONIZE` puede estar en `true` para que TypeORM cree las tablas automáticamente.

4.  Poblar la base de datos con productos de prueba:
    ```bash
    npm run seed:products
    ```
5.  Iniciar el servidor en modo desarrollo:
    ```bash
    npm run start:dev
    ```

## Endpoints de la API

La documentación completa e interactiva está disponible a través de **Swagger** en la ruta `/apidoc` una vez que el servidor está en ejecución.

**URL Base**: `http://localhost:3000`


### Test pasarela de pagos con flujo de tarjeta de crédito
*   **`POST /run-credit-card-flow`**: Realiza el flujo completo de compra con tarjeta de crédito utilizando Wompi. Este endpoint se deja disponible para pruebas y demostraciones del funcionamiento de la API de pagos de forma independiente.

### Productos
*   **`GET /products`**: Obtiene una lista de todos los productos disponibles.
*   **`GET /products/:id`**: Obtiene los detalles de un producto específico por su ID.

### Clientes
*   **`POST /customers`**: Crea un nuevo cliente.
    *   **Request Body**: `{ "email": "user@example.com", "fullName": "Juan Perez", "phone": "3001234567" }`
    *   **Response**: El objeto del cliente creado.

### Órdenes y Pagos
*   **`POST /orders`**: Crea una nueva orden de compra.
    *   **Request Body**: `{ "customerId": "uuid-del-cliente", "items": [{ "productId": "uuid-del-producto", "quantity": 1 }] }`
    *   **Response**: La orden creada con estado `PENDING` y el total calculado.

## Pruebas (Testing)

El proyecto utiliza **Jest** para las pruebas unitarias y de integración. El objetivo de cobertura es del **80%**.

*   Para ejecutar todas las pruebas:
    ```bash
    npm test
    ```
*   Para generar el reporte de cobertura:
    ```bash
    npm run test:cov
    ```

Después de ejecutar el comando de cobertura, puedes encontrar el reporte detallado en la carpeta `coverage/lcov-report/index.html`.

## Seguridad

*   **Variables de Entorno**: Toda la información sensible (claves de API, credenciales de base de datos) se gestiona a través de variables de entorno y el archivo `.env`, que no debe ser subido al repositorio.
*   **Autenticación**: (Pendiente) Se planea implementar un sistema de autenticación basado en Claves de API para proteger los endpoints.
*   **HTTPS**: Para el despliegue en producción, es mandatorio configurar un servidor web (como Nginx) para que actúe como proxy inverso y gestione las conexiones a través de HTTPS con un certificado SSL/TLS.

## Despliegue

La aplicación está lista para ser desplegada en cualquier proveedor de nube que soporte Node.js (AWS, Google Cloud, Railway, Heroku, etc.).

Asegúrate de configurar las variables de entorno correspondientes en el entorno de producción y establecer `DB_SYNCHRONIZE=false` para evitar que TypeORM modifique el esquema de la base de datos de forma automática.
