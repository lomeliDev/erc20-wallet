# erc20-wallet

[![N|Solid](https://lomeli.io/assets/img/logo.png)](https://lomeli.io)



## Introducción
Es un paquete para poder trabajar con tokens y ethereum , para enviar y recibir.

## Instalación

Instalar desde npm:

```bash
npm i erc20-wallet -s
```

Luego debemos importar el paquete a nuestro proyecto

```bash
let erc20 = require('erc20-wallet');
```

Una vez que lo importemos ahora si podemos empezar a trabajar con el.

## Configuracion de inicio de primera vez

**1.- Lo primero que debemos hacer es crear el seed de 12 palabras.**
Para poder crearlo debemos ingresar un password y una palabra alfanumerica para encriptar el seed con esos parametros.
Ese seed el usuario debe guardarlo ya que con el restaura la wallet en cualquier momento.
Primero creamos el password y la palabra alfanumerica de la siguiente manera:

```js
erc20.password = 'mypassword';
erc20.mySeed = 'mipalabraalfanumerica8989';
```

Despues de ingresar mi password y mi palabra alfanumerica , proseguimos a crear el seed de la siguiente manera:
```js
    await erc20.createSeed().then((response) => {
        erc20.seed = response;
    }).catch((error) => {
        console.error(error);
    });
```

**Nota :** El seed te recomiendo guardarlo en la variable erc20.seed ya que lo vamos a necesitar para crear el keystore o el wallet mas adelante.

Ahora nos toca crear el keystore o el wallet , la primera vez que lo creamos debemos guardarlo en un archivo localmente para posteriormente solo lo mandamos a llamar y no creamos el seed o un nuevo wallet. Se crea de la siguiente manera:

```js
    await erc20.createdStored().then((response) => {
        erc20.keystore = response;
    }).catch((error) => {
        console.error(error);
    });
```

La respuesta debemos guardarla en la variable erc20.keystore ya que lo mandaremos a llamar despues.

Ahora nos toca crear las direcciones de ethereum , aqui debemos definir la cantidad de wallets a crear y despues mandar a llamar el metodo para crearlas , para configurar la cantidad es de la siguiente manera:

```js
erc20.numAddr = 10;

await erc20.generateAddress().then((response) => {
     erc20.address = response;
}).catch((error) => {
     console.error(error);
});
```

Esto nos creara 10 wallets y nos regresara un json de la siguiente manera:

```js
[ 
  { address: '0xxxxxxxxxxxxxxxxxxxxxxxxxx' },
  { address: '0xxxxxxxxxxxxxxxxxxxxxxxxxx' },
  { address: '0xxxxxxxxxxxxxxxxxxxxxxxxxx' }
]
```

Una vez terminando este proceso , seguimos con el paso donde ya se creo el seed, se crearon las wallets y direcciones, ahora solo nos falta guardar el keystore en un archivo local, ya que ese archivo lo mandaremos a llamar cada vez que requiramos hacer algo , estos pasos anteriores , solamente son la primera vez que se configura todo. Lo siguiente es con el keystore guardado en el archivo.

Para guardar el keystore en un archivo, primero debemos mandarlo a llamar para que nos cree un json stringify, lo mandamos a crear de la siguiente manera:

```js
    await erc20.encodeJson().then((response) => {
        console.log(response);
    }).catch((error) => {
        console.error(error);
    });
```

La respuesta la mandamos a guardar en un archivo.

**Ahora para decodificarlo y configurarlo para las demas acciones es de la siguiente manera:**

```js
    erc20.keystoreJson = 'Aqui va el contenido del archivo que guardamos';
    await erc20.decodeJson().then((response) => {
        erc20.keystore = response;
    }).catch((error) => {
        console.error(error);
    });
```
En donde dice erc20.keystoreJson va el contenido que guardamos en el archivo.
La respuesta debemos guardarla en erc20.keystore , ya que es donde se guarda el keystore para ser llamado para envio de transaciones.


# Configuracion del token

Debemos configurar la direccion del contrato inteligente, asi mismo las decimales , el simbolo y el nombre , se hace de la siguiente manera:
```js
    erc20.tokenAddr = 'Direcion eth del token';
    erc20.tokenDecimals = 18; //las decimales del token
    erc20.tokenSymbol = ''; //El simbolo del token
    erc20.tokenName = ''; // El nombre del token
```

Si solamente sabes la direccion , configura la direccion del token , y existe un metodo que te regresa las decimales, el simbolo y el nombre del token , se llama de la siguiente manera:
```js
    erc20.tokenAddr = 'Direcion eth del token';
    await erc20.getDataToken().then((response) => {
        erc20.tokenSymbol = response.symbol;
        erc20.tokenName = response.name;
        erc20.tokenDecimals = response.decimals;
    }).catch((error) => {
        console.error(error);
    });
```

El metodo te regresa la info y los guardas en sus respectivas variables.


# Balances eth y tokens

Para ver balances configurar primero el provider, es decir la red o un nodo de geth , en este caso yo recomiendo usar infigura , se configura de la siguiente manera:
```js
    erc20.provider = 'https://ropsten.infura.io/v3/d487f3a42598413dbc5d5c5aff7edaae';
```

En este caso estoy usando la red de pruebas ropsten , registrate en infura, crea un proyecto y configuralo , en el caso que sea mainet , pones el provider de mainet.

Para poder ver el saldo eth de una direccion se hace de la siguiente manera:
```js
    await erc20.getBalanceAddress('address').then((response) => {
        console.log(response);
    }).catch((error) => {
        console.error(error);
    });
```
En donde dice address alli va la direccion de ethereum , el te regresara la cantidad de saldo en eth.


Para poder ver el saldo de tokens de una direccion se hace de la siguiente manera:
```js
    await erc20.getTokenAddress('address').then((response) => {
        console.log(response);
    }).catch((error) => {
        console.error(error);
    });
```
En donde dice address alli va la direccion de ethereum , el te regresara la cantidad de saldo de tokens.


# Envio de Ethereum
Primero debes configurar el provider, visto en el paso anterior.

Antes de enviar ethereum te recomiendo calcular el gaslimit y gasprice , esto sirve para calcular que comision nos cobrara la red de ethereum, debemos mandar nuestra direccion de la cual enviaremos, tambien la direccion destino y la cantidad de eth a enviar.

```js
    await erc20.calculateGasLimitEth('DireccionLocal', 'DireccionDestinatario', cantidad).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.error(error);
    });
```

Esto nos regresara un json con los datos de gasLimit y gasPrice que al momento de enviar la transaccion debemos enviar, estos datos son los calculados de la red actual. La respuesta del json es la siguiente:
```js
{ gasLimit: 21000, gasPrice: 1050000000 }
```

Esta es una respuesta que nos devolvio el calculo.


Ahora para enviar una transacion debemos ingresar nuestro password con el cual creamos nuestra wallet , mi direcion de origen , direcion destino , cantidad, gasPrice y gasLimit , para enviar se hace de la siguiente manera:

```js
    await erc20.sendETH('password', 'DireccionLocal', 'DireccionDestinatario', cantidad, gasPrice, gasLimit).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.error(error);
    });
```

Este te regresara el hash si la transaccion fue exitosa.



# Envio de Tokens
Primero debes configurar el provider, visto en el paso anterior.

Antes de enviar tokens te recomiendo calcular el gaslimit y gasprice , esto sirve para calcular que comision nos cobrara la red de ethereum, debemos mandar nuestra direccion de la cual enviaremos, tambien la direccion destino y la cantidad de eth a enviar.

```js
    await erc20.calculateGasLimitToken('DireccionLocal', 'DireccionDestinatario', cantidad).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.error(error);
    });
```

Esto nos regresara un json con los datos de gasLimit y gasPrice que al momento de enviar la transaccion debemos enviar, estos datos son los calculados de la red actual. La respuesta del json es la siguiente:
```js
{ gasLimit: 40308, gasPrice: 1050000000 }
```

Esta es una respuesta que nos devolvio el calculo.


Ahora para enviar una transacion debemos ingresar nuestro password con el cual creamos nuestra wallet , mi direcion de origen , direcion destino , cantidad, gasPrice y gasLimit , para enviar se hace de la siguiente manera:

```js
    await erc20.sendTokens('password', 'DireccionLocal', 'DireccionDestinatario', cantidad, gasPrice, gasLimit).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.error(error);
    });
```

Este te regresara el hash si la transaccion fue exitosa.


# Configurar api etherscan para listado de transacciones
Primero debemos crear una cuenta en etherscan.io y crear una api , o en su defecto dejar la default, lo que si debemos configurar es la red, decir si es ropsten o mainet y el timeout, se hace de la siguiente manera:

```js
    erc20.apikeyEtherScan = 'YourApiKey';
    erc20.networkEtherScan = 'ropsten';
    erc20.timeoutScan = '3000';
```
Las redes que soporta son :
**morden** //Esta es la mainet
**ropsten**
**rinkeby**


# Listado de transacciones ETH
Esto es para regresar el listado de transacciones enviadas y recibidas de una direccion. Se hace la llamada de la siguiente manera:

En DireccionLocal va mi direccion.

```js
    await erc20.getTxtEth('DireccionLocal').then((response) => {
        console.log(response);
    }).catch((error) => {
        console.error(error);
    });
```

Esto nos regresara un json de la siguiente manera:

```js
[ { type: 'Sent',
    blockNumber: '7327297',
    timeStamp: '1581701462',
    hash:
     '0xeb144420c9edba10281646b357877ac0debeec5ecdde6174b87175ec8f746b07',
    nonce: 18,
    from: '0xd353a3fd2a91dbc1faea041b0d1901a7a0978434',
    to: '0xf3edd3916edcc0ee8f76ad0d33f2bcf0c424d899',
    value: 0.001,
    gas: 21630,
    gasPrice: 1.197971241e-9,
    isError: 0,
    confirmations: 62 },
  { type: 'Received',
    blockNumber: '7270076',
    timeStamp: '1580945739',
    hash:
     '0xa2d4969333699440f54a1e7fc634cb19ccee5b9baf5d8a246fc3e8b82d79d706',
    nonce: 29486096,
    from: '0x81b7e08f65bdf5648606c89998a9cc8164397647',
    to: '0xd353a3fd2a91dbc1faea041b0d1901a7a0978434',
    value: 1,
    gas: 21000,
    gasPrice: 2e-9,
    isError: 0,
    confirmations: 57283 },
  { type: 'Received',
    blockNumber: '7270075',
    timeStamp: '1580945723',
    hash:
     '0xbef98dca4a169799b813f26a95b9db040cd7a842915959a29114b3ca4cfe6a7d',
    nonce: 29486094,
    from: '0x81b7e08f65bdf5648606c89998a9cc8164397647',
    to: '0xd353a3fd2a91dbc1faea041b0d1901a7a0978434',
    value: 1,
    gas: 21000,
    gasPrice: 2e-9,
    isError: 0,
    confirmations: 57284 },
  { type: 'Received',
    blockNumber: '7270073',
    timeStamp: '1580945690',
    hash:
     '0xca72913e032b0dc96da8861470d83733f10c8b0e58a8a202ebe0a76e06d86314',
    nonce: 29486092,
    from: '0x81b7e08f65bdf5648606c89998a9cc8164397647',
    to: '0xd353a3fd2a91dbc1faea041b0d1901a7a0978434',
    value: 1,
    gas: 21000,
    gasPrice: 2e-9,
    isError: 0,
    confirmations: 57286 },
  { type: 'Received',
    blockNumber: '7269361',
    timeStamp: '1580936345',
    hash:
     '0x0a43818a1d4a8e1ae5049c09d2ef854225ec4829b012f545dcfc05a05321d279',
    nonce: 41,
    from: '0x8ab9af40b0e5ef87a8ab94149ff9cb06d5fcd599',
    to: '0xd353a3fd2a91dbc1faea041b0d1901a7a0978434',
    value: 0.05,
    gas: 21000,
    gasPrice: 6e-9,
    isError: 0,
    confirmations: 57998 } ]
```
Este es un ejemplo , isError si es 1 es transaccion erronea, si es 0 es transaccion exitosa.






# Listado de transacciones de Tokens
Esto es para regresar el listado de transacciones enviadas y recibidas de una direccion. Se hace la llamada de la siguiente manera:

En DireccionLocal va mi direccion.

```js
    await erc20.getTxtTokens('DireccionLocal').then((response) => {
        console.log(response);
    }).catch((error) => {
        console.error(error);
    });
```

Esto nos regresara un json de la siguiente manera:
```js
[ { type: 'Sent',
    blockNumber: '7310213',
    timeStamp: '1581481211',
    hash:
     '0x50c9c168a02ff2a3855650f8941f6b01280bdb0e831569a78f7d505350704148',
    nonce: 17,
    from: '0xd353a3fd2a91dbc1faea041b0d1901a7a0978434',
    to: '0x5bc6452d23386effed5651912b3fdac2f4595f67',
    value: 1,
    gas: 57583,
    gasPrice: 5.5e-9,
    isError: 0,
    confirmations: 17173 },
  { type: 'Received',
    blockNumber: '7269372',
    timeStamp: '1580936482',
    hash:
     '0x598da68aabb7837c766805f722ae1956eed70ab936de8faf6765fd991ff7517f',
    nonce: 42,
    from: '0x8ab9af40b0e5ef87a8ab94149ff9cb06d5fcd599',
    to: '0xd353a3fd2a91dbc1faea041b0d1901a7a0978434',
    value: 15,
    gas: 80083,
    gasPrice: 8e-9,
    isError: 0,
    confirmations: 58014 } ]

```

Este es un ejemplo , isError si es 1 es transaccion erronea, si es 0 es transaccion exitosa.

# Recuperar Wallet
Debemos enviar las 12 palabras clabes que guardamos de nuestro seed, y crear un password

```js
erc20.seed = 'MIs 12 palabras';
erc20.password = 'Un password';
```

Despues creamos el keystore , y una vez hecho eso lo demas de crear las wallets y demas es lo mismo que los pasos anteriores

```js
    await erc20.createdStored().then((response) => {
        erc20.keystore = response;
    }).catch((error) => {
        console.error(error);
    });
```


## Errores y contribuciones

Para un error escribir directamente el problema en github issues o enviarlo
al correo miguel@lomeli.io. Si desea contribuir con el proyecto por favor enviar un email.

#Miguel Lomeli , #MiguelLomeli , #Lomeli , #Toopago , #ethereum , #tokens , #wallets , #erc20
