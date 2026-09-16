// ⚠️ Todos los valores numéricos de este archivo (stdDeviation, radios de
// máscara, equivalencias en dioptrías) son un punto de partida para un
// prototipo visual con fines educativos. DEBEN ser revisados y ajustados por
// una optometrista antes de publicar el simulador: no son mediciones
// clínicas ni pretenden representar con precisión ninguna condición.

export type ConditionId = 'miopia' | 'astigmatismo' | 'presbicia';

// 'filter': un único <img> con filter: url(#...), aplicado a toda la imagen.
// 'filter-mask': imagen base sin alterar + una segunda copia con filtro,
// recortada con mask-image a la zona donde debe verse el efecto.
export type ConditionTechnique = 'filter' | 'filter-mask';

export interface ConditionConfig {
    id: ConditionId;
    label: string;
    technique: ConditionTechnique;
    // Escena fija de esta condición (no seleccionable por separado: cada
    // condición solo se aprecia bien en la escena donde es más notoria).
    scene: {
        // Basename bajo assets/images/home/vision-simulator/, sin sufijo de ancho ni extensión.
        basename: string;
        alt: string;
        // Dimensiones del fallback .jpg (máx. 1200px de ancho), para el width/height del <img>.
        width: number;
        height: number;
    };
    // Texto de la etiqueta derecha del divisor, ej. "Con miopía".
    withLabel: string;
    // Dioptría aproximada que representa esta condición (a revisar por optometrista).
    diopterApprox: string;
    // 2-3 frases, tono divulgativo, sin diagnósticos ni cifras clínicas.
    description: string;
    // feGaussianBlur uniforme (miopía).
    blur?: number;
    // feGaussianBlur direccional "x y" (astigmatismo): estira las luces en un eje,
    // a diferencia del desenfoque uniforme de la miopía.
    directionalBlur?: string;
    // Presbicia (filter-mask): desenfoque del primer plano y radio/posición de la
    // máscara radial que recorta ese efecto a la zona del libro/primer plano.
    foregroundBlur?: number;
    maskRadiusPercent?: number;
}

export const VISION_SIMULATOR_CONDITIONS: ConditionConfig[] = [
    {
        id: 'miopia',
        label: 'Miopía',
        technique: 'filter',
        scene: {
            basename: 'lejos',
            alt: 'Calle del centro de una ciudad, vacía, con letreros y señales de tránsito visibles a distancia',
            width: 1200,
            height: 800
        },
        withLabel: 'Con miopía',
        diopterApprox: 'Aproximadamente -2.00 D (miopía moderada)',
        description:
            'Ver de lejos cuesta: los letreros, los rostros al otro lado de la calle o los semáforos se perciben borrosos. De cerca, en cambio, la visión suele mantenerse clara y nítida.',
        // stdDeviation uniforme (mismo valor en X e Y): borrosidad pareja en toda la imagen.
        blur: 6
    },
    {
        id: 'astigmatismo',
        label: 'Astigmatismo',
        technique: 'filter',
        scene: {
            basename: 'noche',
            alt: 'Calle urbana mojada de noche, con farolas y luces de neón aisladas sobre fondo oscuro',
            width: 1200,
            height: 675
        },
        withLabel: 'Con astigmatismo',
        diopterApprox: 'Aproximadamente -1.50 D cilíndricas',
        description:
            'Las luces y los bordes se perciben arrastrados o estirados en una sola dirección, como si no terminaran de enfocar. De noche, cada farol o foco de auto se alarga en vez de verse como un punto definido.',
        // stdDeviation "x y" con valores muy distintos: el eje que más se estira es lo
        // característico del astigmatismo frente al desenfoque parejo de la miopía.
        directionalBlur: '1 9'
    },
    {
        id: 'presbicia',
        label: 'Presbicia',
        technique: 'filter-mask',
        scene: {
            basename: 'cerca',
            alt: 'Manos sosteniendo un libro abierto con texto legible en primer plano',
            width: 1200,
            height: 885
        },
        withLabel: 'Con presbicia',
        diopterApprox: 'Aproximadamente +1.50 D de adición',
        description:
            'El texto cercano —un libro, una etiqueta, el teléfono— pierde nitidez, mientras que lo que está más alejado se sigue viendo con claridad. Suele notarse con el paso de los años, al alejar instintivamente lo que se lee para enfocarlo mejor.',
        // Desenfoque solo en el primer plano (el libro); el fondo queda intacto,
        // justo lo contrario de la miopía.
        foregroundBlur: 7,
        maskRadiusPercent: 55
    }
];
