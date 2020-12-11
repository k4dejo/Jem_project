<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facturación</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
    integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
</head>

<body style="style=width: 100%">
    <header>
        <br>
        <img style="width: 160px; height: 80px" src="https://modajem.com/assets/Images/logoJem.png" alt=$>
        <span>Email: <strong>jemboutique@gmail.com</strong></span>
        <h4>Información Referente al comprobante</h4>
    </header>
   <main>
        <span><strong>Fecha Emisión:</strong> {{$invoice->date}}</span><br>
        <span><strong>Nombre del Cliente:</strong> {{$invoice->client}}</span><br>
        <span><strong>Correo Electrónico:</strong> {{$invoice->email}}</span>
        <span><strong>Teléfono:</strong> {{$invoice->phone}}</span>
        <div>
            <table  width="100%" style="width:100%; font-size: 10px" border="0" cellpadding="0"  class="table table-striped mb-5">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th colspan="5" scope="col">Producto</th>
                        <th scope="col">Talla</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Precio</th>
                    </tr>
                </thead>
                <tbody>
                @foreach( $invoice->products ?? '' as $products)
                    <tr>
                        <th scope="col">{{ $products->id }}</th>
                        <td colspan="5">{{ $products->name }}</td>
                        <td>{{ $products->pivot->amount }}</td>
                        <td>{{ $products->pivot->size }}</td>
                        <td>{{ $products->pricePublic }}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    </main>
    <footer>
        <span><strong>Envío:</strong> ₡ {{ $invoice->shipping }}</span>
        <span><strong>Total:</strong> ₡ {{$invoice->totalPrice}}</span>
    </footer>
</body>
</html>
