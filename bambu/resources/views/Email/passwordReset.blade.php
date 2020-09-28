@component('mail::message')
#MODAJEM.COM Recuperacion de contraseña
Se le envía este correo porque ha solicitado una recuperación de contraseña en nuestra plataforma.
Si usted no ha solicitado un cambio de contraseña, ignore este correo.
Si ha solicitado un cambio de contraseña click en el botón para cambiar tu contraseña

@component('mail::button', ['url' => 'https://modajem.com/changePassword?token='.$token])
Restablecer Contraseña
@endcomponent

Gracias,<br>
@endcomponent
