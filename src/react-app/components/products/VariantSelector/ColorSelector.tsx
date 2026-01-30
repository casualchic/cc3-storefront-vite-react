import { Check } from 'lucide-react';
import type { ProductOption } from '../../../types';
import './ColorSelector.css';

interface ColorSelectorProps {
  option: ProductOption;
  selectedValue: string | undefined;
  availableValues: Set<string>;
  onSelect: (optionName: string, value: string) => void;
}

export function ColorSelector({
  option,
  selectedValue,
  availableValues,
  onSelect,
}: ColorSelectorProps) {
  return (
    <div className="color-selector" role="group" aria-label={`${option.title} selection`}>
      <div className="color-label">{option.title}:</div>
      <div className="color-swatches">
        {option.values.map((optionValue) => {
          const isSelected = selectedValue === optionValue.value;
          const isAvailable = availableValues.has(optionValue.value);
          const hexColor = (optionValue.metadata?.hex as string) || '#cccccc';

          return (
            <button
              key={optionValue.id}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${option.title} ${optionValue.value}`}
              disabled={!isAvailable}
              className={`
                color-button
                ${isSelected ? 'color-button-selected' : ''}
                ${!isAvailable ? 'color-button-unavailable' : ''}
              `.trim()}
              onClick={() => onSelect(option.title, optionValue.value)}
              title={optionValue.value}
            >
              <span
                className="color-swatch"
                style={{ backgroundColor: hexColor }}
                aria-hidden="true"
              >
                {isSelected && <Check size={16} className="color-check" />}
              </span>
              <span className="color-name">{optionValue.value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
