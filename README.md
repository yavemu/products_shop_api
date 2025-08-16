## Description

Este proyecto esta diseñado para realizar el flujo completo de compra de un producto, desde la creación de la orden hasta la confirmación y entrega de la compra. 

Utiliza la API de Wompi para realizar la transacción de pago y la entrega de la compra.

## Repositorio

* Backend: [https://github.com/yavemu/products_shop_api](https://github.com/yavemu/products_shop_api)
* Frontend: [https://github.com/yavemu/products_shop](https://github.com/yavemu/products_shop)

## Instalación

Para instalar el proyecto, sigue estos pasos:

1. Clona el repositorio en tu computadora.
2. Abre un terminal en la carpeta del proyecto.
3. Ejecuta el comando `npm install` para instalar las dependencias del proyecto.
4. Configura las variables de entorno en el archivo `.env`, puedes utilizar el archivo `.env.example` como referencia.
4.1. La variable de entorno `DB_SYNCHRONIZE` debe ser `true` para evitar la sincronización de la base de datos.
4. Ejecuta el comando `npm run seed:products` para cargar productos en la base de datos.

## Comandos

- `npm install`: Instala las dependencias del proyecto.
- `npm run start:dev`: Inicia el servidor en modo desarrollo.
- `npm run seed:products`: Ejecuta la semilla para cargar productos en la base de datos.


## Documentación Swagger

Para acceder a la documentación Swagger, visita la URL
[http://localhost:3000/apidoc](http://localhost:3000/apidoc)  en tu navegador. El puerto 3000 es el puerto por defecto utilizado por el servidor y definidido en el archivo `.env.example`.

### Endpoints

### Pruebas de Wompi
- `POST /run-credit-card-wompi-flow`: Realiza el flujo completo de compra con tarjeta de crédito utilizando Wompi. Este endpoint se deja disponible para pruebas y demostraciones del funcionamiento de la API de Wompi de forma independiente.

### Productos
- Consultar Productos `GET /products`: Obtiene una lista de productos disponibles en la tienda.
- Consultar Producto `GET /products/:id`: Obtiene los detalles de un producto específico.




