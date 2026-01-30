import type { ProductOption } from '../../../types';
import './SizeSelector.css';

interface SizeSelectorProps {
  option: ProductOption;
  selectedValue: string | undefined;
  availableValues: Set<string>;
  onSelect: (optionName: string, value: string) => void;
}

export function SizeSelector({
  option,
  selectedValue,
  availableValues,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div className="size-selector" role="group" aria-label={`${option.title} selection`}>
      <label className="size-label">{option.title}:</label>
      <div className="size-buttons">
        {option.values.map((optionValue) => {
          const isSelected = selectedValue === optionValue.value;
          const isAvailable = availableValues.has(optionValue.value);

          return (
            <button
              key={optionValue.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${option.title} ${optionValue.value}`}
              disabled={!isAvailable}
              className={`
                size-button
                ${isSelected ? 'size-button-selected' : ''}
                ${!isAvailable ? 'size-button-unavailable' : ''}
              `.trim()}
              onClick={() => onSelect(option.title, optionValue.value)}
            >
              {optionValue.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
