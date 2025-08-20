# API - Tienda de Productos

## Descripción

Este proyecto es un API backend diseñada para gestionar el flujo completo de compra de productos. Permite a los usuarios consultar productos, crear clientes, generar órdenes de compra y procesar pagos a través de la pasarela de pagos de **----**.

El sistema está construido con **Nest.js** y sigue los principios de la **Arquitectura Hexagonal** para garantizar una clara separación de responsabilidades y facilitar su mantenimiento y escalabilidad.

## Repositorio

* Backend: [https://github.com/yavemu/products_shop_api](https://github.com/yavemu/products_shop_api)
* Frontend: [https://github.com/yavemu/products_shop_web](https://github.com/yavemu/products_shop_web)

* Demo: [https://products-shop-web.vercel.app/](https://products-shop-web.vercel.app/)

## Características Principales

*   Consulta de catálogo de productos.
*   Gestión de clientes.
*   Creación de órdenes en estado `PENDING`.
*   Integración con la pasarela de pagos **----** (Sandbox) para procesar transacciones.
*   Actualización del estado de la transacción y la orden (éxito o fallo).
*   Actualización automática del stock de productos tras una compra exitosa.
*   Documentación de la API con Swagger.

## Arquitectura

El proyecto implementa **Arquitectura Hexagonal (Puertos y Adaptadores)** para separar la lógica de negocio del framework y las dependencias externas (como la base de datos o APIs de terceros).

*   **Domain**: Contiene los modelos de negocio, interfaces (puertos) y la lógica de dominio pura. No tiene dependencias externas.
*   **Application**: Orquesta los casos de uso (use cases), conectando los puertos de entrada (controladores) con la lógica de dominio.
*   **Infrastructure**: Implementa los adaptadores para los puertos definidos en el dominio. Aquí se encuentran las conexiones a la base de datos (TypeORM), las llamadas a APIs externas (----) y los controladores web.

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
    *   Asegúrate de configurar las credenciales de la base de datos y las claves de W.o.m.p.i.
    *   Para el desarrollo inicial, `DB_SYNCHRONIZE` puede estar en `true` para que TypeORM cree las tablas automáticamente.

4.  Poblar la base de datos con productos de prueba:
    ```bash
    npm run seed:products
    ```
5.  Iniciar el servidor en modo desarrollo:
    ```bash
    npm run start:dev
    ```

## Documentación de la API (Swagger)

La documentación completa e interactiva está disponible a través de **Swagger** en la ruta `/apidoc` una vez que el servidor está en ejecución.

**URL Base**: `http://localhost:3000`
**Documentación**: `http://localhost:3000/apidoc`


## Endpoints de la API

### Test pasarela de pagos con flujo de tarjeta de crédito
*   **`POST /run-credit-card-flow`**: Realiza el flujo completo de compra con tarjeta de crédito utilizando W.o.m.p.i. Este endpoint se deja disponible para pruebas y demostraciones del funcionamiento de la API de pagos de forma independiente.

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

*   **`POST /payments/:orderId/pay-with-credit-card`**: Realiza el pago de una orden de compra utilizando tarjeta de crédito.

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


## Cobertura de Código (Testing)
```bash
---------------------------------------------------|---------|----------|---------|---------|-------------------
File                                               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------------------------------------|---------|----------|---------|---------|-------------------
All files                                          |   94.68 |    73.08 |   89.26 |    94.1 |                   
 src                                               |     100 |      100 |     100 |     100 |                   
  app.module.ts                                    |     100 |      100 |     100 |     100 |                   
 src/commons/decorators                            |     100 |      100 |     100 |     100 |                   
  index.ts                                         |     100 |      100 |     100 |     100 |                   
 src/commons/decorators/customer                   |     100 |      100 |     100 |     100 |                   
  create-customer.decorator.ts                     |     100 |      100 |     100 |     100 |                   
  get-customer-by-email.decorator.ts               |     100 |      100 |     100 |     100 |                   
 src/commons/decorators/customer/constants         |     100 |      100 |     100 |     100 |                   
  index.ts                                         |     100 |      100 |     100 |     100 |                   
 src/commons/decorators/delivery                   |     100 |      100 |     100 |     100 |                   
  create-delivery.decorator.ts                     |     100 |      100 |     100 |     100 |                   
 src/commons/decorators/delivery/constants         |     100 |      100 |     100 |     100 |                   
  index.ts                                         |     100 |      100 |     100 |     100 |                   
 src/commons/decorators/order                      |     100 |      100 |     100 |     100 |                   
  create-order.decorator.ts                        |     100 |      100 |     100 |     100 |                   
  get-all-orders.decorator.ts                      |     100 |      100 |     100 |     100 |                   
  get-order-by-id.decorator.ts                     |     100 |      100 |     100 |     100 |                   
 src/commons/decorators/order/constants            |     100 |      100 |     100 |     100 |                   
  index.ts                                         |     100 |      100 |     100 |     100 |                   
 src/commons/decorators/product                    |     100 |      100 |     100 |     100 |                   
  get-all-products.decorator.ts                    |     100 |      100 |     100 |     100 |                   
  get-product-by-id.decorator.ts                   |     100 |      100 |     100 |     100 |                   
 src/commons/decorators/product/constants          |     100 |      100 |     100 |     100 |                   
  index.ts                                         |     100 |      100 |     100 |     100 |                   
 src/commons/filters                               |     100 |      100 |     100 |     100 |                   
  http-exception.filter.ts                         |     100 |      100 |     100 |     100 |                   
  index.ts                                         |     100 |      100 |     100 |     100 |                   
 src/core/application/customers/use-cases          |     100 |      100 |     100 |     100 |                   
  create-customer.usecase.ts                       |     100 |      100 |     100 |     100 |                   
  get-customer-by-email.usecase.ts                 |     100 |      100 |     100 |     100 |                   
  index.ts                                         |     100 |      100 |     100 |     100 |                   
 src/core/application/deliveries/use-cases         |     100 |      100 |     100 |     100 |                   
  create-delivery.usecase.ts                       |     100 |      100 |     100 |     100 |                   
  get-delivery-by-id.usecase.ts                    |     100 |      100 |     100 |     100 |                   
  index.ts                                         |     100 |      100 |     100 |     100 |                   
  update-delivery.usecase.ts                       |     100 |      100 |     100 |     100 |                   
 src/core/application/orders/use-cases             |    95.4 |    73.52 |     100 |      95 |                   
  create-order.usecase.ts                          |   94.28 |    73.52 |     100 |   94.02 | 64,87,122,133     
  get-order-by-id.usecase.ts                       |     100 |      100 |     100 |     100 |                   
  get-orders.usecase.ts                            |     100 |      100 |     100 |     100 |                   
  index.ts                                         |     100 |      100 |     100 |     100 |                   
 src/core/application/payments                     |   87.87 |    61.53 |    87.5 |    87.5 |                   
  payment-order.usecase.ts                         |   87.87 |    61.53 |    87.5 |    87.5 | 190,196-205       
 src/core/application/products/use-cases           |     100 |      100 |     100 |     100 |                   
  create-product.usecase.ts                        |     100 |      100 |     100 |     100 |                   
  get-product-by-id.usecase.ts                     |     100 |      100 |     100 |     100 |                   
  get-products.usecase.ts                          |     100 |      100 |     100 |     100 |                   
  index.ts                                         |     100 |      100 |     100 |     100 |                   
  seed-products.usecase.ts                         |     100 |      100 |     100 |     100 |                   
 src/core/application/transactions/use-cases       |     100 |      100 |     100 |     100 |                   
  create-transaction.usecase.ts                    |     100 |      100 |     100 |     100 |                   
  get-transaction-by-id.usecase.ts                 |     100 |      100 |     100 |     100 |                   
  index.ts                                         |     100 |      100 |     100 |     100 |                   
 src/core/domain/customers/entities                |   88.88 |      100 |       0 |   88.88 |                   
  customer.entity.ts                               |   88.88 |      100 |       0 |   88.88 | 33                
 src/core/domain/customers/ports                   |     100 |      100 |     100 |     100 |                   
  customer-repository.port.ts                      |     100 |      100 |     100 |     100 |                   
 src/core/domain/deliveries/entities               |    87.5 |    81.25 |   33.33 |    87.5 |                   
  delivery.entity.ts                               |    87.5 |    81.25 |   33.33 |    87.5 | 44,49             
 src/core/domain/deliveries/enums                  |     100 |      100 |     100 |     100 |                   
  delivery-status.enum.ts                          |     100 |      100 |     100 |     100 |                   
 src/core/domain/deliveries/ports                  |     100 |      100 |     100 |     100 |                   
  delivery-repository.port.ts                      |     100 |      100 |     100 |     100 |                   
 src/core/domain/orders/entities                   |   79.48 |    82.14 |       0 |   79.48 |                   
  order-detail.entity.ts                           |   83.33 |       75 |       0 |   83.33 | 35,40             
  order.entity.ts                                  |   77.77 |       85 |       0 |   77.77 | 48,53,59,65,69,73 
 src/core/domain/orders/ports                      |     100 |      100 |     100 |     100 |                   
  order-detail-repository.port.ts                  |     100 |      100 |     100 |     100 |                   
  order-repository.port.ts                         |     100 |      100 |     100 |     100 |                   
 src/core/domain/products/entities                 |       0 |        0 |       0 |       0 |                   
  product.entity.ts                                |       0 |        0 |       0 |       0 | 1-52              
 src/core/domain/products/ports                    |     100 |      100 |     100 |     100 |                   
  product-repository.port.ts                       |     100 |      100 |     100 |     100 |                   
 src/core/domain/transactions/entities             |    93.1 |       75 |       0 |    93.1 |                   
  transaction.entity.ts                            |    93.1 |       75 |       0 |    93.1 | 124,129           
 src/core/domain/transactions/ports                |     100 |      100 |     100 |     100 |                   
  transaction-repository.port.ts                   |     100 |      100 |     100 |     100 |                   
 src/infrastructure/database/entities              |     100 |    80.43 |     100 |     100 |                   
  customer.orm.entity.ts                           |     100 |      100 |     100 |     100 |                   
  delivery.orm.entity.ts                           |     100 |     62.5 |     100 |     100 | 49-52             
  order-detail.orm.entity.ts                       |     100 |     87.5 |     100 |     100 | 41                
  order.orm-entity.ts                              |     100 |    83.33 |     100 |     100 | 88-91,111         
  product.orm-entity.ts                            |     100 |      100 |     100 |     100 |                   
  transaction.orm-entity.ts                        |     100 |    83.33 |     100 |     100 | 195-198           
 src/infrastructure/database/repositories          |     100 |    83.33 |     100 |     100 |                   
  customer.repository.adapter.ts                   |     100 |    83.33 |     100 |     100 | 12                
  delivery.repository.adapter.ts                   |     100 |     87.5 |     100 |     100 | 12                
  order-detail.repository.adapter.ts               |     100 |       75 |     100 |     100 | 12                
  order.repository.adapter.ts                      |     100 |       75 |     100 |     100 | 12                
  product.repository.adapter.ts                    |     100 |       90 |     100 |     100 | 13                
  transaction.repository.adapter.ts                |     100 |       75 |     100 |     100 | 12                
 src/infrastructure/external_apis/wompi            |   92.39 |    59.45 |     100 |   91.95 |                   
  wompi.adapter.ts                                 |     100 |      100 |     100 |     100 |                   
  wompi.module.ts                                  |     100 |      100 |     100 |     100 |                   
  wompi.service.ts                                 |   90.66 |    59.45 |     100 |   90.27 | 158-184,212,244   
 src/infrastructure/external_apis/wompi/interfaces |       0 |      100 |     100 |       0 |                   
  index.ts                                         |       0 |      100 |     100 |       0 | 1-6               
 src/infrastructure/modules                        |     100 |      100 |     100 |     100 |                   
  customer.module.ts                               |     100 |      100 |     100 |     100 |                   
  delivery.module.ts                               |     100 |      100 |     100 |     100 |                   
  order.module.ts                                  |     100 |      100 |     100 |     100 |                   
  payment.module.ts                                |     100 |      100 |     100 |     100 |                   
  product.module.ts                                |     100 |      100 |     100 |     100 |                   
  transaction.module.ts                            |     100 |      100 |     100 |     100 |                   
 src/interfaces/web/customer                       |     100 |       75 |     100 |     100 |                   
  customer.controller.ts                           |     100 |       75 |     100 |     100 | 16-30             
 src/interfaces/web/customer/dto                   |     100 |      100 |     100 |     100 |                   
  create-customer.dto.ts                           |     100 |      100 |     100 |     100 |                   
 src/interfaces/web/delivery                       |     100 |       75 |     100 |     100 |                   
  delivery.controller.ts                           |     100 |       75 |     100 |     100 | 9-15              
 src/interfaces/web/delivery/dto                   |     100 |       75 |     100 |     100 |                   
  create-delivery.dto.ts                           |     100 |       75 |     100 |     100 | 57                
  update-delivery-status.dto.ts                    |     100 |       75 |     100 |     100 | 11                
 src/interfaces/web/order                          |     100 |       75 |     100 |     100 |                   
  order.controller.ts                              |     100 |       75 |     100 |     100 | 25-44             
 src/interfaces/web/order/dto                      |     100 |      100 |     100 |     100 |                   
  create-order.dto.ts                              |     100 |      100 |     100 |     100 |                   
 src/interfaces/web/payment                        |     100 |       75 |     100 |     100 |                   
  payment.controller.ts                            |     100 |       75 |     100 |     100 | 9-19              
 src/interfaces/web/payment/dto                    |     100 |      100 |     100 |     100 |                   
  pay-oder.dto.ts                                  |     100 |      100 |     100 |     100 |                   
 src/interfaces/web/product                        |     100 |       75 |     100 |     100 |                   
  product.controller.ts                            |     100 |       75 |     100 |     100 | 14                
---------------------------------------------------|---------|----------|---------|---------|-------------------
Jest: "global" coverage threshold for branches (80%) not met: 73.08%

Test Suites: 35 passed, 35 total
Tests:       183 passed, 183 total
Snapshots:   0 total
Time:        5.798 s
Ran all test suites.

```


