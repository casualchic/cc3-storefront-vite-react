import { X } from '@/lib/icons';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

interface SizeMeasurement {
  size: string;
  [key: string]: string;
}

interface SizeGuide {
  title: string;
  measurements: SizeMeasurement[];
}

export function SizeGuideModal({ isOpen, onClose, category = 'general' }: SizeGuideModalProps) {
  if (!isOpen) return null;

  // Size guide data based on category
  const sizeGuides: Record<string, SizeGuide> = {
    tops: {
      title: 'Tops Size Guide',
      measurements: [
        { size: 'XS', bust: '32-34', waist: '24-26', hips: '34-36' },
        { size: 'S', bust: '34-36', waist: '26-28', hips: '36-38' },
        { size: 'M', bust: '36-38', waist: '28-30', hips: '38-40' },
        { size: 'L', bust: '38-40', waist: '30-32', hips: '40-42' },
        { size: 'XL', bust: '40-42', waist: '32-34', hips: '42-44' },
      ],
    },
    bottoms: {
      title: 'Bottoms Size Guide',
      measurements: [
        { size: 'XS', waist: '24-26', hips: '34-36', inseam: '30' },
        { size: 'S', waist: '26-28', hips: '36-38', inseam: '30' },
        { size: 'M', waist: '28-30', hips: '38-40', inseam: '31' },
        { size: 'L', waist: '30-32', hips: '40-42', inseam: '31' },
        { size: 'XL', waist: '32-34', hips: '42-44', inseam: '32' },
      ],
    },
    dresses: {
      title: 'Dresses Size Guide',
      measurements: [
        { size: 'XS', bust: '32-34', waist: '24-26', hips: '34-36', length: '36' },
        { size: 'S', bust: '34-36', waist: '26-28', hips: '36-38', length: '37' },
        { size: 'M', bust: '36-38', waist: '28-30', hips: '38-40', length: '38' },
        { size: 'L', bust: '38-40', waist: '30-32', hips: '40-42', length: '39' },
        { size: 'XL', bust: '40-42', waist: '32-34', hips: '42-44', length: '40' },
      ],
    },
    general: {
      title: 'General Size Guide',
      measurements: [
        { size: 'XS', bust: '32-34', waist: '24-26', hips: '34-36' },
        { size: 'S', bust: '34-36', waist: '26-28', hips: '36-38' },
        { size: 'M', bust: '36-38', waist: '28-30', hips: '38-40' },
        { size: 'L', bust: '38-40', waist: '30-32', hips: '40-42' },
        { size: 'XL', bust: '40-42', waist: '32-34', hips: '42-44' },
      ],
    },
  };

  const guide = sizeGuides[category] || sizeGuides.general;
  const columns = Object.keys(guide.measurements[0]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {guide.title}
          </h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Measurement Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white capitalize"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guide.measurements.map((row: SizeMeasurement, index: number) => (
                  <tr
                    key={index}
                    className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    {columns.map((column) => (
                      <td
                        key={column}
                        className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400"
                      >
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Measurement Instructions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              How to Measure
            </h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <strong className="text-gray-900 dark:text-white">Bust:</strong> Measure around the fullest part of your bust, keeping the tape parallel to the floor.
              </div>
              <div>
                <strong className="text-gray-900 dark:text-white">Waist:</strong> Measure around the narrowest part of your natural waistline.
              </div>
              <div>
                <strong className="text-gray-900 dark:text-white">Hips:</strong> Measure around the fullest part of your hips, about 7-9 inches below your waistline.
              </div>
              {category === 'bottoms' && (
                <div>
                  <strong className="text-gray-900 dark:text-white">Inseam:</strong> Measure from the top of your inner thigh to your ankle.
                </div>
              )}
              {category === 'dresses' && (
                <div>
                  <strong className="text-gray-900 dark:text-white">Length:</strong> Measure from the highest point of your shoulder to the desired hemline.
                </div>
              )}
            </div>
          </div>

          {/* Fit Tips */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Fit Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• All measurements are in inches</li>
              <li>• If you're between sizes, we recommend sizing up for a more comfortable fit</li>
              <li>• Our garments are designed to fit true to size</li>
              <li>• For the most accurate measurement, have someone help you measure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
