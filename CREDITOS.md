# Créditos de imágenes

Fotografías de terceros usadas en el simulador de condiciones visuales de la home, descargadas de Pexels bajo la [Licencia de Pexels](https://www.pexels.com/license/) (uso comercial y personal libre, no requiere atribución, no requiere permiso). Se documenta la procedencia igualmente por buena práctica.

## Escena LEJOS

- **Archivo**: `src/assets/images/home/vision-simulator/lejos.jpg`
- **Descripción**: pizarra de una cafetería a media distancia sobre una pared de piedra, con mesas y sillas nítidas en primer plano — reemplaza a la foto anterior de una calle de San Francisco, cuyo letrero de referencia era demasiado pequeño para notarse desenfocado incluso a tamaño completo, sobre todo a los ~350px de un móvil real (Bloque 11).
- **Autor**: Thắng-Nhật Trần
- **Fuente**: https://www.pexels.com/photo/17594265/ ("Cafe Seats on a Street by a Stone Wall")
- **Licencia**: Pexels License (gratuita, uso comercial libre, sin atribución requerida)
- **Resolución original**: 3000×2002 px
- **Recorte**: se recortó a 2100×1400 px (proporción 3:2) para eliminar a una persona y un letrero de marca ("URBANO Kitchen and Bar") visibles en el tercio derecho del encuadre original — se prioriza el requisito de "sin rostros/marcas reconocibles" sobre conservar la resolución completa; el recorte resultante sigue siendo suficiente para el contenedor renderizado (≤1100px, tope `max-height:60vh`). La pizarra (elemento que se desenfoca) ocupa el 46.1% del ancho de la imagen recortada, medido por análisis de píxeles.

## Escena CERCA

- **Archivo**: `src/assets/images/home/vision-simulator/cerca.jpg`
- **Descripción**: letrero de madera "OPEN" colgado de un poste en primer plano, con la terraza nítida de un restaurante detrás — reemplaza a la foto anterior de un teléfono/valle (Bloque 10), que en retrospectiva no tenía texto real en pantalla, el problema de fondo que motivó este cambio.
- **Autor**: Deane Bayas
- **Fuente**: https://www.pexels.com/photo/10127265/ ("Charming outdoor café with open sign, patio seating, and inviting ambiance")
- **Licencia**: Pexels License (gratuita, uso comercial libre, sin atribución requerida)
- **Resolución original**: 3000×2000 px (sin recortar: la única persona visible queda pequeña, de espaldas/perfil y fuera de foco, no reconocible)
- **Nota**: el letrero "OPEN" (con su marco, que incluye el texto "Basil Seasonal Dinning") ocupa el 35.7% del ancho de la imagen, medido por análisis de píxeles — muy por encima del mínimo del 15% buscado.

## Escena NOCHE

- **Archivo**: `src/assets/images/home/vision-simulator/noche.jpg`
- **Descripción**: calle urbana mojada de noche, con farolas y luces de neón aisladas sobre fondo oscuro.
- **Autor**: Mathias Reding
- **Fuente**: https://www.pexels.com/photo/wet-city-street-with-lights-during-night-time-11213185/
- **Licencia**: Pexels License (gratuita, uso comercial libre, sin atribución requerida)
- **Resolución original**: 6240×3510 px
