/**
 * ScarGrid - Biblioteca JavaScript para tabelas interativas
 * @version 0.6.0
 * @author Gilmar A S Trindade
 * @license MIT
 */

// Importa o core principal
// (Futuramente importaremos módulos separados)
import ScarGrid from './core/scargrid.js';

// Exporta como padrão
export default ScarGrid;

// Exporta também como named export
export { ScarGrid };

// Para uso direto no browser via <script>
if (typeof window !== 'undefined') {
  window.ScarGrid = ScarGrid;
}
