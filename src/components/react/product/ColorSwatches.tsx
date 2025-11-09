/**
 * ColorSwatches Component
 * Color selection with visual swatches
 */

interface ColorSwatchesProps {
  colors: ColorOption[];
  selectedColor: string | null;
  onColorChange: (color: string) => void;
  disabled?: boolean;
}

export interface ColorOption {
  value: string;
  label: string;
  hexCode?: string;
  imageUrl?: string;
  available: boolean;
  inventory?: number;
}

export default function ColorSwatches({
  colors,
  selectedColor,
  onColorChange,
  disabled = false,
}: ColorSwatchesProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-heading text-sm font-semibold text-forest">
          Color
        </label>
        {selectedColor && (
          <span className="text-sm text-charcoal">
            {colors.find(c => c.value === selectedColor)?.label}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = selectedColor === color.value;
          const isAvailable = color.available && !disabled;

          return (
            <button
              key={color.value}
              type="button"
              onClick={() => isAvailable && onColorChange(color.value)}
              disabled={!isAvailable}
              className={`
                relative w-12 h-12 rounded-full transition-all
                ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                ${!isAvailable ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}
              `}
              aria-label={`Select color ${color.label}`}
              aria-pressed={isSelected}
              title={color.label}
            >
              {/* Color swatch */}
              <div
                className={`w-full h-full rounded-full border-2 ${
                  isSelected ? 'border-white' : 'border-neutral'
                } shadow-sm overflow-hidden`}
                style={{
                  backgroundColor: color.hexCode || '#f3f4f6',
                  backgroundImage: color.imageUrl ? `url(${color.imageUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Out of stock overlay */}
                {!color.available && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-charcoal transform -rotate-45" />
                  </div>
                )}

                {/* Low stock indicator */}
                {isAvailable && color.inventory !== undefined && color.inventory > 0 && color.inventory <= 3 && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-secondary rounded-full border border-white" />
                )}
              </div>

              {/* Selected checkmark */}
              {isSelected && isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Out of stock message */}
      {selectedColor && !colors.find(c => c.value === selectedColor)?.available && (
        <p className="text-sm text-secondary flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          This color is currently out of stock
        </p>
      )}
    </div>
  );
}
